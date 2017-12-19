#!/bin/bash

for f in /path/to/your/public/xsecdb/json/*width*.json; do
    echo "Processing $f"
    # do something on $f
    # sed -i '19,$ d' $f
    # sed -i "s/}{/}/g" $f
    # sed -i "s/\"accuracy\": \"none\"/\"accuracy\": \"unknown\"/g" $f
    # sed -i "s/\"energy\"\:\ \"Lam10/\"energy\"\:\ \"13/g" $f
    # sed -i "s/\"energy\"\:\ \"displaced/\"energy\"\:\ \"13/g" $f
    sed -i "s/.*\"energy\"\:\ \"width.*/            \"energy\"\:\ \"13\",/g" $f
    # exit 1
done
