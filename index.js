import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import qr from 'qr-image';
import fs from 'fs';
const dir_name = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.static(dir_name + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',(req, res) => {
    fs.unlink(dir_name + '/public/images/qr-code.png', (err) => {
        if (err) {
          console.error('Error deleting the file:', err);
          return;
        }
        console.log('File deleted successfully!');
      });
    res.render('index.ejs');
})

app.post('/generate', (req, res) => {
    const data = req.body['url'];
    const qrCode = qr.image(data, { type: 'png' });
    const qrCodePath = dir_name + '/public/images/qr-code.png';
    qrCode.pipe(fs.createWriteStream(qrCodePath));
    res.render('index.ejs', {htmlContent : `<img src="/images/qr-code.png" alt="qr code" />`});
});



app.listen(port, ( ) => {
    console.log(`Server is running on port ${port}`);
})