import { spring } from 'remotion';
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
import { Logo } from './Logo';
import { Subtitle } from './Subtitle';
import { Title } from './Title';
import { getCacheKeyForUrl } from '../cache'

const primaryColor = "rgba(254, 44, 85, 1)";
const accentColor = "#fc743b";
const dimColor = "rgba(254, 44, 85, 0.18)";
const goldColor = "#ffd36a";
const fontFamily = "system-ui, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
const shadow = "0 6px 40px 0 rgba(20, 0, 40, 0.12)";

// Animated shine overlay for product and avatar
const Shine = ({ borderRadius = 0 }) => (
	<div
		style={{
			pointerEvents: 'none',
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			borderRadius,
			background: 'linear-gradient(108deg, rgba(254,44,85,0.12) 0%, rgba(255,210,140,0.13) 40%, rgba(174,230,255,0.15) 100%)',
			mixBlendMode: 'soft-light',
			animation: 'shine-move 2.4s linear infinite',
			zIndex: 2
		}}
	/>
);

// Sparkle effect (used for discount)
const Sparkle = ({ style }) => (
	<span style={{ ...style, display: 'inline-block', position: 'relative', verticalAlign: 'middle' }}>
		<svg width={26} height={26} viewBox="0 0 36 36" style={{filter: "drop-shadow(0 0 8px #ffd36ab9)"}}>
			<g>
				<path
					d="M18 6l3 7h7l-5.5 4.5L25 25l-7-5.5L11 25l2.5-7.5L8 13h7z"
					fill={goldColor}
					opacity="0.7"
				/>
			</g>
		</svg>
	</span>
);

// Animated glowing/gradient border ProductImage
const ProductImage = ({ url, borderRadius = 14, showGlow }) => (
	<div
		style={{
			position: 'relative',
			borderRadius,
			overflow: 'hidden',
			background: 'linear-gradient(128deg, #fff8ee 65%, #ffe6f6 100%)',
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			animation: showGlow ? 'ping-glow 2s ease-in-out infinite' : undefined,
		}}
	>
		<Img
			src={staticFile(url)}
			style={{
				width: "100%",
				height: "100%",
				objectFit: "contain",
				borderRadius,
				zIndex: 2,
			}}
		/>
		{showGlow && <Shine borderRadius={borderRadius} />}
	</div>
);

// Add subtle entrance fade up to sections
const fadeUp = (frame, start, duration) => 
	interpolate(frame, [start, start + duration], [40, 0], {extrapolateLeft: 'clamp', extrapolateRight:'clamp'});
const fadeOpacity = (frame, start, duration) =>
	interpolate(frame, [start, start + duration], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight:'clamp'});

// Call-To-Action button with animated shine
const GradientButton = ({ children, style, pulse }) => (
	<button
		style={{
			border: "none",
			outline: "none",
			background: "linear-gradient(93deg, #fe2c55 25%, #ffc797 85%, #fff0c2 95%)",
			backgroundSize: "210% 210%",
			backgroundPosition: "73% 33%",
			color: "#fff",
			fontWeight: 800,
			letterSpacing: 2,
			fontSize: "inherit",
			fontFamily,
			borderRadius: 36,
			boxShadow: "0 6px 40px 0 rgba(254,44,85,0.14), 0 0 0px 4px #fc784316",
			padding: "12px 0",
			position: 'relative',
			overflow: 'hidden',
			cursor: 'pointer',
			transition: 'transform 0.22s cubic-bezier(.23,1.3,.45,1.02)',
			transform: `scale(${pulse ? 1.06 : 1})`,
			userSelect: 'none',
			...style,
		}}
	>
		<span>{children}</span>
		<span
			style={{
				position: "absolute",
				left: '10%',
				top: 0,
				width: "80%",
				height: "120%",
				background: "linear-gradient(113deg,rgba(255,255,255,0.11) 18%,rgba(255,255,255,0.42) 40%,rgba(250,220,220,0.22) 73%,rgba(255,255,255,0.0) 88%)",
				transform: 'translateX(-100%)',
				animation: 'shinebar 2.1s linear infinite',
				mixBlendMode: 'lighten',
				borderRadius: 36,
				pointerEvents: 'none'
			}}
		/>
	</button>
);

