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
  Audio,
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
	const txtProgress = spring({
		frame: frame,
		fps,
		config: {
			damping: 1,
      stiffness: 90
		},
	});

  console.log({txtProgress})
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
  const discount = Math.min(20,  subtotal*0.4)
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
            <Audio src={staticFile('sayit.mp3')}/>
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
                <span style={{fontSize:m2}}>{product.price.real_price.split(' ')[0]}</span>
                <div>
                  <span style={{textDecoration:"line-through", color:"#777", marginRight:m4*0.618}}>{
                    product.price.original_price.split(' ')[0]
                  }</span>
                  {product.price.discount&& <span 
                    style={{backgroundColor:dimColor, color:primaryColor,fontSize: m3*0.8, paddingTop:3, paddingBottom:3, paddingLeft:m4, paddingRight:m4, borderRadius:m4*0.3}}>
                    {product.price.discount.replace("up to ", "")}
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
            position:"relative",
            paddingRight:m3, fontWeight:700,
            fontSize:m2*0.8, fontFamily, letterSpacing:1, marginBottom:m4, display:"flex", justifyContent:"space-between"}}>
            <div>
              Total <span style={{fontWeight:400}}>(1 item)</span>
            </div>
            <div>
              ${total.toFixed(2)}
            </div>
            <div style={{
              backgroundColor:"transparent", 
              position:"absolute",
              right:-300,
              top:-240,
              width:800, height:500
            }}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                version="1.1" 
                viewBox="0 0 800 400"
                style={{width:"100%", height:"100%"}}
              >
                <path d="M432.2869873046875,94.17040252685547C408.2212168375651,101.34528986612956,332.1375045776367,112.7055269877116,287.8923645019531,137.2197265625C243.64722442626953,161.73392613728842,176.53214009602866,208.07174173990884,166.81614685058594,241.25559997558594C157.10015360514322,274.439458211263,178.47532908121744,323.0194371541341,229.59640502929688,336.3228759765625C280.7174809773763,349.6263147989909,421.9730987548828,332.28699747721356,473.5426025390625,321.07623291015625C525.1121063232422,309.86546834309894,550.5231424967448,299.8505147298177,539.013427734375,269.05828857421875C527.5037129720052,238.26606241861978,449.4768371582031,178.1763874689738,404.48431396484375,136.3228759765625C359.4917907714844,94.46936448415121,291.62929280598956,37.66816234588623,269.05828857421875,17.937219619750977" 
                  fill="none" 
                  strokeWidth="25" 
                  strokeDasharray="1500 3000"
                  strokeDashoffset={1500- frame * (1500/ (durationInFrames/fps*2.5))}
                  stroke={"url(#SvgjsLinearGradient1001)" }
                  strokeLinecap="round">
                </path>
                <defs>
                  <linearGradient id="SvgjsLinearGradient1001">
                    <stop stopColor="hsl(37, 99%, 67%)" offset="0"></stop>
                    <stop stopColor="hsl(316, 73%, 52%)" offset="1"></stop>
                  </linearGradient>
                </defs>
              </svg>
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
        <AbsoluteFill style={{
          left:0, top: height*0.618+ height*0.05 * txtProgress,
        }}>
          <span style={{
            width:450,
            padding: m4*0.5, borderRadius:m4*0.8, textAlign:"left", 
            fontWeight:700,
            color:'white', fontSize: m3, marginLeft:m3,
            lineHeight:1.3,
            marginRight:m3, fontFamily, letterSpacing:2,
            backgroundColor:'rgba(0,0,0,0.5)'
          }}>
            Get 40% off now<br/>
            Tap the orange icon<br/>
            <div style={{marginTop:12}}>
            👇
            </div>
          </span>
        </AbsoluteFill>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
