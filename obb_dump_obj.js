"use strict"

const fs = require('fs-extra');
const path = require('path');

/**************************** config ****************************/
const PLANET = 'earth';
const URL_PREFIX = `https://kh.google.com/rt/${PLANET}/`;
const DL_DIR = './downloaded_files';
const [RESEARCH_DIR, DUMP_JSON_DIR, DUMP_RAW_DIR] = ['research', 'json', 'raw'].map(x => path.join(DL_DIR, x));
/****************************************************************/

const { getPlanetoid, getBulk, getNode, traverse } = require('./lib/utils')({
	URL_PREFIX, DUMP_JSON_DIR, DUMP_RAW_DIR, DUMP_JSON: false, DUMP_RAW: false
});

const earthRadius = 6371010;

/***************************** main *****************************/
async function run() {

	/*
	 * dumps oriented bounding boxes of first bulk metadata to obj files
	 */

	fs.ensureDirSync(RESEARCH_DIR);

	const planetoid = await getPlanetoid();
	const rootEpoch = planetoid.bulkMetadataEpoch[0];

	const bulk = await getBulk('', rootEpoch);

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

	for (const num of [2, 3, 4]) {
		let str = '';
		const w = s => str += s + '\n';

		const nodes = [];
		function next(oct, filter, max) {
			if (oct.length === max) return;
			for (const nxt of [0, 1, 2, 3, 4, 5, 6, 7].map(a => a.toString())) {
				const cur = oct + nxt;
				const idx = traverse(cur, bulk.childIndices);
				if (idx < 0) continue;
				if (filter.includes(cur.length)) {
					nodes.push(idx);
				}
				next(cur, filter, max)
			}
		}
		next("", [num], 4);

		let idx = 0;
		for (let i of nodes) {
			const [c, e, r] = [obbCenters[i], obbExtents[i], obbRotations[i]];
			const [x, y, z] = [c[0], c[1], c[2]];
			const [sx, sy, sz] = [e[0], e[1], e[2]];
			const rma = r;
			w(objCube(idx++, x, y, z, sx, sy, sz, rma));
		}

		fs.writeFileSync(path.join(RESEARCH_DIR, `test${num}.obj`), str);
	}
}
/****************************************************************/


/**************************** helper ****************************/
function objCube(idx, x, y, z, sx, sy, sz, rma) {

	// box is a cube first
	let box = [
		{ x: -1, y: -1, z: -1 },
		{ x: -1, y: -1, z: +1 },
		{ x: -1, y: +1, z: -1 },
		{ x: -1, y: +1, z: +1 },
		{ x: +1, y: -1, z: -1 },
		{ x: +1, y: -1, z: +1 },
		{ x: +1, y: +1, z: -1 },
		{ x: +1, y: +1, z: +1 },
	];

	// scale: apply obbExtents
	box = box.map(c => ({
		x: c.x * sx * 1,
		y: c.y * sy * 1,
		z: c.z * sz * 1,
	}));

	// rotate: apply obbRotations
	box = box.map(c => ({
		x: c.x * rma[0] + c.y * rma[1] + c.z * rma[2],
		y: c.x * rma[3] + c.y * rma[4] + c.z * rma[5],
		z: c.x * rma[6] + c.y * rma[7] + c.z * rma[8],
	}));

	// move: apply obbCenters
	box = box.map(c => ({
		x: c.x + x,
		y: c.y + y,
		z: c.z + z,
	}));

	/*
	// resize for 3d viewer
	box = box.map(c => ({
		x: c.x / 100,
		y: c.y / 100,
		z: c.z / 100,
	}));
	*/

	const i = idx * 8;
	const obj = `
		o test_${idx}

		${box.map(c => `v ${c.x} ${c.y} ${c.z}`).join('\n')}

		# vn  0.0  0.0  1.0
		# vn  0.0  0.0 -1.0
		# vn  0.0  1.0  0.0
		# vn  0.0 -1.0  0.0
		# vn  1.0  0.0  0.0
		# vn -1.0  0.0  0.0
		
		f  ${1 + i}//${2 + i}  ${7 + i}//${2 + i}  ${5 + i}//${2 + i}
		f  ${1 + i}//${2 + i}  ${3 + i}//${2 + i}  ${7 + i}//${2 + i} 
		f  ${1 + i}//${6 + i}  ${4 + i}//${6 + i}  ${3 + i}//${6 + i} 
		f  ${1 + i}//${6 + i}  ${2 + i}//${6 + i}  ${4 + i}//${6 + i} 
		f  ${3 + i}//${3 + i}  ${8 + i}//${3 + i}  ${7 + i}//${3 + i} 
		f  ${3 + i}//${3 + i}  ${4 + i}//${3 + i}  ${8 + i}//${3 + i} 
		f  ${5 + i}//${5 + i}  ${7 + i}//${5 + i}  ${8 + i}//${5 + i} 
		f  ${5 + i}//${5 + i}  ${8 + i}//${5 + i}  ${6 + i}//${5 + i} 
		f  ${1 + i}//${4 + i}  ${5 + i}//${4 + i}  ${6 + i}//${4 + i} 
		f  ${1 + i}//${4 + i}  ${6 + i}//${4 + i}  ${2 + i}//${4 + i} 
		f  ${2 + i}//${1 + i}  ${6 + i}//${1 + i}  ${8 + i}//${1 + i} 
		f  ${2 + i}//${1 + i}  ${8 + i}//${1 + i}  ${4 + i}//${1 + i}
	`.split('\n').map(s => s.trim()).join('\n');
	return obj;
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
