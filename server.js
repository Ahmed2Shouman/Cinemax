import express from 'express';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

// Define storage logic
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'poster') {
      cb(null, path.join(__dirname, 'public/Images/Posters'));
    } else if (file.fieldname === 'banner') {
      cb(null, path.join(__dirname, 'public/Images/Banners'));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

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

app.get('/privacy-policy', (req, res) => {
  res.render('pages/privacy');
  console.log('privacy policy page requested');
});

app.get('/profile', (req, res) => {
  res.render('pages/profile');
  console.log('profile page requested');
});

app.get('/admin', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data/movies.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const movies = JSON.parse(data);
    console.log('dashboard page requested with movies');
    res.render('pages/dashboard', { movies });
  } catch (err) {
    console.error('Error loading movies for dashboard:', err);
    res.status(500).send('Failed to load dashboard data');
  }
});

app.get('/admin/movies', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data/movies.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const movies = JSON.parse(data);
    console.log('dashboard page requested with movies');
    res.render('pages/manageMovies', { movies });
  } catch (err) {
    console.error('Error loading movies for dashboard:', err);
    res.status(500).send('Failed to load dashboard data');
  }
});

app.get('/admin/add-movie', (req, res) => {
  res.render('pages/add-movie');
  console.log('add page requested');
});

app.post('/admin/add-movie', upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, genre, rating, duration, trailer, description } = req.body;

    const posterPath = '/Images/Posters/' + req.files['poster'][0].filename;
    const bannerPath = '/Images/Banners/' + req.files['banner'][0].filename;

    const newMovie = {
      id: Date.now().toString(),
      title,
      genre,
      rating,
      duration,
      trailer,
      description,
      poster: posterPath,
      banner: bannerPath
    };

    const dataPath = path.join(__dirname, 'data/movies.json');
    const fileData = await fs.readFile(dataPath, 'utf-8');
    const movies = JSON.parse(fileData);

    movies.push(newMovie);
    await fs.writeFile(dataPath, JSON.stringify(movies, null, 2));

    res.redirect('/admin');
  } catch (err) {
    console.error('Failed to save movie:', err);
    res.status(500).send('Internal Server Error');
  }
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

// Delete a movie by ID
app.delete('/api/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const dataPath = path.join(__dirname, 'data/movies.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const movies = JSON.parse(data);

    const updatedMovies = movies.filter(movie => String(movie.id) !== String(movieId));

    if (updatedMovies.length === movies.length) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    await fs.writeFile(dataPath, JSON.stringify(updatedMovies, null, 2));
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

// 👇 START THE SERVER
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});