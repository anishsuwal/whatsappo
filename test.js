const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload());

// Upload Endpoint
/*app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  console.log("xxxxxxxxxx",req.files)

  file.mv(`${__dirname}/uploads/${file.name}`, err => {
    if (err) {
      return res.status(500).send(err);
    }
//    console.log(    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` }))
    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});*/

//app.listen(5000, () => console.log('Server Started...'));