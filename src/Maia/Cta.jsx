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

export default ({title=defaultTitle})=> {
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
  
  const glowColor = '#f86a46'
  const blue1 = "#defdf8"
  const glowColor2 = '#1bd3ef'

	return (
		<AbsoluteFill>
      <CoverImg url={'/maia/frame3-v5.png'}/>
      <CenteredAt x={32} y={75.1} width={1000} height={500} style={{ 
        display:"flex", alignItems:"center",
        justifyContent:"center",
        flexDirection:"column",
        textAlign:"center", 
        letterSpacing:12,
        wordSpacing: 8,
        color:"white", 
        fontWeight:400, 
        fontSize:52,
      }}>
        <div style={{
          textShadow:`4px 4px 8px black, -1px -1px 32px ${glowColor}, -0px -0px 8px white, -0px -0px 4px white`, 
          filter:`drop-shadow(0px 0px 32px ${glowColor})`,
          fontFamily:"Vogue",
        }}>
          WAKE UP
        </div>
      </CenteredAt>
      <CenteredAt x={71.2} y={75.1} width={1000} height={500} style={{ 
        display:"flex", alignItems:"center",
        justifyContent:"center",
        flexDirection:"column",
        textAlign:"center", 
        letterSpacing: 8,
        wordSpacing: 16,
        color:"white", 
        fontWeight:400, 
        fontSize:52,
      }}>
        <div style={{
          textShadow:`4px 4px 8px black, -1px -1px 32px ${glowColor}, -0px -0px 8px white, -0px -0px 4px white`, 
          filter:`drop-shadow(0px 0px 32px ${glowColor})`,
          fontFamily:"Vogue",
        }}>
          <span style={{letterSpacing:5}}>EARTHLINGS</span>
        </div>
      </CenteredAt>
      <CenteredAt x={70.8} y={78.6} width={1000} height={500} style={{ 
        display:"flex", alignItems:"center",
        justifyContent:"center",
        flexDirection:"column",
        textAlign:"center", 
        letterSpacing: 3,
        wordSpacing: 9,
        color:glowColor2, 
        fontWeight:100, 
        fontSize:64*0.618,
        filter:`drop-shadow(0px 0px 32px ${glowColor2})`,
      }}>
        <div style={{
          textShadow:`4px 4px 8px black, -1px -1px 32px ${glowColor2}, -0px -0px 8px white, -0px -0px 4px white`, 
          fontFamily:"system-ui",
        }}>
          <span
            style={{
              letterSpacing:2,
            }}
          > COMMENT • TAG</span>
        </div>
      </CenteredAt>
      <CenteredAt x={31.3} y={78.6} width={1000} height={500} style={{ 
        display:"flex", alignItems:"center",
        justifyContent:"center",
        flexDirection:"column",
        textAlign:"center", 
        letterSpacing: 3,
        wordSpacing: 9,
        color:glowColor2, 
        fontWeight:100, 
        fontSize:64*0.618,
        filter:`drop-shadow(0px 0px 32px ${glowColor2})`,
      }}>
        <div style={{
          textShadow:`4px 4px 8px black, -1px -1px 32px ${glowColor2}, -0px -0px 8px white, -0px -0px 4px white`, 
          fontFamily:"system-ui",
        }}>
          <span style={{letterSpacing:5}}>SHARE • LIKE</span> 
        </div>
      </CenteredAt>
      <CenteredAt x={32.4} y={54.9} width={1000} height={500} style={{ 
        display:"flex", alignItems:"center",
        justifyContent:"center",
        flexDirection:"column",
        textAlign:"center", 
        color:blue1, 
      }}>
        <div style={{
          fontSize: 64*0.618*0.618, fontFamily:"system-ui", 
          fontWeight:100, letterSpacing:38, textTransform:"uppercase",
          textShadow:`3px 3px 6px black, -1px -1px 32px ${glowColor2}, -0px -0px 8px white, -0px -0px 4px white`,
          filter:`drop-shadow(0px 0px 128px ${glowColor2}) drop-shadow(0px 0px 128px ${glowColor2}) `
        }}>
          <span style={{letterSpacing:48}}>@maia</span>
        </div>
      </CenteredAt>
      <CenteredAt x={74} y={54.9} width={1000} height={500} style={{ 
        display:"flex", alignItems:"center",
        justifyContent:"center",
        flexDirection:"column",
        textAlign:"center", 
        color:blue1, 
      }}>
        <div style={{
          fontSize: 64*0.618*0.618, fontFamily:"system-ui", 
          fontWeight:100, letterSpacing:38, textTransform:"uppercase",
          textShadow:`3px 3px 6px black, -1px -1px 32px ${glowColor2}, -0px -0px 8px white, -0px -0px 4px white`,
          filter:`drop-shadow(0px 0px 128px ${glowColor2}) drop-shadow(0px 0px 128px ${glowColor2}) `
        }}>
          <span style={{letterSpacing:37}}>wisdom</span>
        </div>
      </CenteredAt>
		</AbsoluteFill>
	);
};