export const HelloWorld = ({ product, imgDuration, titleText, titleColor }) => {
	const frame = useCurrentFrame();
	const { width, height, durationInFrames, fps } = useVideoConfig();

	// Animate from 0 to 1 after 25 frames
	const txtProgress = spring({
		frame: frame,
		fps,
		config: {
			damping: 1,
			stiffness: 90,
		},
	});

	// Button pulse animation
	const btnPulse = Math.abs(Math.sin(frame / 24));

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

	const m1 = 0.1 * width;
	const m2 = 0.618 * m1;
	const m3 = 0.618 * m2;
	const m4 = 0.618 * m3;
	let sellerName = product.seller.name[0].toUpperCase() + product.seller.name.substr(1);
	const subtotal = parseFloat(product.price.real_price.replace('$', ''));
	const discount = Math.min(20, subtotal * 0.4);
	const total = subtotal - discount;
	const totalDiscount = discount;
	let allImages = []
	if (product.review.review_items?.length) {
		product.review.review_items.forEach(r => allImages = [...allImages, ...(r.review?.images || [])])
	}
	allImages = [...allImages, ...product.images].filter(img => img.uri);

	// Card shadow and background
	const cardShadow = "0 8px 34px #ffdefa54, 0 0px 8px #fda48622, 0 4px 24px #ffe2f244";
	const cardBg = "linear-gradient(119deg, #fff9f3 68%, #fff2eb 100%)";

	return (
		<AbsoluteFill style={{ backgroundColor: 'radial-gradient(ellipse at 80% 20%, #fce7f3aa 5%, #f5fdff 35%, #fff6 87%, #181E30 100%)', overflow: "hidden" }}>
			<AbsoluteFill style={{ opacity }}>
				<AbsoluteFill style={{
					transform: "rotateZ(5deg) scale(1.3)",
				}}>
					<Video
						loop muted
						src={staticFile("bg1.mp4")}
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
							filter: "blur(1.2px) brightness(0.99) saturate(1.13)",
						}} />
					<Audio src={staticFile('sayit.mp3')} />
				</AbsoluteFill>
				<AbsoluteFill style={{
					left: m1, top: 0,
					width: 0.8 * width,
					height: 0.8 * width + m3,
					display: 'flex',
					flexDirection: "column",
					background: cardBg,
					boxShadow: cardShadow,
					borderRadius: m4 * 2.2,
					backdropFilter: "blur(6.5px) contrast(1.04)",
					animation: "float-in 1.2s cubic-bezier(.25,1.05,.45,.98)",
					overflow: "visible",
					position: "relative",
				}}>
					{/* Seller row */}
					<div style={{
						display: "flex", flexDirection: "row", paddingTop: m3, paddingLeft: m3, paddingRight: m3,
						justifyContent: "flex-start",
						alignItems: 'flex-start', fontFamily,
						background: "linear-gradient(96deg,#fff9e2f7 62%,#fde1f3b2 100%)",
						borderTopLeftRadius: m4 * 2.2,
						borderTopRightRadius: m4 * 2.2,
						boxShadow: "0 2px 12px #fcddfc11"
					}}>
						<div style={{ position: "relative", width: m2, height: m2, marginRight: m4 }}>
							<Img src={product.seller.avatar.url_list[0]} style={{
								width: m2, height: m2, borderRadius: m2,
								boxShadow: "0 3px 10px #ffe4f772, 0 0px 1px #e8aab052"
							}} />
							<Shine borderRadius={m2} />
						</div>
						<div style={{
							fontSize: m3, letterSpacing: -0.1, fontWeight: 700, color: "#fe2c55",
							textShadow: "0 1px 9px #ffe7a811, 0 1px 0px #fff5",
							filter: "saturate(1.2)"
						}}>
							{sellerName}
						</div>
						{product.seller.verified &&
							<span style={{ marginLeft: 10, verticalAlign: "middle", fontSize: m3 * 0.9, color: goldColor }}>
								<Sparkle style={{ marginBottom: -3, marginRight: 2 }} />
							</span>
						}
					</div>

					{/* Main row */}
					<div style={{
						margin: m3, display: "flex",
						background: "linear-gradient(120deg,#fffbee 68%,#ffe7ff 100%)",
						borderRadius: m4 * 1.1,
						boxShadow: "0 5px 21px #ffe6fca1, 0 2px 11px #ffcbe334",
						position: 'relative'
					}}>
						<div style={{
							width: 3 * m1, height: 3 * m1, borderRadius: m2,
							marginRight: m4, background: "linear-gradient(109deg, #fffde6 64%, #ffdafa7c 94%)",
							boxShadow: "0 6px 13px #ffd3ea80, 0 2px 8px #ffc5fc18",
							position: "relative"
						}}>
							<ProductImage url={getCacheKeyForUrl(product.images[0].uri)} borderRadius={m2} showGlow />
							{product.price.discount &&
								<Sparkle style={{
									position: "absolute", right: 14, top: 14, zIndex: 4, animation: "sparkle-bounce 1.2s infinite"
								}} />}
						</div>
						<div style={{
							lineHeight: 1.25,
							fontSize: m3, fontFamily,
							textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden",
							width: "100%",
							filter: 'brightness(1.25)'
						}}>
							<span style={{
								fontWeight: 800, color: "#271337",
								letterSpacing: 0.12,
								textShadow: "0 2px 12px #ffdbee48,0 0.5px 0px #fff7",
							}}
							>{product.title}</span>
							<div style={{
								fontSize: m3, fontFamily, color: "#888",
								display: "flex", marginTop: m4 * 0.4,
							}}>
								<div>
									<span style={{
										color: "#fe2c55", fontWeight: 800,
										textShadow: "0 1px 5px #fff6",
										letterSpacing: 0.13
									}}>
										{product.review.product_rating}
									</span>
									<span style={{
										color: "#face15", textShadow: "0 1px 6px #fedf9177", marginLeft: 2,
										fontWeight: 700,  filter: "saturate(0) brightness(0.8)"
									}}> ★</span>
									<span style={{ color: "#ffa878", fontWeight: 800, marginLeft: 8 }}>
										• {product.review.review_count} 
									</span>
									<span style={{ fontSize: m3, color: "#c385f0" }}> | <span style={{ color: "#333", fontWeight: 700 }}>{product.sold_count}</span> sold</span>
								</div>
							</div>
							<div style={{ marginTop: m4, display: 'flex', alignItems: 'center' }}>
								<span style={{
									fontSize: m2*0.8,
									color: accentColor,
									fontWeight: 900,
									letterSpacing: 1.1,
									textShadow: "0 4px 18px #fffbd9ba",
									marginRight: 8,
									background: "unset",
									color: "#2b2241",
									textShadow: "0 1px 9px #ffe5ed70, 0 1px 0 #fff",
									WebkitBackgroundClip: "unset",
									WebkitTextFillColor: "unset"
								}}>
									{product.price.real_price.split(' ')[0]}
								</span>
								<div>
									<span style={{
										textDecoration: "line-through", color: "#b9a2ad", marginRight: m4 * 0.618,
										opacity: 1,
                    fontSize: m3 * 0.8,
									}}>
										{product.price.original_price.split(' ')[0]}
									</span>
									{product.price.discount &&
										<span
											style={{
                        position:"absolute",
                        zIndex: 10,
												background: "linear-gradient(92deg,#fe2c55bb,#ffd36a88 93%)",
												color: "#fe2c55",
												fontWeight: 700,
												fontSize: m3 * 0.8,
												padding: `3px ${m4 * 0.8}px`,
												borderRadius: m4 * 0.43,
												boxShadow: "0 2.5px 10px #fec5ff44",
												marginLeft: -8  ,
												display: "inline-flex",
												alignItems: "center",
												gap: 3,
												animation: "pop-bounce 1.4s infinite",
											}}
										>
											<Sparkle style={{ width: 16, height: 16, marginBottom: -3 }} />
											{product.price.discount.replace("up to ", "")}
										</span>
									}
								</div>
							</div>
						</div>
					</div>

					{/* Subtotal row */}
					<div style={{
						paddingLeft: m3,
						paddingRight: m3,
						fontSize: m3, fontFamily, letterSpacing: 1,
						lineHeight: 1.4,
						display: "flex", justifyContent: "space-between",
						background: "linear-gradient(98deg,#fff9f7 70%,#ffe6f8 97%)"
					}}>
						<div>
							Subtotal
						</div>
						<div>
							${subtotal.toFixed(2)}
						</div>
					</div>
					{/* Discount row */}
					<div style={{
						paddingLeft: m3,
						paddingRight: m3,
						fontSize: m3, fontFamily, letterSpacing: 1,
						color: primaryColor,
						lineHeight: 1.4,
						marginBottom: m4 * 0.5, display: "flex", justifyContent: "space-between",
						background: "linear-gradient(99deg, #fff8f4 55%, #feddea 91%)"
					}}>
						<div>
							Total discount
						</div>
						<div>
							-${totalDiscount.toFixed(2)}
						</div>
					</div>
					{/* Total row with svg accent */}
					<div style={{
						paddingLeft: m3,
						position: "relative",
						paddingRight: m3, fontWeight: 700,
						fontSize: m2 * 0.8, fontFamily, letterSpacing: 1, marginBottom: m4, display: "flex", justifyContent: "space-between",
						background: "linear-gradient(95deg,#fffdf6 62%,#fff6ff 98%)",
						borderBottomLeftRadius: m4 * 1.1,
						borderBottomRightRadius: m4 * 1.1,
						boxShadow: "0 2px 12px #ffebf633",
						zIndex: 1,
						overflow: "visible"
					}}>
						<div>
							Total <span style={{ fontWeight: 400 }}>(1 item)</span>
						</div>
						<div>
							${total.toFixed(2)}
						</div>
						<div style={{
							backgroundColor: "transparent",
							position: "absolute",
							right: -250,
							top: -210,
							width: 650, height: 410,
							opacity: 0.69,
							pointerEvents: "none"
						}}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								version="1.1"
								viewBox="0 0 800 400"
								style={{
									width: "100%", height: "100%",
									filter: "drop-shadow(0 0 20px #ffc97855)",
									opacity: 0.84
								}}
							>
								<path d="M432.2869873046875,94.17040252685547C408.2212168375651,101.34528986612956,332.1375045776367,112.7055269877116,287.8923645019531,137.2197265625C243.64722442626953,161.73392613728842,176.53214009602866,208.07174173990884,166.81614685058594,241.25559997558594C157.10015360514322,274.439458211263,178.47532908121744,323.0194371541341,229.59640502929688,336.3228759765625C280.7174809773763,349.6263147989909,421.9730987548828,332.28699747721356,473.5426025390625,321.07623291015625C525.1121063232422,309.86546834309894,550.5231424967448,299.8505147298177,539.013427734375,269.05828857421875C527.5037129720052,238.26606241861978,449.4768371582031,178.1763874689738,404.48431396484375,136.3228759765625C359.4917907714844,94.46936448415121,291.62929280598956,37.66816234588623,269.05828857421875,17.937219619750977"
									fill="none"
									strokeWidth="25"
									strokeDasharray="1500 3000"
									strokeDashoffset={1500 - frame * (1500 / (durationInFrames / fps * 2.5))}
									stroke={"url(#SvgjsLinearGradient1001)"}
									strokeLinecap="round">
								</path>
								<defs>
									<linearGradient id="SvgjsLinearGradient1001">
										<stop stopColor="#ffd36a" offset="0" />
										<stop stopColor="#fe2c55" offset="0.5" />
										<stop stopColor="#fd67d9" offset="1" />
									</linearGradient>
								</defs>
							</svg>
						</div>
					</div>
					{/* Buy Now CTA */}
					<div style={{
						marginTop: m4 * 0.5,
						background: 'none',
						padding: 0,
						marginLeft: m3, marginRight: m3, flex: 0,
						fontFamily, letterSpacing: 2
					}}>
						<GradientButton
							style={{
								width: "100%",
								fontSize: m3,
								boxShadow: "0 2.5px 13px #ffd1ec76,0 1.5px 10px #ffd8b388",
								margin: 0,
								borderRadius: m4, letterSpacing: 2,
								position: "relative"
							}}
							pulse={btnPulse > 0.45}
						>
							<span style={{
								position: "relative",
								zIndex: 9,
								textShadow: "0 1.5px 8px #0005, 0 1.5px 8px #fff3"
							}}>
								Buy Now
							</span>
							<span style={{
								fontSize: m3 * 1.12,
								display: "inline-block",
								marginLeft: 10,
								verticalAlign: 'middle',
								animation: "shake-arrow 1.2s cubic-bezier(.2,1.11,.36,1.20) infinite",
								zIndex: 9,
								filter: "drop-shadow(0 0 6px #ffd36a99)"
							}}>→</span>
						</GradientButton>
					</div>
				</AbsoluteFill>
				{/* Sequences can shift the time for its children! */}
				{allImages.map((img, idx) =>
					<Sequence key={img.uri} from={idx * imgDuration} durationInFrames={imgDuration + 2}>
						<AbsoluteFill style={{
							left: 0.1 * width,
							top: 0.8 * width + m3 - 1,
							height: height - 0.8 * width - m3 + 1,
							width: 0.8 * width,
							background: "linear-gradient(119deg, #fff8ee 62%, #fff4fc 88%)",
							borderRadius: m4 * 2,
							boxShadow: "0 14px 33px #fef6fd3c, 0 3px 11px #fccbe92a",
							overflow: "hidden",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							animation: "image-fadein 0.5s cubic-bezier(.39,1.32,.45,.98)"
						}}>
							<div style={{
								width: "74%",
								height: "89%",
								margin: "0 auto",
								borderRadius: m4 * 1.25,
								background: "#fff9",
								boxShadow: "0 3px 14px #ffe1e747",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								position: 'relative',
							}}>
								<ProductImage url={getCacheKeyForUrl(img.uri)} borderRadius={m4 * 1.25} showGlow />
							</div>
						</AbsoluteFill>
					</Sequence>
				)}
				{/* Animated Call-To-Action Heading */}
				<AbsoluteFill style={{
					left: 0, top: height * 0.618 + height * 0.05 * txtProgress,
					zIndex: 300,
					pointerEvents: 'none',
          display:"none", 
				}}>
					<span style={{
						width: 470,
						padding: m4 * 0.6,
						borderRadius: m4 * 0.85,
						textAlign: "left",
						fontWeight: 800,
						color: 'white',
						fontSize: m3 * 1.07,
						marginLeft: m3 * 1.19,
						lineHeight: 1.28,
						marginRight: m3,
						fontFamily,
						letterSpacing: 2,
						background: "linear-gradient(93deg, #fe2c55e0 16%, #ffd36aa6 85%)",
						boxShadow: "0 2px 24px #fef6b933, 0 0 0 5px #ffeaeca7",
						border: "2.5px solid #fff8",
						textShadow: "0 1px 12px #46280c95, 0 2px 1px #fffc",
						position: 'relative',
						display: 'block',
						backdropFilter: "blur(2.7px)",
						animation: 'cta-bounce 1.33s cubic-bezier(.43,2.11,.48,1.2) alternate infinite'
					}}>
						<span style={{
							display: "inline-block",
							fontWeight: 900,
							fontSize: m3 * 1.18,
							color: "#ffd36a",
							letterSpacing: 2.7,
							textShadow: "0 2px 9px #fae38c, 0 6px 20px #ffd36a96",
						}}>LIMITED TIME</span><br />
						<span style={{
							fontWeight: 800,
							fontSize: m3 * 0.97,
							color: "#fff",
							letterSpacing: 1.6
						}}>Get 40% off now</span><br />
						<span style={{fontWeight:600, fontSize: m3*0.9, color:'#fff', opacity:0.93}}>
							Tap the buy button
						</span>
						<div style={{ marginTop: 12 }}>
							<span style={{
								fontSize: m3 * 1.13,
								display: "inline-block",
								animation: "arrow-bounce 0.88s cubic-bezier(.24,1.18,.44,1.00) alternate infinite"
							}} role="img" aria-label="down">👇</span>
						</div>
					</span>
				</AbsoluteFill>
			</AbsoluteFill>
			{/* Keyframes for animations */}
			<style>{`
				@keyframes shinebar {
					0% { transform:translateX(-100%) }
					65% { transform:translateX(110%) }
					100% { transform:translateX(110%) }
				}
				@keyframes shine-move {
					0% { background-position: 0 0; }
					100% { background-position: 200% 0; }
				}
				@keyframes sparkle-bounce {
					0%,100%{transform:scale(1) translateY(0)}
					54%{transform:scale(1.26) translateY(-6px)}
				}
				@keyframes pop-bounce{
					0%,100%{transform:scale(1)}
					36%{transform:scale(1.10) rotate(-7deg)}
					46%{transform:scale(.98) rotate(3deg)}
				}
				@keyframes ping-glow{
					0%{ box-shadow:0 0 0 6px #fe2c5522, 0 10px 32px 12px #fe2c5512, 0 2px 4px 1px #ffecf8; }
					60%{ box-shadow:0 0 0 12px #ffd36a44, 0 13px 42px 24px #ffe9a761; }
					100%{ box-shadow:0 0 0 6px #fe2c5522, 0 10px 32px 12px #fe2c5512, 0 2px 4px 1px #ffecf8; }
				}
				@keyframes float-in {
					0% {opacity:0; transform:scale(1.09) translateY(40px);}
					42% {opacity:1;}
					100% {opacity:1; transform:scale(1.00) translateY(0);}
				}
				@keyframes cta-bounce{
					0%,100%{transform:translateY(0) scale(1);}
					20%{transform:translateY(-7px) scale(1.04);}
					70%{transform:translateY(2px) scale(.99);}
				}
				@keyframes shake-arrow{
					0%{transform:translateX(0) rotate(-7deg);}
					55%{transform:translateX(9px) rotate(10deg);}
					100%{transform:translateX(0) rotate(-7deg);}
				}
				@keyframes arrow-bounce{
					0%{transform:translateY(0);}
					100%{transform:translateY(13px);}
				}
				@keyframes image-fadein {
					0%{opacity:0; transform:scale(0.98);}
					85%{opacity:1;}
					100%{opacity:1; transform:scale(1);}
				}
			`}</style>
		</AbsoluteFill>
	);
};
