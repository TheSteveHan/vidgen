const product  = require('./product.json')
const download = require('image-downloader')
const {getCacheKeyForUrl} = require('./cache')
const fs = require("fs")

let allImages = []
if(product.review.review_items?.length){
  product.review.review_items.forEach(r=>allImages = [...allImages, ...(r.review?.images||[])])
}

allImages = [...allImages, ...product.images].filter(img=>{
  if (!img.uri){
    return false
  }
  return true
})


function downloadImage(url, filepath) {
  if (fs.existsSync(filepath)) {
    console.log(`${filepath} already exists`)
    return Promise.resolve()
  }
  return download.image({
    url,
    dest: filepath,
    extractFilename: false
  }).catch(e=>console.log("failed for ", filepath, e))
}
Promise.all(allImages.map(img=> downloadImage(img.url_list[0], `${__dirname}/../public/`+getCacheKeyForUrl(img.uri))))
