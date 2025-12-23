const fs = require('fs')
const { spawnSync } = require( 'child_process' );


let content = fs.readFileSync("./maia.txt").toString()
let lines = content.split("\n").filter(x=>x)
const parseChapter = (lines) => {
  let [cpt, title] = lines[0].split(":")
  title = title.trim()
  cpt = cpt.split(" ")[1]
  let [p1, p2] = lines[1].split("?").map(x=>x.trim())
  let subtitle = ''
  let body = ''
  if(p2){
    subtitle = p1.trim().replace(", Karen", "") + "?"
    body = p2.trim()
  } else {
    body = p1.trim()
  }
  return {title, subtitle, body, vid:cpt.padStart(4, '0')}
}

const generateVideo = (params) => {
  const {vid} = params
  console.log(params)
  let cmd = [ 'remotion', 'still', 'MaiaCover', `out/maia/${vid}_01.png`, `--props=${JSON.stringify(params)}`] 
  console.log({cmd})
  let res1 = spawnSync( 'npx', cmd)
  console.log(`Gen Cover for ${vid} ended with code ${res1.status}`)
  if(res1.status!=0){
    console.log(res1.stdout)
    console.log(res1.stderr)
  }
  cmd = [ 'remotion', 'still', 'MaiaContent', `out/maia/${vid}_02.png`, `--props=${JSON.stringify(params)}`] 
  let res2 = spawnSync( 'npx', cmd)
  console.log(`Gen Cover for ${vid} ended with code ${res2.status}`)
  if(res2.status!=0){
    console.log(res2.stdout)
    console.log(res2.stderr)
  }
  //res1.stdout.on( 'data', ( data ) => console.log( `stdout: ${ data }` ) );
  //res1.stderr.on( 'data', ( data ) => console.log( `stderr: ${ data }` ) );
  //res2.stdout.on( 'data', ( data ) => console.log( `stdout: ${ data }` ) );
  //res2.stderr.on( 'data', ( data ) => console.log( `stderr: ${ data }` ) );
  //res1.on( 'close', ( code ) => console.log( `Gen Cover exited with code ${code}` ) );
  //res2.on( 'close', ( code ) => console.log( `Gen Content exited with code ${code}` ) );
}

//generateVideo(params, 1)
let chapterLines = []
for (line of lines){
  if(line.indexOf("Chapter")==-1){
    chapterLines.push(line)
    continue
  }
  if(chapterLines.length==0){
    chapterLines.push(line)
    // first run
    continue
  }
  let params = parseChapter(chapterLines);
  console.log(params)
  generateVideo(params)
  chapterLines = [line]
}
if(chapterLines.length){
  let params = parseChapter(chapterLines);
  generateVideo(params)
}
