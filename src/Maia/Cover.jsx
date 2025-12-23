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

export const Cover = ({title=defaultTitle}) => {
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
  
  const glowColor = false? "#00f8f3": "#f2c46c"

	return (
		<AbsoluteFill>
      <CoverImg url={'/maia/maia_dark_blue_3.jpeg'}/>
      <CenteredAt y={63} width={1000} height={500} style={{ 
        display:"flex", alignItems:"center",
        justifyContent:"center",
        flexDirection:"column",
        textAlign:"center", color:"white", 
        letterSpacing: -1.5,
        fontWeight:600, 
        textShadow:`4px 4px 8px black, -1px -1px 32px ${glowColor}, -0px -0px 8px white, -0px -0px 4px white`, 
        fontSize:150,
        filter:`drop-shadow(0px 0px 32px ${glowColor})`
      }}>
        {title}
        <div style={{
          marginTop:30, 
          fontSize: 150*0.618*0.618, fontFamily:"system-ui", fontWeight:100, letterSpacing:11, textTransform:"uppercase",
        textShadow:`3px 3px 6px black, -1px -1px 32px ${glowColor}, -0px -0px 8px white, -0px -0px 4px white`,
        }}>
          @maia.wisdom
        </div>
      </CenteredAt>
		</AbsoluteFill>
	);
};
