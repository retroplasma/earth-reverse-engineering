"use strict"

/**************************** config ****************************/
const PLANET = 'earth';
const URL_PREFIX = `https://kh.google.com/rt/${PLANET}/`;
/****************************************************************/

const { getPlanetoid, getBulk, traverse } = require('./lib/utils')({
	URL_PREFIX, DUMP_JSON_DIR: null, DUMP_RAW_DIR: null, DUMP_JSON: false, DUMP_RAW: false
});

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
