#!/bin/bash
set -ex
rm -f product.html
rm -f product.json
curl -L $1 -o product.html
node parseProduct.js 
node downloadImages.js
