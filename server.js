//OVO JE PARENT ZA FAJLOVE UBUTAR ROUTES FOLDERA

const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

//Connect Database funkcija pozvana iz db.js a donesena gore preko require('./config/db');
connectDB();

//dodavanje Midllleware-a za preuzimanje json body podataka preko POST-a ovo je umjesto body-parsera
app.use(express.json({ extended: false }));

// definisanje ROUTE-s  (svaki backend route će početi sa "/api")

app.use('/api/users', require('./routes/users')); // require file users.js
app.use('/api/contacts', require('./routes/contacts')); // u contacts.js "/api/contacts"   je  samo "/"
app.use('/api/auth', require('./routes/auth'));

//Serve static assets in production (podešavanje za produkciju na netu)
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));
  //app.get (bilo šta '*' što nije od gore definisanih routa)
  app.get('*', (req, res) =>
    //__dirname(current directory) zatim client folder pa zatim build folder pa index.html
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Aplikacija je pokrenuta  na portu ${PORT} `)
);
