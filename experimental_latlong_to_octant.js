"use strict"

/**************************** config ****************************/
const PLANET = 'earth';
const URL_PREFIX = `https://kh.google.com/rt/${PLANET}/`;
/****************************************************************/

const { getPlanetoid, getBulk, traverse } = require('./lib/utils')({
	URL_PREFIX, DUMP_JSON_DIR: null, DUMP_RAW_DIR: null, DUMP_JSON: false, DUMP_RAW: false
});

const projector = require('ecef-projector');

const vec_sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const vec_dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const vec_len = a => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
const vec_norm = a => {
	const norm = vec_len(a);
	return { x: a.x / norm, y: a.y / norm, z: a.z / norm };
}

/***************************** main *****************************/
async function run() {

	const [lat, lon] = [parseFloat(process.argv[2]), parseFloat(process.argv[3])];

	if (isNaN(lat) || isNaN(lon)) {
		const invoc = `node ${require('path').basename(__filename)}`;
		console.error(`Usage:`);
		console.error(`  ${invoc} [latitude] [longitude]`);
		console.error(`  ${invoc} 37.420806884765625 -122.08419799804688`);
		process.exit(1);
	}

	// project lat long to ecef
	const [x, y, z] = projector.project(lat, lon, 6371010000);
	const vec = vec_norm({ x, y, z });

	const planetoid = await getPlanetoid();
	const rootEpoch = planetoid.bulkMetadataEpoch[0];

	const best = {};
	await search('', rootEpoch, 0)

	async function search(fullPath, epoch, n) {
		if (n === 6) return;
		if (n === 5) {
			const key = fullPath.substring(0, fullPath.length - 4);
			if (best[key] === 3) return;
			best[key] = (best[key] || 0) + 1;
			if (best[key] === 1) console.log('candidate: ' + key);
		}

		const bulk = await getBulk(fullPath, epoch);
		const paths = pathsWithIntersection(bulk, vec);
		const paths4 = paths.filter(p => p !== null && p.length === 4);

		const promises = [];
		for (const p of paths4) {
			promises.push(search(fullPath + p, bulk.bulkMetadataEpoch[traverse(p, bulk.childIndices)], n + 1));
		}
		await Promise.all(promises);
	};

	function pathsWithIntersection(bulk, vec) {
		let paths = [];
		const obbs = getOBB(bulk);

		for (let i = 0; i < obbs.length; i++) {
			const obb = obbs[i];

			const m = [
				obb.rotation[0], obb.rotation[1], obb.rotation[2], obb.center[0],
				obb.rotation[3], obb.rotation[4], obb.rotation[5], obb.center[1],
				obb.rotation[6], obb.rotation[7], obb.rotation[8], obb.center[2],
				0, 0, 0, 1
			];

			const matrix = [
				{ x: m[0], y: m[4], z: m[8], w: m[12] },
				{ x: m[1], y: m[5], z: m[9], w: m[13] },
				{ x: m[2], y: m[6], z: m[10], w: m[14] },
				{ x: m[3], y: m[7], z: m[11], w: m[15] },
			]

			const dist = testIntersectionRayOBB(
				{ x: 0, y: 0, z: 0 },
				vec,
				{ x: -obb.extent[0], y: -obb.extent[1], z: -obb.extent[2] },
				{ x: obb.extent[0], y: obb.extent[1], z: obb.extent[2] },
				matrix
			);

			if (dist !== null) {
				const path = idxToPath(i);
				paths.push(path);
			}
		}

		return paths;

		function idxToPath(idx) {
			// dirty inverse of traverse
			let result = null;
			function next(oct, max) {
				if (oct.length === max) return;
				for (const nxt of [0, 1, 2, 3, 4, 5, 6, 7].map(a => a.toString())) {
					const cur = oct + nxt;
					const i = traverse(cur, bulk.childIndices);
					if (i < 0) continue;
					if (i === idx) {
						result = cur;
						return;
					}
					next(cur, max)
				}
			}
			next("", 4);
			return result;
		}
	}
}

/*
 * JS version of
 * https://github.com/opengl-tutorials/ogl/blob/master/misc05_picking/misc05_picking_custom.cpp#L83
 */
