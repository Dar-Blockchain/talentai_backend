const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/database');
const authRouter = require('./routes/authRouter');

const http = require('http');


const app = express();
const port = process.env.PORT || 5000;

// Connexion à MongoDB
connectDB();    

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques depuis le dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRouter);

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Express!' });
});

// Démarrage du serveur HTTP
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
}); 