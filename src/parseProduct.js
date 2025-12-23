const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const path = require("path");

// Read @src/product.html (relative to project root)
const productHtmlPath = path.join(__dirname, "..", "src", "product.html");
const content = fs.readFileSync(productHtmlPath, { encoding: 'utf8', flag: 'r' });

const scriptMatch = content.match(/<script[^>]+id="__MODERN_ROUTER_DATA__"[^>]*>([\s\S]+?)<\/script>/i);
if (!scriptMatch) {
  throw new Error("Could not find embedded __MODERN_ROUTER_DATA__ script tag in product.html");
}

// Extract and parse JSON
let jsonStr = scriptMatch[1];
// In case there is dangerous leading/trailing whitespace or comment, try to safely parse
let routerData;
try {
  routerData = JSON.parse(jsonStr);
} catch (e) {
  // Try fallback: some messy HTML cases
  jsonStr = jsonStr.trim();
  routerData = JSON.parse(jsonStr);
}
routerData = routerData?.loaderData['view/product/(product_id)/page'].page_config.components_map;

console.log("found router data", JSON.stringify(routerData, null, 2));
fs.writeFileSync('./product_raw.json', JSON.stringify(routerData, null, 2));

// Find the object with type 'product_info' in routerData and save as product_info.json

let productInfoObj = null;
if (Array.isArray(routerData)) {
  // if for some reason routerData is an array
  productInfoObj = routerData.find(
    o => o && o.component_type === "product_info"
  );
} else if (typeof routerData === "object") {
  // likely the primary case: routerData is an object mapping keys to objects
  for (const k of Object.keys(routerData)) {
    const v = routerData[k];
    if (v && v.component_type === "product_info") {
      productInfoObj = v;
      break;
    }
  }
}

if (!productInfoObj) {
  // Try secondary heuristic, sometimes it's nested
  if (typeof routerData === "object") {
    for (const k of Object.keys(routerData)) {
      const v = routerData[k];
      if (v && typeof v === "object" && v.component_data && v.component_type === "product_info") {
        productInfoObj = v;
        break;
      }
    }
  }
}

if (!productInfoObj) {
  throw new Error("Could not find an object with component_type 'product_info' in routerData");
}

fs.writeFileSync('./product_info.json', JSON.stringify(productInfoObj, null, 2));

const productBase = productInfoObj.component_data.product_info.product_base
const seller = productInfoObj.component_data.product_info.seller
const review = productInfoObj.component_data.product_info.product_detail_review
// Extract required fields from productInfoObj written as product_info.json
const prod = {
  id: productInfoObj?.component_data?.product_id,
  title: productBase.title,
  images: productBase.images, 
  sold_count: productBase.sold_count,
  seller,
  review: productBase.product_detail_review,
  price: productBase.price,
  review,
  categories: productBase.product_category_list,
  variations: productBase.sku_info,
};

fs.writeFileSync('./product.json', JSON.stringify(prod, null, 2));
