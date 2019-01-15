#!/bin/bash

# converts all *.jpg and *.bmp files to *.png and patches model.mtl

dir="./downloaded_files"

function conv {
  mogrify -format png "$1" &&
  rm "$1"
}

if [[ -z $(find "$dir" -name '*.jpg' -o -name '*.bmp' | head -n 1) ]]
then
  >&2 echo no \*.jpg or \*.bmp in directory
fi

while read x
do
  >&2 echo "converting $(basename "$x")"
  conv "$x" || exit 1
done < <(find "$dir" -name '*.jpg' -o -name '*.bmp') &&
>&2 echo "patching model.mtl" &&
sed -i.bak 's/.jpg/.png/' "$dir/model.mtl" &&
rm -f "$dir/model.mtl.bak" &&
sed -i.bak 's/.bmp/.png/' "$dir/model.mtl" &&
rm -f "$dir/model.mtl.bak" &&
>&2 echo "done"
