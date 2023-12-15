import {spring} from 'remotion';
import {
	AbsoluteFill,
	interpolate,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
  Img,
  staticFile,
  Video,
} from 'remotion';
import {Logo} from './Logo';
import {Subtitle} from './Subtitle';
import {Title} from './Title';
import {getCacheKeyForUrl} from '../cache'

const primaryColor = "rgba(254, 44, 85, 1)"
const dimColor = "rgba(254,44,85,.34)"
const fontFamily ="system-ui"
const ProductImage =  ({url}) => {
  return <Img src={staticFile(url)} style={{width:"100%", height:"100%", objectFit:"contain"}}/>
}

export const HelloWorld = ({product, imgDuration, titleText, titleColor}) => {
	const frame = useCurrentFrame();
	const {width, height, durationInFrames, fps} = useVideoConfig();

	// Animate from 0 to 1 after 25 frames
	const logoTranslationProgress = spring({
		frame: frame - 25,
		fps,
		config: {
			damping: 100,
		},
	});

	// Move the logo up by 150 pixels once the transition starts
	const logoTranslation = interpolate(
		logoTranslationProgress,
		[0, 1],
		[0, -150]
	);

	// Fade out the animation at the end
	const opacity = interpolate(
		frame,
		[durationInFrames - 25, durationInFrames - 15],
		[1, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);
  console.log(frame, product, product.price.discount)

  const m1 = 0.1 * width
  const m2 = 0.618 * m1
  const m3 = 0.618 * m2
  const m4 = 0.618 * m3
  let sellerName = product.seller.name[0].toUpperCase() + product.seller.name.substr(1)
	// A <AbsoluteFill> is just a absolutely positioned <div>!
  const subtotal = parseFloat(product.price.real_price.replace('$', ''))
  const discount = Math.min(20,  subtotal*0.3)
  const total =  subtotal - discount
  const totalDiscount = discount
  let allImages = []
  if(product.review.review_items?.length){
    product.review.review_items.forEach(r=>allImages = [...allImages, ...(r.review?.images||[])])
  }
  allImages = [...allImages, ...product.images].filter(img=>img.uri)
	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<AbsoluteFill style={{opacity}}>
				<AbsoluteFill style={{transform:"rotateZ(5deg) scale(1.3)"}}>
            <Video loop muted src={staticFile("bg1.mp4")} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
				</AbsoluteFill>
        <AbsoluteFill style={{
          left:m1 ,top:0,
          width:0.8*width, height:0.8*width+m3, backgroundColor:"white", display:'flex', 
          flexDirection:"column", 
        }}>
          <div style={{
            display:"flex", flexDirection:"row", paddingTop: m3, paddingLeft:m3, paddingRight:m3, 
            justifyContent:"flex-start",
            alignItems:'flex-start', fontFamily:"system-ui"
          }}>
            <Img src={product.seller.avatar.url_list[0]} style={{
              width:m2, height:m2, borderRadius:m2, marginRight:m4
            }}/>
            <div style={{fontSize: m3, letterSpacing:-0.1, fontWeight: 700, color:"#333"}}>
              {sellerName}
            </div>
          </div>
          <div style={{margin:m3, display:"flex"}}>
            <Img src={product.images[0].url_list[0]} style={{
              width:3*m1, height:3*m1, borderRadius:m2, marginRight:m4
            }}/>
            <div style={{
              lineHeight:1.25,
                fontSize:m3, fontFamily, textOverflow:"ellipsis",whiteSpace:"nowrap", overflow:"hidden",
                width:"100%",
            }}>
              {product.title}
              <div style={{fontSize: m3, fontFamily, color:"#999", display:"flex", marginTop:m4*0.4}}>
                <div style={{}}>
                  <span style={{color:"#333", fontWeight:700}}>
                    {product.review.product_rating}
                  </span> 
                  <span style={{color:"#face15"}}> ★</span> 
                   • {product.review.review_count}
                  <span style={{fontSize:m3}}> | <span style={{color:"#333", fontWeight:700}}>{product.sold_count}</span> sold</span>
                </div>
              </div>
              <div style={{marginTop:m4}}>
                <span style={{fontSize:m2}}>{product.price.real_price}</span>
                <div>
                  <span style={{textDecoration:"line-through", color:"#777", marginRight:m4*0.618}}>{product.price.original_price}</span>
                  {product.price.discount&& <span 
                    style={{backgroundColor:dimColor, color:primaryColor, paddingLeft:m4, paddingRight:m4, borderRadius:m4*0.3}}>
                    {product.price.discount}
                  </span> }
                </div>
              </div>
            </div>
          </div>
          <div style={{
            paddingLeft:m3, 
            paddingRight:m3, 
            fontSize:m3, fontFamily, letterSpacing:1, 
            lineHeight:1.4,
            display:"flex", justifyContent:"space-between"}}>
            <div>
              Subtotal
            </div>
            <div>
              ${subtotal.toFixed(2)}
            </div>
          </div>
          <div style={{
            paddingLeft:m3, 
            paddingRight:m3, 
            fontSize:m3, fontFamily, letterSpacing:1, 
            color:primaryColor, 
            lineHeight:1.4,
            marginBottom:m4*0.5, display:"flex", justifyContent:"space-between"}}>
            <div>
              Total discount 
            </div>
            <div>
              -${totalDiscount.toFixed(2)}
            </div>
          </div>
          <div style={{paddingLeft:m3, 
            paddingRight:m3, fontWeight:700,
            fontSize:m2*0.8, fontFamily, letterSpacing:1, marginBottom:m4, display:"flex", justifyContent:"space-between"}}>
            <div>
              Total <span style={{fontWeight:400}}>(1 item)</span>
            </div>
            <div>
              ${total.toFixed(2)}
            </div>
          </div>
          <div style={{backgroundColor:primaryColor, padding: m3, borderRadius:m4, textAlign:"center", 
            color:"white", fontSize: m3, marginLeft:m3,marginRight:m3, flex:0, fontFamily, letterSpacing:2
          }}>
            Buy Now 
          </div>
        </AbsoluteFill>
				{/* Sequences can shift the time for its children! */}
        {allImages.map((img, idx)=>
        <Sequence key={img.uri} from={idx*imgDuration} durationInFrames={imgDuration+2}>
          <AbsoluteFill style={{
            left:0.1*width,top:0.8*width+m3-1, height:height-0.8*width-m3+1,
            width:0.8*width, backgroundColor:"white"
          }}>
            <ProductImage url={getCacheKeyForUrl(img.uri)}/>
          </AbsoluteFill>
        </Sequence>
        )}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
