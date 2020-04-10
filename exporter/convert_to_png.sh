#!/bin/bash

# converts all *.jpg and *.bmp files to *.png and patches model.mtl

dir="./downloaded_files/obj"
test $(find "$dir" -type d | head -n 1) || exit 1

# subdirectory (optional)
sub="$1"
if [ "$1" ]; then
  dir="$dir/$sub";
  test $(find "$dir" -type d | head -n 1) || exit 1
fi

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

while read x
do
  >&2 echo "patching $(basename "$x")" &&
  sed -i.bak 's/.jpg/.png/' "$x" &&
  rm -f "$x.bak" &&
  sed -i.bak 's/.bmp/.png/' "$x" &&
  rm -f "$x.bak"
  if [ $? -ne 0 ]; then exit 1; fi
done < <(find "$dir" -name '*.mtl') &&

>&2 echo "done"
