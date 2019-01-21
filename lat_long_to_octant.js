"use strict"

/**************************** config ****************************/
const PLANET = 'earth';
const URL_PREFIX = `https://kh.google.com/rt/${PLANET}/`;
const MAX_LEVEL = 18;
/****************************************************************/

const utils = require('./lib/utils')({
	URL_PREFIX, DUMP_JSON_DIR: null, DUMP_RAW_DIR: null, DUMP_JSON: false, DUMP_RAW: false
});

const latLongToOctant = require('./lib/convert-lat-long-to-octant')(utils);

/***************************** main *****************************/
async function run() {

	let [lat, lon] = [process.argv[2], process.argv[3]];

	if ([lat, lon].includes(undefined)) {
		const invoc = `node ${require('path').basename(__filename)}`;
		console.error(`Usage:`);
		console.error(`  ${invoc} [latitude] [longitude]`);
		console.error(`  ${invoc} 37.420806884765625 -122.08419799804688`);
		process.exit(1);
	}

	await latLongToOctant(parseFloat(lat), parseFloat(lon), MAX_LEVEL, console.log);	
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
