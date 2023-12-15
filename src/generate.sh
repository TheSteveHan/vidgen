#!/bin/bash
set -ex
rm product.html
rm product.json
curl $1 -o product.html
node parseProduct.js 
node downloadImages.js
