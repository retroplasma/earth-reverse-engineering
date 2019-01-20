"use strict"

const fs = require('fs-extra');
const path = require('path');
const decodeTexture = require('./lib/decode-texture');

/**************************** config ****************************/
const PLANET = 'earth';
const URL_PREFIX = `https://kh.google.com/rt/${PLANET}/`;
const DL_DIR = './downloaded_files';
const [DUMP_OBJ_DIR, DUMP_JSON_DIR, DUMP_RAW_DIR] = ['obj', 'json', 'raw'].map(x => path.join(DL_DIR, x));
const {OCTANT, MAX_LEVEL, DUMP_JSON, DUMP_RAW, PARALLEL_SEARCH} = require('./lib/parse-command-line')(__filename);
const DUMP_OBJ = !(DUMP_JSON || DUMP_RAW);
/****************************************************************/

const {getPlanetoid, getBulk, getNode, traverse} = require('./lib/utils')({
	URL_PREFIX, DUMP_JSON_DIR, DUMP_RAW_DIR, DUMP_JSON, DUMP_RAW
});

/***************************** main *****************************/
async function run() {

	const planetoid = await getPlanetoid();
	const rootEpoch = planetoid.bulkMetadataEpoch[0];

	const objDir = path.join(DUMP_OBJ_DIR, `${OCTANT}-${MAX_LEVEL}-${rootEpoch}`);
	if (DUMP_OBJ) {
		fs.removeSync(objDir);
		fs.ensureDirSync(objDir);		
	}

	async function guessNextOctants(nodePath, forceAll = false) {		
		const node = await getNodeFromNodePath(nodePath);
		if (node === null) return null;

		if (forceAll) return [0, 1, 2, 3, 4, 5, 6, 7]

		// use mesh octant mask to guess next nodes
		const dict = {}
		node.meshes.forEach(mesh => {
			for (let i = 0; i < mesh.vertices.length; i += 8) {
				dict[mesh.vertices[i + 3]] = true
			}
		})
		
		const keys = Object.keys(dict).map(k => parseInt(k));
		if (keys.filter(k => 0 <= k && k <= 7).length != keys.length) {
			// invalid w
			return null;
		}
		return keys;
	}

	async function getNodeFromNodePath(nodePath) {
		let bulk = null, index = -1;
		for (let epoch = rootEpoch, i = 4; i < nodePath.length + 4; i += 4) {
			const bulkPath = nodePath.substring(0, i - 4);
			const subPath = nodePath.substring(0, i);

			const nextBulk = await getBulk(bulkPath, epoch);
			bulk = nextBulk;
			index = traverse(subPath, bulk.childIndices);
			epoch = bulk.bulkMetadataEpoch[index];
		}
		if (index < 0) return null;
		const node = await getNode(nodePath, bulk, index);
		
		return node;
	}

	const keys = [];
	async function search(k, level = 999) {
		if (k.length > level) return;
		let nxt;
		try {
			nxt = await guessNextOctants(k);
			if (nxt === null) return;
			
			console.log("found: " + k)
			keys.push(k);
		} catch (ex) {			
			console.error(ex)
			return;
		}

		if (PARALLEL_SEARCH) {
			const promises = [];
			for (let i = 0; i < nxt.length; i++) {
				const x = search(k + "" + nxt[i], level);
				promises.push(x);
			}
			await Promise.all(promises);
		} else {
			for (let i = 0; i < nxt.length; i++) {
				await search(k + "" + nxt[i], level);
			}
		}
	}

	await search(OCTANT, MAX_LEVEL);

	console.log("octants: " + keys.length);

	if (DUMP_OBJ) {
		keys.sort();
		keys.reverse();

		const excluders = {};
		const objCtx = initCtxOBJ(objDir);

		for (let k = null, i = 0; i < keys.length; i++) {
			k = keys[i];

			const idx = parseInt(k.substring(k.length - 1, k.length));
			const parentKey = k.substring(0, k.length - 1);

			excluders[parentKey] = excluders[parentKey] || [];
			excluders[parentKey].push(idx);

			const node = await getNodeFromNodePath(k);
			writeNodeOBJ(objCtx, node, k, excluders[k] || []);
		}
	}
}
/****************************************************************/



/**************************** helper ****************************/
function initCtxOBJ(dir) {
	fs.writeFileSync(path.join(dir, 'model.obj'), `mtllib model.mtl\n`);
	return { objDir: dir, c_v: 0, c_n: 0, c_u: 0 };
}

function writeNodeOBJ(ctx, node, nodeName, exclude) {
	for (const [meshIndex, mesh] of Object.entries(node.meshes)) {
		const meshName = `${nodeName}_${meshIndex}`;		
		const tex = mesh.texture;
		const texName = `tex_${nodeName}_${meshIndex}`;

		const obj = writeMeshOBJ(ctx, meshName, texName, node, mesh, exclude);
		fs.appendFileSync(path.join(ctx.objDir, 'model.obj'), obj);		


		const {buffer: buf, extension: ext} = decodeTexture(tex);
		fs.appendFileSync(path.join(ctx.objDir, 'model.mtl'), `
			newmtl ${texName}
			Ka 1.000000 1.000000 1.000000
			Kd 1.000000 1.000000 1.000000
			Ks 0.000000 0.000000 0.000000
			Tr 1.000000
			illum 1
			Ns 0.000000
			map_Kd ${texName}.${ext}
		`.split('\n').map(s => s.trim()).join('\n'));

		fs.writeFileSync(path.join(ctx.objDir, `${texName}.${ext}`), buf);
	}
}

