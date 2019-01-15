"use strict"

/**************************** config ****************************/
const PLANET = 'earth';
const URL_PREFIX = `https://kh.google.com/rt/${PLANET}/`;
let DL_DIR = './downloaded_files';
const [OBJ_SCALE, OBJ_MOVE_X, OBJ_MOVE_Y, OBJ_MOVE_Z] = [1/30, 89946, 141738, -130075]; // prevents jitter in 3d viewers
/****************************************************************/

/*************************** cmd line ***************************/
function cmd() {
	let errors = [];
	let argv = process.argv.slice(2);
	let optional = argv.slice(2);
	let [octant, max_level] = argv;	
	if ([octant, max_level].includes(undefined)) {
		errors.push(null);
	} else {
		if (!/^[0-7]{2,32}$/.test(octant)) errors.push('Invalid octant.');
		if (!/^\d{1,2}$/.test(max_level)) errors.push('Invalid max_level.');
		if (optional.filter(o => !['--dump-json', '--dump-raw'].includes(o)).length > 0) errors.push('Invalid parameters.');
	}
	if (errors.length > 0) {
		const invoc = `node ${require('path').basename(__filename)}`;
		console.error(`Usage:`);
		console.error(`  ${invoc} [octant] [max_level] [[--dump-json]] [[--dump-raw]]`);
		console.error(`  ${invoc} 20527061605273514 20`);
		errors.filter(e => e).forEach(e => console.error(`Error: ${e}`));
		process.exit(1);
	}
	return [octant, parseInt(max_level), optional.includes('--dump-json'), optional.includes('--dump-raw')];
}
/****************************************************************/

const [OCTANT, MAX_LEVEL, DUMP_JSON, DUMP_RAW] = cmd();
const [DUMP_JSON_DIR, DUMP_RAW_DIR] = [DL_DIR + '/json', DL_DIR + '/raw'];

