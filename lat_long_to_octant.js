"use strict"

/**************************** config ****************************/
const PLANET = 'earth';
const URL_PREFIX = `https://kh.google.com/rt/${PLANET}/`;
const MAX_LEVEL = 20;
/****************************************************************/

const { getPlanetoid, getBulk, traverse } = require('./lib/utils')({
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

function getNextOctant(box, lat, lon) {
	let { n, s, w, e } = box;
	const mid_lat = (n + s) / 2;
	const mid_lon = (w + e) / 2;

	let key = 0;

	if (lat < mid_lat) {
		// y = 0
		n = mid_lat;
	} else {
		// y = 1
		s = mid_lat;
		key += 2;
	}

	if (n === 90 || s === -90) {
		// x = 0
	} else if (lon < mid_lon) {
		// x = 0
		e = mid_lon;
	} else {
		// x = 1
		w = mid_lon;
		key += 1;
	}

	return [key, { n, s, w, e }];
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

	async function checkNodePath(nodePath) {
		let bulk = null, index = -1;
		for (let epoch = rootEpoch, i = 4; i < nodePath.length + 4; i += 4) {
			const bulkPath = nodePath.substring(0, i - 4);
			const subPath = nodePath.substring(0, i);

			const nextBulk = await getBulk(bulkPath, epoch);
			bulk = nextBulk;
			index = traverse(subPath, bulk.childIndices);
			epoch = bulk.bulkMetadataEpoch[index];
		}
		return (index >= 0);
	}

	async function search(nodePath, box, maxLevel) {
		if (nodePath.length > maxLevel) return;
		try {
			const node_existed = await checkNodePath(nodePath);
			if (!node_existed) return;

			console.log(nodePath, box)

			const [next_key, next_box] = getNextOctant(box, lat, lon)

			await search(nodePath + "" + next_key, next_box, maxLevel);
			await search(nodePath + "" + (next_key+4), next_box, maxLevel);
		} catch (ex) {
			console.error(ex)
			return;
		}
	}

	let [nodePath, latlonbox] = getFirstOctant(lat, lon)
	await search(nodePath, latlonbox, MAX_LEVEL);
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
