import express from 'express';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import bodyParser from 'body-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('pages/index');
  console.log('Home page requested');
});

// 👇 START THE SERVER
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});