"use strict"

/**************************** config ****************************/
const PLANET = 'earth';
const URL_PREFIX = `https://kh.google.com/rt/${PLANET}/`;
const MAX_LEVEL = 20;
/****************************************************************/

const { getPlanetoid, getBulk, getNode, traverse } = require('./lib/utils')({
	URL_PREFIX, DUMP_JSON_DIR: null, DUMP_RAW_DIR: null, DUMP_JSON: false, DUMP_RAW: false
});


function getFirstOctant(lat, lon) {
	if (lat < 0) {
		if (lon < -90) return ['02', { n: 0, s: -90, w: -180, e: -90 }];
		if (lon <   0) return ['03', { n: 0, s: -90, w: -90, e: 0 }];
		if (lon <  90) return ['12', { n: 0, s: -90, w: 0, e: 90 }];
		               return ['13', { n: 0, s: -90, w: 90, e: 180 }];
	}
	if (lat >= 0) {
		if (lon < -90) return ['20', { n: 90, s: 0, w: -180, e: -90 }];
		if (lon <   0) return ['21', { n: 90, s: 0, w: -90, e: 0 }];
		if (lon <  90) return ['30', { n: 90, s: 0, w: 0, e: 90 }];
		               return ['31', { n: 90, s: 0, w: 90, e: 180 }];
	}

	console.error(`Invalid latitude and longitude`);
	process.exit(1);
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

	if (!(-90 <= lat && lat <= 90)) {
		console.error(`Invalid latitude: ${lat}`);
		process.exit(1);
	}
	if (!(-180 <= lon && lon <= 180)) {
		console.error(`Invalid longitude: ${lon}`);
		process.exit(1);
	}

	console.log(lat + ', ' + lon)
	console.log('-------------')

	const planetoid = await getPlanetoid();
	const rootEpoch = planetoid.bulkMetadataEpoch[0];

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

	async function search(nodePath, maxLevel) {
		if (nodePath.length > maxLevel) return;
		try {
			const node = await getNodeFromNodePath(nodePath);
			if (node === null) return;

			console.log("found: " + nodePath)

			for (let i = 0; i < 8; i++) {
				await search(nodePath + "" + i, maxLevel);
			}

		} catch (ex) {
			console.error(ex)
			return;
		}
	}

	let [nodePath, latlonbox] = getFirstOctant(lat, lon)
	await search(nodePath, MAX_LEVEL);
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
