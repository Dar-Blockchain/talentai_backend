const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const authRouter = require('./routes/authRouter');

const app = express();
const port = process.env.PORT || 3000;

// Connexion à MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRouter);

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Express!' });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
}); 