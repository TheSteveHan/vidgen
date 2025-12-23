export default ({x=50, y=50, size, width, height, debug, children, style}) => {
  width = width || size
  height = height || size
  return <div style={{
    backgroundColor:debug?"red":"transparent",
    width: width,
    height: height,
    position:"absolute",
    top: `calc(${y}% - ${height/2}px)`,
    left: `calc(${x}% - ${width/2}px)`,
    ...style
  }}>
    {children}
  </div>
}
