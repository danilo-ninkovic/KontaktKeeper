const mongoose = require("mongoose");
const config = require("config"); //config folder sa global varijablama(instalirani config paket to omogućava)
const db = config.get("mongoURI"); // u config folderu u default.json-u, adresa za pristup cluster-u u mongo atlas-u

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      //konektovati će mongo-atlas bazu "db" preko "mongoURI"
      useNewUrlParser: true, //ovo sve su deprecatori
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected..."); //ako je konektovana
  } catch (err) {
    console.error(err.message);
    process.exit(1); // exit with failure "1"
  }
};

module.exports = connectDB; // funkcija će biti pozvana u server.js
