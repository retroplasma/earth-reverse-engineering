"use strict"

const fs = require('fs-extra');
const path = require('path');
const decodeTexture = require('./lib/decode-texture');

/**************************** config ****************************/
const PLANET = 'earth';
const URL_PREFIX = `https://kh.google.com/rt/${PLANET}/`;
const DL_DIR = './downloaded_files';
const [DUMP_OBJ_DIR, DUMP_JSON_DIR, DUMP_RAW_DIR] = ['obj', 'json', 'raw'].map(x => path.join(DL_DIR, x));
const { OCTANTS, MAX_LEVEL, DUMP_JSON, DUMP_RAW, PARALLEL_SEARCH } = require('./lib/parse-command-line')(__filename);
const DUMP_OBJ = !(DUMP_JSON || DUMP_RAW);
/****************************************************************/

const { getPlanetoid, getBulk, getNode, bulk: { getIndexByPath, hasBulkMetadataAtIndex, hasNodeAtIndex } } = require('./lib/utils')({
	URL_PREFIX, DUMP_JSON_DIR, DUMP_RAW_DIR, DUMP_JSON, DUMP_RAW
});

/***************************** main *****************************/
async function run() {

	const planetoid = await getPlanetoid();
	const rootEpoch = planetoid.bulkMetadataEpoch[0];

	let objCtx;
	if (DUMP_OBJ) {
		const objDir = path.join(DUMP_OBJ_DIR, `${OCTANTS.join('+')}-${MAX_LEVEL}-${rootEpoch}`);
		fs.removeSync(objDir);
		fs.ensureDirSync(objDir);
		objCtx = initCtxOBJ(objDir);
	}

	let octants = 0;

	const search = initNodeSearch(rootEpoch, PARALLEL_SEARCH ? 16 : 1,
		function nodeFound(path) {
			console.log('found', path);
			octants++;
		},
		function nodeDownloaded(path, node, octantsToExclude) {
			console.log('downloaded', path);
			DUMP_OBJ && writeNodeOBJ(objCtx, node, path, octantsToExclude);
		}
	);

	for (const oct of OCTANTS) {
		await search(oct, MAX_LEVEL);
	}

	console.log('octants', octants)
}
/****************************************************************/

/**************************** search ****************************/
function initNodeSearch(rootEpoch, numParallelBranches = 1, nodeFound = null, nodeDownloaded = null) {
	const sem = semaphore(numParallelBranches - 1);

	return async function search(k, maxLevel = 999) {
		if (k.length > maxLevel) return false;

		let check;
		try {
			check = await checkNodeAtNodePath(rootEpoch, k);
			if (check === null) return false;
		} catch (ex) {
			console.error(ex);
			return false;
		}

		try {
			nodeFound && nodeFound(k);
		} catch (ex) {
			console.error('Unhandled nodeFound callback error', ex);
			return false;
		}

		const [promises, results] = [[], []];

		for (const oct of [0, 1, 2, 3, 4, 5, 6, 7]) {
			promises.push((async function fn() {
				try {
					results.push({ oct, res: await search(k + oct, maxLevel) });
					if (results.length === 8) {
						const octs = results.filter(({ res }) => res).map(({ oct }) => oct)
						const node = await getNode(k, check.bulk, check.index);
						try {
							nodeDownloaded && nodeDownloaded(k, node, octs);
						} catch (ex) {
							console.error('Unhandled nodeDownload callback error');
							throw ex;
						}
					}
				} finally {
					await new Promise((r, _) => setImmediate(r));
					sem.signal();
				}
			})());

			await sem.wait(true);
		}

		try {
			await Promise.all(promises);
		} catch (ex) {
			console.error(ex);
			return false;
		}
		return true;
	};
}

async function checkNodeAtNodePath(rootEpoch, nodePath) {
	let bulk = null, index = -1;
	for (let epoch = rootEpoch, i = 4; i < nodePath.length + 4; i += 4) {
		const bulkPath = nodePath.substring(0, i - 4);
		const subPath = nodePath.substring(0, i);

		if (bulk) {
			const idx = getIndexByPath(bulk, bulkPath);
			if (hasBulkMetadataAtIndex(bulk, idx)) return null;
		}

		const nextBulk = await getBulk(bulkPath, epoch);

		bulk = nextBulk;
		index = getIndexByPath(bulk, subPath);
		epoch = bulk.bulkMetadataEpoch[index];
	}
	if (index < 0) return null;
	if (!hasNodeAtIndex(bulk, index)) return null;
	return { bulk, index };
}
/****************************************************************/

/**************************** export ****************************/
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

		const { buffer: buf, extension: ext } = decodeTexture(tex);
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
		const a = indices[i + 0];
		const b = indices[i + 1];
		const c = indices[i + 2];
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

/**************************** helper ****************************/
function semaphore(num) {
	let concurrent = num;
	const waiting = [];
	return {
		wait(highestPriority = false) {
			return new Promise((resolve, reject) => {
				if (concurrent <= 0) {
					if (highestPriority) {
						waiting.splice(0, 0, { resolve, reject });
					} else {
						waiting.push(({ resolve, reject }));
					}
				} else {
					concurrent--;
					resolve();
				}
			})
		},
		signal() {
			concurrent++;
			if (concurrent > 0) {
				if (waiting.length > 0) {
					concurrent--;
					waiting.splice(0, 1)[0].resolve();
				}
			}
		}
	};
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

