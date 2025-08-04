import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import movieRoutes from './src/routes/movieRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import pageRoutes from './src/routes/pageRoutes.js';
import theaterRoutes from './src/routes/theaterRoutes.js';
import showRoutes from './src/routes/showRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import pool from './src/config/db.js';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    store: new (pgSession(session))({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.use('/', movieRoutes);
app.use('/', adminRoutes);
app.use('/auth', authRoutes);
app.use('/', pageRoutes);
app.use('/api', theaterRoutes);
app.use('/', showRoutes);
app.use('/api/bookings', bookingRoutes);


app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
