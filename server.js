
const { Client, MessageMedia } = require('whatsapp-web.js');
const express = require('express')
const cors = require("cors");
const fileUpload = require('express-fileupload');
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(fileUpload());
const path = require('path')

let chrome = {};
let puppeteer;
if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    // running on the Vercel platform.
    chrome = require('chrome-aws-lambda');
    puppeteer = require('puppeteer-core');
  } else {
    // running locally.
    puppeteer = require('puppeteer');
  }


const client = new Client({
	puppeteer: {
		args: ['--no-sandbox','--hide-scrollbars', '--disable-web-security'],
        defaultViewport: chrome.defaultViewport,
        executablePath:  chrome.executablePath,
        headless: true,
        ignoreHTTPSErrors: true
	}
})
console.log(puppeteer)
console.log(chrome.executablePath)
console.log(chrome.defaultViewport)
console.log(chrome)


app.get('/api', async (req, res) => {
    console.log("starting",req.body)
    try {
        await client.on('qr', (qr) => {
            res.send({
                qr,
            })
            console.log('QR RECEIVED', qr);
        })

    } catch (err) {
        res.send( err)
    }
})
app.get("/getStatus", (req, res) => {
    try{
        client.on('ready', () => {
            console.log('Client is ready!');
            res.send("true")
        })
    }
    catch (err) {
        res.send( err)
    }
});
// Upload Endpoint
app.post('/upload', (req, res) => {
    if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    const file = req.files.file;  
    file.mv(`${__dirname}/uploads/${file.name}`, err => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }  
      res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    });
  });

app.post("/apiSendMessage", (req, res) => {
    const number = req.body['phone'];
    console.log(req.body)
    // Your message.
    const text = req.body['message'];
    const chatId = number.substring(1) + "@c.us";
    console.log("anish",number, text,  chatId)
    try{
        client.isRegisteredUser(chatId).then(async function (isRegistered) {
            if (isRegistered) {
                await client.sendMessage(chatId, text);
                res.send("0")
            }
            else {
                res.send("1")
            }
        })
    }
  
    catch(e)
    {
        console.log(e);
    }
    finally {
        console.log("entering and leaving the finally block");
      }
})

app.post("/apiSendMessageWithAttachment", (req, res) => {
    const number = req.body['phone'];
    console.log(req.body,number)
    // Your message.
    const text = req.body['message'];
    const file = req.body['fileName']
    const chatId = number.substring(1) + "@c.us";
    console.log(number, text,  chatId,file)
    client.isRegisteredUser(chatId).then(async function (isRegistered) {
        if (isRegistered) {         
                console.log(__dirname);
                const media =MessageMedia.fromFilePath(__dirname+"/uploads/"+file);
                await client.sendMessage(chatId, media,{caption: text})
                res.send("0")
            }             
            
        else {
            res.send("1")
        }      
    })
})
client.initialize();


app.get('/',(req,res)=>{
    app.use(express.static(path.resolve(__dirname,'client','build')))
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
})



app.listen(5000, () => { console.log("Server Running on port 5000") })
