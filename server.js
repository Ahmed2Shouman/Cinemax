import express from 'express';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data/movies.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const movies = JSON.parse(data);
    console.log('Home page requested.');
    res.render('pages/index', { movies });
  } catch (err) {
    console.error('Error loading movies:', err);
    res.status(500).send('Failed to load movies');
  }
});

app.get('/sign-in', (req, res) => {
  res.render('pages/login');
  console.log('login page requested');
});

app.get('/sign-up', (req, res) => {
  res.render('pages/signup');
  console.log('signup page requested');
});

app.get('/book', async (req, res) => {
  const movieName = req.query.name;
  try {
    const dataPath = path.join(__dirname, 'data/movies.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const movies = JSON.parse(data);
    const movie = movies.find(m => m.title.toLowerCase() === movieName?.toLowerCase());

    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    res.render('pages/book', { movie });
    console.log(`book page requested for: ${movie.title}`);
  } catch (err) {
    console.error('Error loading movie for booking:', err);
    res.status(500).send('Failed to load movie data');
  }
});

app.get('/movies', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data/movies.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const movies = JSON.parse(data);
    res.render('pages/movies', { movies });
  console.log('movies page requested');
  } catch (err) {
    console.error('Error loading movies:', err);
    res.status(500).send('Failed to load movies');
  }
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

app.get('/dashboard', (req, res) => {
  res.render('pages/dashboard');
  console.log('dashboard page requested');
});

// 👇 START THE SERVER
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
// API endpoint to serve movies JSON data directly
app.get('/api/movies', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data/movies.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const movies = JSON.parse(data);
    res.json(movies);
  } catch (err) {
    console.error('Error loading movies:', err);
    res.status(500).send('Failed to load movie data');
  }
});