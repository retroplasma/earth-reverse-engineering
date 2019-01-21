"use strict";

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

	throw `Invalid latitude and longitude`;
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

module.exports = function init({ getPlanetoid, getBulk, bulk: { traverse } }) {

	return async function convertLatLongToOctant(lat, lon, maxLevel, log = _ => {}) {

		if (isNaN(lat) || !(-90 <= lat && lat <= 90)) {
			throw `Invalid latitude: ${lat}`;
		}
		if (isNaN(lon) || !(-180 <= lon && lon <= 180)) {
			throw `Invalid longitude: ${lon}`;
		}

		log(lat + ', ' + lon);
		log('-------------');

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

		let octant = null;

		async function search(nodePath, box, maxLevel) {
			if (nodePath.length > maxLevel) return;
			try {
				const node_existed = await checkNodePath(nodePath);
				if (!node_existed) return;

				octant = nodePath;
				log(nodePath, box);

				const [next_key, next_box] = getNextOctant(box, lat, lon)

				await search(nodePath + "" + next_key, next_box, maxLevel);
				await search(nodePath + "" + (next_key + 4), next_box, maxLevel);
			} catch (ex) {
				console.error(ex)
				return;
			}
		}

		let [nodePath, latlonbox] = getFirstOctant(lat, lon)
		await search(nodePath, latlonbox, maxLevel);

		return octant;
	}
}