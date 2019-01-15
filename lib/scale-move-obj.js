// see scale_move_obj.sh

module.exports = function scaleMoveObj([file_in, OBJ_SCALE, OBJ_MOVE_X, OBJ_MOVE_Y, OBJ_MOVE_Z]) {
	[OBJ_SCALE, OBJ_MOVE_X, OBJ_MOVE_Y, OBJ_MOVE_Z] = [OBJ_SCALE, OBJ_MOVE_X, OBJ_MOVE_Y, OBJ_MOVE_Z].map(parseFloat);
	
	const fs = require('fs');

	//const [file_in] = process.argv.slice(1);
	//if (file_in === undefined) {
	//	const invoc = `node ${require('path').basename(__filename)}`;
	//	console.error(`Usage: ${invoc} [obj_file]`);
	//	process.exit(1);
	//}

	if (!/\.obj$/.test(file_in) || !fs.existsSync(file_in)) {
		console.error(`no such obj file ${file_in}`);
		process.exit(1);
	}

	const file_out = `${file_in.match(/(.*)\.obj$/)[1]}.2.obj`;

	if (fs.existsSync(file_out)) {
		fs.unlinkSync(file_out);
	}

	const readline = require('readline');
	const io = readline.createInterface({
		input: fs.createReadStream(file_in),
		output: fs.createWriteStream(file_out),
	});

	io.on('line', line => {
		let new_line = line;
		if (/^v /.test(line)) {
			let [x, y, z] = line.split(' ').slice(1).map(parseFloat);
			x = x * OBJ_SCALE + OBJ_MOVE_X;
			y = y * OBJ_SCALE + OBJ_MOVE_Y;
			z = z * OBJ_SCALE + OBJ_MOVE_Z;
			new_line = `v ${x} ${y} ${z}`;
		}
		io.output.write(new_line + '\n');
	}).on('close', () => {
		console.error(`done. saved as ${file_out}`);
	});
}