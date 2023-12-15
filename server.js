const QRCode = require('qrcode')
const express = require('express')
const app = express()
const port = 5051
var ip = require('ip');

const ipAddr = ip.address()

QRCode.toString(`http://${ipAddr}:${port}/`, {type:'terminal'},
  (err, QRcode) => {

    if(err) return console.log("error occurred")

    // Printing the generated code
    console.log(QRcode)
  }
)


app.get('/', (req, res) => {
  res.send('<a href="/out/HelloWorld.mp4" download ><div style="text-align:center;width:90vw;height:90vh;font-size: 5vw;background-color:red">Download Latest</div></a>')
})
app.use('/public', express.static('public'))
app.use('/out', express.static('out'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
