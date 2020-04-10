"use strict"

module.exports = function parseCommandLine(filename) {
	let errors = [];
	const argv = process.argv.slice(2);
	const { r: required, o: optional } = argv.reduce(
		({ r, o }, cur) => cur.indexOf('--') < 0 ? ({ r: [...r, cur], o }) : ({ r, o: [...o, cur] }),
		{ r: [], o: [] }
	);

	const octants = required.slice(0, required.length - 1);
	const [max_level] = required.slice(-1);

	if (octants.length === 0 || max_level === undefined) {
		errors.push(null);
	} else {
		if (octants.filter(o => /^[0-7]{2,32}$/.test(o)).length !== octants.length) errors.push('Invalid octants.');
		if (octants.filter((o, i) => octants.indexOf(o) === i).length !== octants.length) errors.push('Duplicate octants.');
		if (Object.keys(octants.reduce((acc, cur) => ({ ...acc, [cur.length]: 1 }), {})).length !== 1) errors.push('Octants must have equal levels.');
		if (!/^\d{1,2}$/.test(max_level)) errors.push('Invalid max_level.');
		if (optional.filter(o => !['--dump-json', '--dump-raw', '--parallel-search'].includes(o)).length > 0) errors.push('Invalid parameters.');
	}
	if (errors.length > 0) {
		const invoc = `node ${require('path').basename(filename)}`;
		console.error(`Usage:`);
		console.error(`  ${invoc} [octant_1] [octant_2] ... [octant_n] [max_level] [[--dump-json]] [[--dump-raw]] [[--parallel-search]]`);
		console.error(`  ${invoc} 20527061605273514 20`);
		console.error(`  ${invoc} 02 03 12 13 20 21 30 31 4`)
		errors.filter(e => e).forEach(e => console.error(`Error: ${e}`));
		process.exit(1);
	}

	return {
		OCTANTS: octants,
		MAX_LEVEL: parseInt(max_level),
		DUMP_JSON: optional.includes('--dump-json'),
		DUMP_RAW: optional.includes('--dump-raw'),
		PARALLEL_SEARCH: optional.includes('--parallel-search')
	};
}