let execSync = require('child_process').execSync;
const fs = require('fs');
const bmp = require('bmp-js');
const decodeDXT = require('decode-dxt');
const decodeResource = require('./lib/decode-resource');

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

	let planetoid = await getPlanetoid();
	let rootEpoch = planetoid.bulkMetadataEpoch[0];
	const DIR = DL_DIR + `/obj/${OCTANT}-${MAX_LEVEL}-${rootEpoch}`;

	let dir = DIR;

	execSync(`rm -Rf ${dir}`);
	execSync(`mkdir -p ${dir}`);
	fs.appendFileSync(`${dir}/model.obj`, `mtllib model.mtl\n`);

	async function possNext(nodePath, forceAll = false) {
		for (var bulk = null, epoch = rootEpoch, index = -1, i = 4; i < nodePath.length + 4; i += 4) {
			let bulkPath = nodePath.substring(0, i - 4);
			let subPath = nodePath.substring(0, i);

			let nextBulk = await getBulk(bulkPath, epoch);
			bulk = nextBulk;
			index = traverse(subPath, bulk.childIndices);
			epoch = bulk.bulkMetadataEpoch[index];
		}
		if (index < 0) throw new Error('Node not available');
		var node = await getNode(nodePath, bulk, index);

		if (forceAll) return [0, 1, 2, 3, 4, 5, 6, 7]

		// hax
		var dict = {}
		node.meshes.forEach(mesh => {
			for (var i = 0; i < mesh.vertices.length; i += 8) {
				dict[mesh.vertices[i + 3]] = true
			}
		})
		var keys = Object.keys(dict).map(k => parseInt(k));
		if (keys.filter(k => k >= 0 && k <= 7).length != keys.length) {
			throw new Error("invalid w: " + keys);
		}
		return keys;
	}

	async function extract(nodePath, prev, exclude) {

		for (var bulk = null, epoch = rootEpoch, index = -1, i = 4; i < nodePath.length + 4; i += 4) {
			let bulkPath = nodePath.substring(0, i - 4);
			let subPath = nodePath.substring(0, i);

			let nextBulk = await getBulk(bulkPath, epoch);
			bulk = nextBulk;
			index = traverse(subPath, bulk.childIndices);
			epoch = bulk.bulkMetadataEpoch[index];
		}
		if (index < 0) throw new Error('Node not available');
		var node = await getNode(nodePath, bulk, index);
		var pre = prev;

		for (let [k, v] of Object.entries(node.meshes)) {
			var res = "";
			let meshIndex = k;
			let objName = `${nodePath}_${meshIndex}`;
			var obj = writeOBJ(objName, node, node.meshes[meshIndex], exclude, pre);
			res += obj.content;

			let tex = node.meshes[meshIndex].texture;
			let texName = `tex_${nodePath}_${meshIndex}`;

			fs.appendFileSync(`${dir}/model.obj`, `usemtl ${texName}\n`);
			fs.appendFileSync(`${dir}/model.obj`, res);

			
			const texFmts = {
				1: { ext: 'jpg' },
				6: { ext: 'bmp' },
			};

			if (!texFmts[tex.textureFormat]) throw new Error("can't handle texture format");
			const ext = texFmts[tex.textureFormat].ext;

			fs.appendFileSync(`${dir}/model.mtl`, `
newmtl ${texName}
Ka 1.000000 1.000000 1.000000
Kd 1.000000 1.000000 1.000000
Ks 0.000000 0.000000 0.000000
Tr 1.000000
illum 1
Ns 0.000000
map_Kd ${texName}.${ext}
			`);

			switch (tex.textureFormat) {
				// jpeg (saved as .jpg)
				case 1:
					fs.appendFileSync(`${dir}/${texName}.jpg`, new Buffer(new Buffer(tex.bytes)));
					break;
				// dxt1 (saved as .ppm)
				case 6:
					var bytes = tex.bytes
					var buf = new Buffer(bytes);
					var abuf = new Uint8Array(buf).buffer;
					var imageDataView = new DataView(abuf, 0, bytes.length);
					var rgbaData = decodeDXT(imageDataView, tex.width, tex.height, 'dxt1');
					var bmpData = [];

					// ABGR
					for (var i = 0; i < rgbaData.length; i += 4) {
						bmpData.push(255);
						bmpData.push(rgbaData[i + 2]);
						bmpData.push(rgbaData[i + 1]);
						bmpData.push(rgbaData[i + 0]);
					}

					var rawData = bmp.encode({
						data: bmpData, width: tex.width, height: tex.height,
					});
					fs.appendFileSync(`${dir}/${texName}.bmp`, rawData.data);
					break;
			}

			pre = obj;
		}
		return pre;
	}

	var prev = null

	var keys = [];
	async function search(k, level = 999) {
		if (k.length > level) return;
		try {
			var nxt = await possNext(k);
			console.log("found: " + k)
			keys.push(k);
		} catch (ex) {
			return;
		}
		for (var i = 0; i < nxt.length; i++) {
			await search(k + "" + nxt[i], level);
		}
	}

	await search(OCTANT, MAX_LEVEL);

	console.log("octants: " + keys.length);
	keys.sort();
	keys.reverse();

	var excluders = {};

	var prev = null;

	for (var k = null, i = 0; i < keys.length; i++) {
		k = keys[i];

		let idx = parseInt(k.substring(k.length - 1, k.length));
		let parentKey = k.substring(0, k.length - 1);

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

	var str = "";
	var indices = mesh.indices;
	var vertices = mesh.vertices;
	var normals = mesh.normals;

	var _c_v = prev ? prev.c_v : 0;
	var _c_n = prev ? prev.c_n : 0;
	var _c_u = prev ? prev.c_u : 0;

	var c_v = _c_v;
	var c_n = _c_n;
	var c_u = _c_u;

	let console = { log: function (s) { str += s + "\n" } };

	console.log(`o planet_${name}`);

	console.log("# vertices");
	for (var i = 0; i < vertices.length; i += 8) {

		var x = vertices[i + 0]
		var y = vertices[i + 1]
		var z = vertices[i + 2]
		var w = 1;

		var _x = 0;
		var _y = 0;
		var _z = 0;
		var _w = 0;

		const ma = payload.matrixGlobeFromMesh;
		_x = x * ma[0] + y * ma[4] + z * ma[8] + w * ma[12];
		_y = x * ma[1] + y * ma[5] + z * ma[9] + w * ma[13];
		_z = x * ma[2] + y * ma[6] + z * ma[10] + w * ma[14];
		_w = x * ma[3] + y * ma[7] + z * ma[11] + w * ma[15];

		x = _x;
		y = _y;
		z = _z;

		// hack: scale and move to keep 3d viewer from jittering
		console.log(`v ${x * OBJ_SCALE + OBJ_MOVE_X} ${y * OBJ_SCALE + OBJ_MOVE_Y} ${z * OBJ_SCALE + OBJ_MOVE_Z}`);

		c_v++;
	}

	if (mesh.uvOffsetAndScale) {
		console.log("# UV");
		for (var i = 0; i < vertices.length; i += 8) {
			var u1 = vertices[i + 4];
			var u2 = vertices[i + 5];
			var v1 = vertices[i + 6];
			var v2 = vertices[i + 7];

			var u = u2 * 256 + u1;
			var v = v2 * 256 + v1;

			var ut = (u + mesh.uvOffsetAndScale[0]) * mesh.uvOffsetAndScale[2];
			var vt = (v + mesh.uvOffsetAndScale[1]) * mesh.uvOffsetAndScale[3];

			var tex = mesh.texture;
			if (tex.textureFormat == 6)
				console.log(`vt ${ut} ${1 - vt}`)
			else
				console.log(`vt ${ut} ${vt}`)
			c_u++;
		}
	}

	console.log("# Normals");
	for (var i = 0; i < normals.length; i += 4) {
		var x = normals[i + 0] - 127;
		var y = normals[i + 1] - 127;
		var z = normals[i + 2] - 127;
		var w = 0;

		var _x = 0;
		var _y = 0;
		var _z = 0;
		var _w = 0;

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

	var triangle_groups = {};
	for (var i = 0; i < indices.length - 2; i += 1) {
		if (i === mesh.layerBounds[3]) break;
		var a = indices[i + 0],
			b = indices[i + 1],
			c = indices[i + 2];
		if (a == b || a == c || b == c) {
			continue;
		}

		var n = a + 1
		var o = b + 1
		var p = c + 1

		if (!(vertices[a * 8 + 3] === vertices[b * 8 + 3] && vertices[b * 8 + 3] === vertices[c * 8 + 3])) {
			throw new Error("vertex w mismatch");
		}
		var w = vertices[a * 8 + 3];

		if (shouldExclude(w)) continue;
		triangle_groups[w] = [].concat(triangle_groups[w] || [], [(i & 1) ? [a, c, b] : [a, b, c]]);
	}

	for (var k in triangle_groups) {
		if (!triangle_groups.hasOwnProperty(k)) throw new Error("no k property");
		var triangles = triangle_groups[k];

		for (var t in triangles) {
			if (!triangles.hasOwnProperty(t)) throw new Error("no t property");
			var v = triangles[t];
			var a = v[0] + 1, b = v[1] + 1, c = v[2] + 1;

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
	for (var c = -1, e = path, f = (e.length - 1) - ((e.length - 1) % 4); f < e.length; ++f)
		c = childIndices[8 * (c + 1) + (e.charCodeAt(f) - 48)];
	return c;
}

async function getNode(path, bulk, index) {

	let nodeEpoch = bulk.epoch[index];
	let nodeImgEpoch = bulk.imageryEpochArray ? bulk.imageryEpochArray[index] : bulk.defaultImageryEpoch;
	let nodeTexFormat = bulk.textureFormatArray ? bulk.textureFormatArray[index] : bulk.defaultTextureFormat;
	let nodeFlags = bulk.flags[index];

	let imgEpochPart = nodeFlags & 16 ? `!3u${nodeImgEpoch}` : '';
	let url = `!1m2!1s${path}!2u${nodeEpoch}!2e${nodeTexFormat}${imgEpochPart}!4b0`

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

	let payload = await fetchAsync(`${URL_PREFIX}${url}`);
	let data = await decodeResource(command, payload);
	let res = data.payload;

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

// https url fetcher
function fetchAsync(url) {
	return new Promise((resolve, reject) => {
		let chunks = []
		require("https").get(url, resp => resp
			.on("data", d => chunks.push(d))
			.on("end", () => resolve(Buffer.concat(chunks)))
			.on("error", reject)
		).on("error", reject)
	})
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

