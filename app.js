const express = require("express");
const cors = require("cors");
const path = require("path");
var logger = require("morgan");

require("dotenv").config();
const http = require("http");
const connectDB = require("./config/database");

const authRouter = require("./routes/authRouter");

const app = express();

// Connexion à MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));//combined

// Routes
app.use("/auth", authRouter);

// Route de base
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API Express!" });
});

// Démarrage du serveur HTTP
const server = http.createServer(app);
server.listen(process.env.PORT, () => {
  console.log(
    `Le serveur est en cours d'exécution sur le port ${process.env.PORT}`
  );
});
