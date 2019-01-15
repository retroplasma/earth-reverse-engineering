"use strict"

module.exports = function parseCommandLine() {
	let errors = [];
	const argv = process.argv.slice(2);
	const optional = argv.slice(2);
	const [octant, max_level] = argv;	
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
	return {
		OCTANT: octant, 
		MAX_LEVEL: parseInt(max_level), 
		DUMP_JSON: optional.includes('--dump-json'), 
		DUMP_RAW: optional.includes('--dump-raw')
	};
}