#!/bin/bash

INKSCAPE=~/../../Applications/Inkscape.app/Contents/MacOS/inkscape


$INKSCAPE --shell < ./scripts/inkscapeScript.txt

echo -e "\n\033[1;32mAll exports done!"