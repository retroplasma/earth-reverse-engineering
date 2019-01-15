"use strict"

/**************************** config ****************************/
const PLANET = 'earth';
const URL_PREFIX = `https://kh.google.com/rt/${PLANET}/`;
const DL_DIR = './downloaded_files';
const [DUMP_JSON_DIR, DUMP_RAW_DIR] = [DL_DIR + '/json', DL_DIR + '/raw'];

const {OCTANT, MAX_LEVEL, DUMP_JSON, DUMP_RAW} = require('./lib/parse-command-line')(process.argv.slice(2));
/****************************************************************/

let execSync = require('child_process').execSync;
const fs = require('fs');
const decodeResource = require('./lib/decode-resource');
const decodeTexture = require('./lib/decode-texture');
const getUrl = require('./lib/get-url');

if (DUMP_JSON || DUMP_RAW) {
	DUMP_JSON && execSync(`mkdir -p ${DUMP_JSON_DIR}`);
	DUMP_RAW && execSync(`mkdir -p ${DUMP_RAW_DIR}`);
	execSync = () => {};
	fs._appendFileSync = fs.appendFileSync;
	fs._writeFileSync = fs.writeFileSync;
	fs.appendFileSync = () => {};
	fs.writeFileSync = () => {};
}

/***************************** main *****************************/
async function run() {

	const planetoid = await getPlanetoid();
	const rootEpoch = planetoid.bulkMetadataEpoch[0];
	const DIR = DL_DIR + `/obj/${OCTANT}-${MAX_LEVEL}-${rootEpoch}`;
	const dir = DIR;

	execSync(`rm -Rf ${dir}`);
	execSync(`mkdir -p ${dir}`);
	fs.appendFileSync(`${dir}/model.obj`, `mtllib model.mtl\n`);

	async function possNext(nodePath, forceAll = false) {
		let bulk = null, index = -1;
		for (let epoch = rootEpoch, i = 4; i < nodePath.length + 4; i += 4) {
			const bulkPath = nodePath.substring(0, i - 4);
			const subPath = nodePath.substring(0, i);

			const nextBulk = await getBulk(bulkPath, epoch);
			bulk = nextBulk;
			index = traverse(subPath, bulk.childIndices);
			epoch = bulk.bulkMetadataEpoch[index];
		}
		if (index < 0) throw new Error('Node not available');
		const node = await getNode(nodePath, bulk, index);

		if (forceAll) return [0, 1, 2, 3, 4, 5, 6, 7]

		// hax
		const dict = {}
		node.meshes.forEach(mesh => {
			for (let i = 0; i < mesh.vertices.length; i += 8) {
				dict[mesh.vertices[i + 3]] = true
			}
		})
		const keys = Object.keys(dict).map(k => parseInt(k));
		if (keys.filter(k => k >= 0 && k <= 7).length != keys.length) {
			throw new Error("invalid w: " + keys);
		}
		return keys;
	}

	async function extract(nodePath, prev, exclude) {
		let bulk = null, index = -1;
		for (let epoch = rootEpoch, i = 4; i < nodePath.length + 4; i += 4) {
			const bulkPath = nodePath.substring(0, i - 4);
			const subPath = nodePath.substring(0, i);

			const nextBulk = await getBulk(bulkPath, epoch);
			bulk = nextBulk;
			index = traverse(subPath, bulk.childIndices);
			epoch = bulk.bulkMetadataEpoch[index];
		}
		if (index < 0) throw new Error('Node not available');
		const node = await getNode(nodePath, bulk, index);
		let pre = prev;

		for (let [k, v] of Object.entries(node.meshes)) {
			let res = "";
			const meshIndex = k;
			const objName = `${nodePath}_${meshIndex}`;
			const obj = writeOBJ(objName, node, node.meshes[meshIndex], exclude, pre);
			res += obj.content;

			const tex = node.meshes[meshIndex].texture;
			const texName = `tex_${nodePath}_${meshIndex}`;

			fs.appendFileSync(`${dir}/model.obj`, `usemtl ${texName}\n`);
			fs.appendFileSync(`${dir}/model.obj`, res);

			const {buffer: buf, extension: ext} = decodeTexture(tex);

			fs.appendFileSync(`${dir}/model.mtl`, `
				newmtl ${texName}
				Ka 1.000000 1.000000 1.000000
				Kd 1.000000 1.000000 1.000000
				Ks 0.000000 0.000000 0.000000
				Tr 1.000000
				illum 1
				Ns 0.000000
				map_Kd ${texName}.${ext}
			`.split('\n').map(s => s.trim()).join('\n'));

			fs.appendFileSync(`${dir}/${texName}.${ext}`, buf);

			pre = obj;
		}
		return pre;
	}

	const keys = [];
	async function search(k, level = 999) {
		if (k.length > level) return;
		let nxt;
		try {
			nxt = await possNext(k);
			console.log("found: " + k)
			keys.push(k);
		} catch (ex) {
			// ignore
			return;
		}
		for (let i = 0; i < nxt.length; i++) {
			await search(k + "" + nxt[i], level);
		}
	}

	await search(OCTANT, MAX_LEVEL);

	console.log("octants: " + keys.length);
	keys.sort();
	keys.reverse();

	const excluders = {};

	let prev = null;

	for (let k = null, i = 0; i < keys.length; i++) {
		k = keys[i];

		const idx = parseInt(k.substring(k.length - 1, k.length));
		const parentKey = k.substring(0, k.length - 1);

		excluders[parentKey] = excluders[parentKey] || [];
		excluders[parentKey].push(idx);

		prev = await extract(k, prev, excluders[k] || []);
	}
}
/****************************************************************/



