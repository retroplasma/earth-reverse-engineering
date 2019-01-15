#/bin/bash

# to keep 3d viewer from jittering
# scales all *.obj and saves as *.2.obj
# you might want to change these constants
export OBJ_SCALE=0.333333
export OBJ_MOVE_X=89946
export OBJ_MOVE_Y=141738
export OBJ_MOVE_Z=-130075

function script {
	node -e "require('./lib/scale-move-obj')(process.argv.slice(1))" "$1" "$OBJ_SCALE" "$OBJ_MOVE_X" "$OBJ_MOVE_Y" "$OBJ_MOVE_Z"
}

while read x;
do
	script "$x";
done< <(find ./downloaded_files -name '*.obj' ! -name '*.2.obj');