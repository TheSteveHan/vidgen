function getCacheKeyForUrl(url){
  return  url.replace('/', '-')
}

module.exports={
  getCacheKeyForUrl
}
