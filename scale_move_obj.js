"use strict";

// to keep 3d viewer from jittering
// scales all *.obj and saves as *.2.obj
// you might want to change these constants
const [OBJ_SCALE, OBJ_MOVE_X, OBJ_MOVE_Y, OBJ_MOVE_Z] = [0.0333333, 89946, 141738, -130075];

const fs = require('fs');
const path = require('path');
const scaleMoveObj = require('./lib/scale-move-obj.js');
const OBJ_DIR = './downloaded_files/obj';

for (let i of fs.readdirSync(OBJ_DIR)) {
	i = path.resolve(OBJ_DIR, i);
	if (!fs.statSync(i).isDirectory()) continue;

	for (let j of fs.readdirSync(i)) {
		j = path.resolve(i, j);
		if (!/\.obj$/.test(j) || /\.2\.obj$/.test(j)) continue;
		if (!fs.statSync(j).isFile()) continue;

		scaleMoveObj([j, OBJ_SCALE, OBJ_MOVE_X, OBJ_MOVE_Y, OBJ_MOVE_Z]);
	}
}