function testIntersectionRayOBB(
	ray_origin,        // Ray origin, in world space
	ray_direction,     // Ray direction (NOT target position!), in world space. Must be normalize()'d.
	aabb_min,          // Minimum X,Y,Z coords of the mesh when not transformed at all.
	aabb_max,          // Maximum X,Y,Z coords. Often aabb_min*-1 if your mesh is centered, but it's not always the case.
	matrix             // Transformation applied to the mesh (which will thus be also applied to its bounding box)
) {

	let tMin = 0.0;
	let tMax = Infinity; //100000.0;
	//const threshold = 0.001;
	const threshold = 0.0000000001;

	const pos = { x: matrix[3].x, y: matrix[3].y, z: matrix[3].z };
	const delta = vec_sub(pos, ray_origin);

	// Test intersection with the 2 planes perpendicular to the OBB's X axis
	{
		const xaxis = { x: matrix[0].x, y: matrix[0].y, z: matrix[0].z };
		const e = vec_dot(xaxis, delta);
		const f = vec_dot(ray_direction, xaxis);

		if (Math.abs(f) > threshold) { // Standard case

			let t1 = (e + aabb_min.x) / f; // Intersection with the "left" plane
			let t2 = (e + aabb_max.x) / f; // Intersection with the "right" plane
			// t1 and t2 now contain distances betwen ray origin and ray-plane intersections

			// We want t1 to represent the nearest intersection, 
			// so if it's not the case, invert t1 and t2
			if (t1 > t2) {
				const w = t1; t1 = t2; t2 = w; // swap t1 and t2
			}

			// tMax is the nearest "far" intersection (amongst the X,Y and Z planes pairs)
			if (t2 < tMax)
				tMax = t2;
			// tMin is the farthest "near" intersection (amongst the X,Y and Z planes pairs)
			if (t1 > tMin)
				tMin = t1;

			// And here's the trick :
			// If "far" is closer than "near", then there is NO intersection.
			// See the images in the tutorials for the visual explanation.
			if (tMax < tMin)
				return null;

		} else { // Rare case : the ray is almost parallel to the planes, so they don't have any "intersection"
			if (-e + aabb_min.x > 0.0 || -e + aabb_max.x < 0.0)
				return null;
		}
	}

	// Test intersection with the 2 planes perpendicular to the OBB's Y axis
	// Exactly the same thing than above.
	{
		const yaxis = { x: matrix[1].x, y: matrix[1].y, z: matrix[1].z };
		const e = vec_dot(yaxis, delta);
		const f = vec_dot(ray_direction, yaxis);

		if (Math.abs(f) > threshold) {

			let t1 = (e + aabb_min.y) / f;
			let t2 = (e + aabb_max.y) / f;

			if (t1 > t2) {
				const w = t1; t1 = t2; t2 = w;
			}

			if (t2 < tMax)
				tMax = t2;
			if (t1 > tMin)
				tMin = t1;
			if (tMin > tMax)
				return null;

		} else {
			if (-e + aabb_min.y > 0.0 || -e + aabb_max.y < 0.0)
				return null;
		}
	}

	// Test intersection with the 2 planes perpendicular to the OBB's Z axis
	// Exactly the same thing than above.
	{
		const zaxis = { x: matrix[2].x, y: matrix[2].y, z: matrix[2].z };
		const e = vec_dot(zaxis, delta);
		const f = vec_dot(ray_direction, zaxis);

		if (Math.abs(f) > threshold) {

			let t1 = (e + aabb_min.z) / f;
			let t2 = (e + aabb_max.z) / f;

			if (t1 > t2) {
				const w = t1; t1 = t2; t2 = w;
			}

			if (t2 < tMax)
				tMax = t2;
			if (t1 > tMin)
				tMin = t1;
			if (tMin > tMax)
				return null;

		} else {
			if (-e + aabb_min.z > 0.0 || -e + aabb_max.z < 0.0)
				return null;
		}
	}

	// intersection_distance: distance between ray_origin and the intersection with the OBB
	return tMin;
}

function getOBB(bulk) {

	const obbCenters = [];
	for (let i = 0; i < bulk.obbCenters.length; null) {
		obbCenters.push([bulk.obbCenters[i++], bulk.obbCenters[i++], bulk.obbCenters[i++]]);
	}

	const obbExtents = [];
	for (let i = 0; i < bulk.obbExtents.length; null) {
		obbExtents.push([bulk.obbExtents[i++], bulk.obbExtents[i++], bulk.obbExtents[i++]]);
	}

	const obbRotations = [];
	for (let i = 0; i < bulk.obbRotations.length; null) {
		obbRotations.push([
			bulk.obbRotations[i++], bulk.obbRotations[i++], bulk.obbRotations[i++],
			bulk.obbRotations[i++], bulk.obbRotations[i++], bulk.obbRotations[i++],
			bulk.obbRotations[i++], bulk.obbRotations[i++], bulk.obbRotations[i++],
		]);
	}

	const obbs = [];
	for (let i = 0; i < obbCenters.length; i++) {
		obbs.push({
			center: obbCenters[i],
			extent: obbExtents[i],
			rotation: obbRotations[i],
		});
	}

	return obbs;
}

/****************************************************************/
(async function program() {
	await run();
})().then(() => {
	process.exit(0);
}).catch(e => {
	console.error(e);
	process.exit(1);
});