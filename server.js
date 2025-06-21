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

app.get('/sign-in', (req, res) => {
  res.render('pages/login');
  console.log('login page requested');
});

app.get('/sign-up', (req, res) => {
  res.render('pages/signup');
  console.log('signup page requested');
});

app.get('/book', (req, res) => {
  res.render('pages/book');
  console.log('book page requested');
});

app.get('/movies', (req, res) => {
  res.render('pages/movies');
  console.log('movies page requested');
});

app.get('/offers', (req, res) => {
  res.render('pages/offers');
  console.log('offers page requested');
});

app.get('/theaters', (req, res) => {
  res.render('pages/theaters');
  console.log('theaters page requested');
});

app.get('/contact-us', (req, res) => {
  res.render('pages/contact-us');
  console.log('contact page requested');
});

app.get('/faqs', (req, res) => {
  res.render('pages/faqs');
  console.log('FAQs page requested');
});

app.get('/help', (req, res) => {
  res.render('pages/help');
  console.log('help page requested');
});

app.get('/privacy-policy', (req, res) => {
  res.render('pages/privacy');
  console.log('privacy policy page requested');
});

app.get('/profile', (req, res) => {
  res.render('pages/profile');
  console.log('profile page requested');
});

// 👇 START THE SERVER
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});