import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';
import {Cover} from './Maia/Cover';
import {Content as MaiaContent} from './Maia/Content';
import MaiaCta from './Maia/Cta';
import product from './product.json'
import { continueRender, delayRender, staticFile } from "remotion";

const waitForFont = delayRender();
const font = new FontFace(
  `Vogue`,
  `url('${staticFile("fonts/Vogue.ttf")}') format('truetype')`
);

font
  .load()
  .then(() => {
    document.fonts.add(font);
    continueRender(waitForFont);
  })
  .catch((err) => console.log("Error loading font", err));

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

const imgCount = allImages.length
const imgDuration = Math.max(Math.ceil(9*30/imgCount), 15)

/*
Generate product.json from 
p = product
pb = product.product_base
{ 
    id: p.product_id, 
    title: pb.title, 
    images: pb.images, 
    sold_count: pb.sold_count, 
    seller:p.seller, 
    review:p.product_detail_review,
    price: pb.price
}
*/
// Each <Composition> is an entry in the sidebar!

export const RemotionRoot = () => {
	return (
		<>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.jsx <id> out/video.mp4
				id="HelloWorld"
				component={HelloWorld}
				durationInFrames={imgCount*imgDuration}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					titleText: 'Welcome to Remotion',
					titleColor: 'black',
          product: product,
          imgDuration
				}}
			/>
			{/* Mount any React component to make it show up in the sidebar and work on it individually! */}
			<Composition
				id="MaiaCover"
				component={Cover}
				durationInFrames={1}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="MaiaContent"
				component={MaiaContent}
				durationInFrames={1}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="MaiaCta"
				component={MaiaCta}
				durationInFrames={1}
				fps={30}
				width={1080}
				height={1920}
			/>
		</>
	);
};
