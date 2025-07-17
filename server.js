import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import movieRoutes from './src/routes/movieRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import pageRoutes from './src/routes/pageRoutes.js';
import theaterRoutes from './src/routes/theaterRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', movieRoutes);
app.use('/', adminRoutes);
app.use('/', pageRoutes);
app.use('/api', theaterRoutes);

// 👇 START THE SERVER
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