/**************************** helper ****************************/

function writeOBJ(name, payload, mesh, exclude, prev) {

	function shouldExclude(w) {
		return (exclude instanceof Array)
			? exclude.indexOf(w) >= 0
			: false;
	}

	let str = "";
	const indices = mesh.indices;
	const vertices = mesh.vertices;
	const normals = mesh.normals;

	const _c_v = prev ? prev.c_v : 0;
	const _c_n = prev ? prev.c_n : 0;
	const _c_u = prev ? prev.c_u : 0;

	let c_v = _c_v;
	let c_n = _c_n;
	let c_u = _c_u;

	const console = { log: function (s) { str += s + "\n" } };

	console.log(`o planet_${name}`);

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

		const n = a + 1
		const o = b + 1
		const p = c + 1

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

	return { content: str, c_v, c_u, c_n };
}


// protobuf decoding constants
const CMD_BULK = 0;
const CMD_NODE = 3;

// get index by path
function traverse(path, childIndices) {
	let c = -1;
	for (let e = path, f = (e.length - 1) - ((e.length - 1) % 4); f < e.length; ++f)
		c = childIndices[8 * (c + 1) + (e.charCodeAt(f) - 48)];
	return c;
}

async function getNode(path, bulk, index) {

	const nodeEpoch = bulk.epoch[index];
	const nodeImgEpoch = bulk.imageryEpochArray ? bulk.imageryEpochArray[index] : bulk.defaultImageryEpoch;
	const nodeTexFormat = bulk.textureFormatArray ? bulk.textureFormatArray[index] : bulk.defaultTextureFormat;
	const nodeFlags = bulk.flags[index];

	const imgEpochPart = nodeFlags & 16 ? `!3u${nodeImgEpoch}` : '';
	const url = `!1m2!1s${path}!2u${nodeEpoch}!2e${nodeTexFormat}${imgEpochPart}!4b0`

	return await decode(CMD_NODE, `NodeData/pb=${url}`);
}

async function getPlanetoid(path, epoch) {
	return await decode(CMD_BULK, `PlanetoidMetadata`);
}

async function getBulk(path, epoch) {
	return await decode(CMD_BULK, `BulkMetadata/pb=!1m2!1s${path}!2u${epoch}`);
}

const CACHE_ENABLED = true;
const cache = {};

// download and decode map data
async function decode(command, url) {
	
	if (CACHE_ENABLED && cache[url]) {
		return cache[url];
	}

	const payload = await getUrl(`${URL_PREFIX}${url}`);
	const data = await decodeResource(command, payload);
	const res = data.payload;

	if (CACHE_ENABLED) {
		cache[url] = res;
	}

	if (DUMP_JSON || DUMP_RAW) {
		const fn = url.replace('/pb=', '');
		DUMP_JSON && fs._writeFileSync(`${DUMP_JSON_DIR}/${fn}.json`, JSON.stringify(res, null, 2));
		DUMP_RAW && fs._writeFileSync(`${DUMP_RAW_DIR}/${fn}.raw`, payload);
	}

	return res;
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

