#!/bin/bash
for file in *.htm; do handlebars $file.htm -f precompiled/${file%htm}js