function writeMeshOBJ(ctx, meshName, texName, payload, mesh, exclude) {

	function shouldExclude(w) {
		return (exclude instanceof Array)
			? exclude.indexOf(w) >= 0
			: false;
	}

	let str = "";
	const indices = mesh.indices;
	const vertices = mesh.vertices;
	const normals = mesh.normals;

	const _c_v = ctx.c_v;
	const _c_n = ctx.c_n;
	const _c_u = ctx.c_u;

	let c_v = _c_v;
	let c_n = _c_n;
	let c_u = _c_u;

	const console = { log: function (s) { str += s + "\n" } };

	console.log(`usemtl ${texName}`);
	console.log(`o planet_${meshName}`);

	console.log("# vertices");
	for (let i = 0; i < vertices.length; i += 8) {

		let x = vertices[i + 0]
		let y = vertices[i + 1]
		let z = vertices[i + 2]
		let w = 1;

		let _x = 0;
		let _y = 0;
		let _z = 0;
		let _w = 0;

		const ma = payload.matrixGlobeFromMesh;
		_x = x * ma[0] + y * ma[4] + z * ma[8] + w * ma[12];
		_y = x * ma[1] + y * ma[5] + z * ma[9] + w * ma[13];
		_z = x * ma[2] + y * ma[6] + z * ma[10] + w * ma[14];
		_w = x * ma[3] + y * ma[7] + z * ma[11] + w * ma[15];

		x = _x;
		y = _y;
		z = _z;

		console.log(`v ${x} ${y} ${z}`);

		c_v++;
	}

	if (mesh.uvOffsetAndScale) {
		console.log("# UV");
		for (let i = 0; i < vertices.length; i += 8) {
			const u1 = vertices[i + 4];
			const u2 = vertices[i + 5];
			const v1 = vertices[i + 6];
			const v2 = vertices[i + 7];

			const u = u2 * 256 + u1;
			const v = v2 * 256 + v1;

			const ut = (u + mesh.uvOffsetAndScale[0]) * mesh.uvOffsetAndScale[2];
			const vt = (v + mesh.uvOffsetAndScale[1]) * mesh.uvOffsetAndScale[3];

			const tex = mesh.texture;
			if (tex.textureFormat == 6)
				console.log(`vt ${ut} ${1 - vt}`)
			else
				console.log(`vt ${ut} ${vt}`)
			c_u++;
		}
	}

	console.log("# Normals");
	for (let i = 0; i < normals.length; i += 4) {
		let x = normals[i + 0] - 127;
		let y = normals[i + 1] - 127;
		let z = normals[i + 2] - 127;
		let w = 0;

		let _x = 0;
		let _y = 0;
		let _z = 0;
		let _w = 0;

		const ma = payload.matrixGlobeFromMesh;
		_x = x * ma[0] + y * ma[4] + z * ma[8] + w * ma[12];
		_y = x * ma[1] + y * ma[5] + z * ma[9] + w * ma[13];
		_z = x * ma[2] + y * ma[6] + z * ma[10] + w * ma[14];
		_w = x * ma[3] + y * ma[7] + z * ma[11] + w * ma[15];

		x = _x;
		y = _y;
		z = _z;

		console.log(`vn ${x} ${y} ${z}`)
		c_n++;
	}

	console.log("# faces");

	const triangle_groups = {};
	for (let i = 0; i < indices.length - 2; i += 1) {
		if (i === mesh.layerBounds[3]) break;
		const a = indices[i + 0],
		      b = indices[i + 1],
		      c = indices[i + 2];
		if (a == b || a == c || b == c) {
			continue;
		}

		if (!(vertices[a * 8 + 3] === vertices[b * 8 + 3] && vertices[b * 8 + 3] === vertices[c * 8 + 3])) {
			throw new Error("vertex w mismatch");
		}
		const w = vertices[a * 8 + 3];

		if (shouldExclude(w)) continue;
		triangle_groups[w] = [].concat(triangle_groups[w] || [], [(i & 1) ? [a, c, b] : [a, b, c]]);
	}

	for (let k in triangle_groups) {
		if (!triangle_groups.hasOwnProperty(k)) throw new Error("no k property");
		const triangles = triangle_groups[k];

		for (let t in triangles) {
			if (!triangles.hasOwnProperty(t)) throw new Error("no t property");
			const v = triangles[t];
			const a = v[0] + 1, b = v[1] + 1, c = v[2] + 1;

			if (mesh.uvOffsetAndScale) {
				console.log(`f ${a + _c_v}/${a + _c_u}/${a + _c_n} ${b + _c_v}/${b + _c_u}/${b + _c_n} ${c + _c_v}/${c + _c_u}/${c + _c_n}`)
			} else {
				console.log(`f ${a + _c_v} ${b + _c_v} ${c + _c_v}`)
			}

		}
	}

	ctx.c_v = c_v;
	ctx.c_u = c_u;
	ctx.c_n = c_n;

	return str;
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

