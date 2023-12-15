const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs")
const content = fs.readFileSync('./product.html', { encoding: 'utf8', flag: 'r' })
const data = content.match(/<script id="RENDER_DATA" type="application\/json">(?<content>[^<]+)<\/script/i)
let encoded = decodeURIComponent(data.groups.content)
let p = JSON.parse(encoded)['2']['initialData']['productInfo']
pb = p.product_base
prod = {
  id: p.product_id, title:pb.title, 
  images:pb.images, sold_count:pb.sold_count, seller:p.seller, 
  review:p.product_detail_review, 
  price:pb.price
}
const jsonFile = JSON.stringify(prod)
fs.writeFileSync('./product.json', jsonFile)

//

