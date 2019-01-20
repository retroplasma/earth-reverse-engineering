"use strict"

/**************************** config ****************************/
const PLANET = 'earth';
const URL_PREFIX = `https://kh.google.com/rt/${PLANET}/`;
/****************************************************************/

const { getPlanetoid, getBulk, traverse } = require('./lib/utils')({
	URL_PREFIX, DUMP_JSON_DIR: null, DUMP_RAW_DIR: null, DUMP_JSON: false, DUMP_RAW: false
});

let bestDistanceYet = Infinity;

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

	console.log(lat + ', ' + lon)
	console.log('-------------')

	const planetoid = await getPlanetoid();

	let listOfBest = null;

	await search('', planetoid.bulkMetadataEpoch[0], Infinity)

	async function search(fullPath, epoch) {
		const bulk = await getBulk(fullPath, epoch);

		let nodes = [];
		function next(oct) {
			if (oct.length === 4) return;

			for (const nxt of [0, 1, 2, 3, 4, 5, 6, 7].map(a => a.toString())) {
				const cur = oct + nxt;
				const idx = traverse(cur, bulk.childIndices);
				if (idx < 0) continue;
				nodes.push(cur)
				next(cur)
			}
		}
		next('');

		let grouped = [[], [], [], []];
		for (const n of nodes) {
			grouped[n.length - 1].push(n);
		}

		grouped.splice(0, 3);

		const dist = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

		listOfBest = [];

		let bestPath = null;
		for (let i = 0; i < grouped.length; i++) {
			const g = grouped[i];

			let [bestDist, la, lo, p] = [Infinity, null, null, null]

			for (const n of g) {
				if (bestPath && n.indexOf(bestPath) !== 0) continue;
				const ll = octantToLatLong(fullPath + n);
				if (ll === null) continue;
				const d = dist(ll.lat, ll.lon, lat, lon);

				if (d < bestDist)
					[bestDist, la, lo, p] = [d, ll.lat, ll.lon, n];
			}

			if (p === null) {
				return false;
			}

			for (const n of g) {
				if (bestPath && n.indexOf(bestPath) !== 0) continue;
				const ll = octantToLatLong(fullPath + n);
				if (ll === null) continue;
				const d = dist(ll.lat, ll.lon, lat, lon);

				if (d === bestDist)
					listOfBest.push({ n, ll });
			}

			bestPath = p;

			if (bestDist < bestDistanceYet) {
				bestDistanceYet = bestDist;
				console.log('new best distance: ' + bestDist);
				console.log('with coordinates: ' + la + ', ' + lo);
				console.log('octant: ' + fullPath + bestPath);
			}
		}

		if (bestPath.length !== 4) {
			console.error('stop');
			return true;
		}

		const promises = [];
		for (const { n } of listOfBest) {
			const x = search(fullPath + n, bulk.bulkMetadataEpoch[traverse(bestPath, bulk.childIndices)]);
			promises.push(x);
		}
		await Promise.all(promises);
	}
}

/*
 * JS version of @LexSong's python script
 * https://gist.github.com/LexSong/e2830be220542ac637e1ce476e771f79
 */
function octantToLatLong(octant) {
	const octants = {
		0: [0, 0, 0],
		1: [1, 0, 0],
		2: [0, 1, 0],
		3: [1, 1, 0],
		4: [0, 0, 1],
		5: [1, 0, 1],
		6: [0, 1, 1],
		7: [1, 1, 1],
	}

	const first = {
		'02': { n: 0, s: -90, w: -180, e: -90 },
		'03': { n: 0, s: -90, w: -90, e: 0 },
		'12': { n: 0, s: -90, w: 0, e: 90 },
		'13': { n: 0, s: -90, w: 90, e: 180 },
		'20': { n: 90, s: 0, w: -180, e: -90 },
		'21': { n: 90, s: 0, w: -90, e: 0 },
		'30': { n: 90, s: 0, w: 0, e: 90 },
		'31': { n: 90, s: 0, w: 90, e: 180 },
	}

	let box = first[octant.substring(0, 2)];
	let mid = null;

	for (const oct of octant.substring(2)) {
		const [x, y, z] = octants[oct];

		let { n, s, w, e } = box;
		mid = { lat: (n + s) / 2, lon: (w + e) / 2 };

		if (y === 0)
			n = mid.lat;
		else if (y === 1)
			s = mid.lat;
		else
			throw 'octantToLatLong error 1';

		if (n === 90 || s === -90) {
			box = { n, s, w, e };
			continue;
		}

		if (x === 0)
			e = mid.lon
		else if (x === 1)
			w = mid.lon
		else
			throw 'octantToLatLong error 2';

		box = { n, s, w, e };
	}

	return mid;
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
