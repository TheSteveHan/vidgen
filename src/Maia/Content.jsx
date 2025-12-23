import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
  Img,
  staticFile
} from 'remotion';
import CenteredAt from '../utils/CenteredAt'

const CoverImg =  ({url}) => {
  return <Img src={staticFile(url)} style={{width:"calc(100% + 2px)", height:"calc(100% + 2px)", objectFit:"cover"}}/>
}

const defaultTitle = "Crystal Clear Bullsh*t"
const defaultSubtitle = "Believing that a piece of quartz can heal your chakras and align your energies?"
const defaultBody = `Well, guess what, Karen – those crystals are nothing but glorified 
paperweights. There's no scientific evidence backing your cosmic crystal therapy, just 
wishful thinking and a growing hole in your wallet.`

export const Content = ( {subtitle=defaultSubtitle, body = defaultBody}) => {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();

	const development = spring({
		config: {
			damping: 100,
			mass: 0.5,
		},
		fps: videoConfig.fps,
		frame,
	});

	const rotationDevelopment = spring({
		config: {
			damping: 100,
			mass: 0.5,
		},
		fps: videoConfig.fps,
		frame,
	});

	const scale = spring({
		frame,
		config: {
			mass: 0.5,
		},
		fps: videoConfig.fps,
	});

	const logoRotation = interpolate(
		frame,
		[0, videoConfig.durationInFrames],
		[0, 360]
	);
  const glowColor = "#d5f5fc"
  const glowColor2 = "#fff"
  const glowColor3 = "#f87f41"

	return (
		<AbsoluteFill>
      <CoverImg url={'/maia/maia_scene_2.jpeg'}/>
      <CenteredAt y={57} width={1000} height={1000} style={{ 
        display:"flex",
        color:"#122", 
        paddingLeft:32, 
        paddingRight:32, 
        display:"flex", 
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"column",
        letterSpacing: -1.5,
        linearHeight:1.5,
        fontWeight:600, 
        fontSize:72,
        textAlign:"center",
      }}>
        <div style={ {
          textShadow:`1px 1px 4px rgba(30,30,30,0.3), -1px -1px 32px ${glowColor}, -0px -0px 8px ${glowColor}, -0px -0px 4px ${glowColor2}`, 
          filter:`drop-shadow(0px 0px 32px ${glowColor}) drop-shadow(0px 0px 32px ${glowColor})`,
        } }>
        {subtitle}
        </div>
        <br/>
      <div width={1000} style={{ 
          paddingLeft:48, 
          paddingRight:48, 
        display:"flex", 
        flexDirection:"column",
        alignItems:"center",
        textAlign:"center",
        color:"#122", 
        lineHeight:1.25,
        fontWeight:600, 
        fontSize:72/1.618,
        whiteSpace:"wrap",
        textShadow:`1px 1px 4px rgba(30,30,30,0.3), -1px -1px 32px ${glowColor}, -0px -0px 8px ${glowColor}, -0px -0px 4px ${glowColor}`, 
        filter:`drop-shadow(0px 0px 32px ${glowColor}) drop-shadow(0px 0px 32px ${glowColor})`,
      }}>
        {body}
        <br/>
        <br/>
      </div>
        <div style={{
          textShadow:`1px 1px 4px rgba(30,30,30,0.3), -1px -1px 32px ${glowColor3}, -0px -0px 8px ${glowColor3}, -0px -0px 4px ${glowColor3}`, 
          fontSize:72/1.618,
          textTransform:"uppercase", fontFamily:"system-ui", fontWeight:100, letterSpacing:22,
          filter:`drop-shadow(0px 0px 32px ${glowColor3}) drop-shadow(0px 0px 32px ${glowColor3})`,
        }}>
        @maia.wisdom
        </div>
      </CenteredAt>
		</AbsoluteFill>
	);
};
