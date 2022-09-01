//---ovdje je registracija (unos novog User-a)
//preko router.post() unosi se {name,email, password}
//čekira se validacija (da li su unosi ispravni) - pomoću exprress-validator-a
//zatim se na osnovu mail-a provjerava da li već postoji User
//ako ne postoji onda se formira novi User objekat, password se kriptuje pomoću bcript-a. i sejvira u mongo atlas
//zatim se šalje token pomoću jwt-a (tu je potreban i "config" folder zbog JwtSecret-a)

const express = require('express');
const router = express.Router(); //Router paket u express-u koristit će se umjesto app.post itd
const bcrypt = require('bcryptjs'); //za kriptivanje i hash unesenog password-a
const jwt = require('jsonwebtoken');
const config = require('config'); //u config fajlu je jwtSecret koji je potreban za sign()
const { body, validationResult } = require('express-validator'); //za validaciju unesenih podataka user-a
const User = require('../models/User'); //importovanje "user" kolekcije po UserSchema iz User.js

//sada kada kreiramo route više ne ide npr. app.post već router.post i sl.

//@route  POST api/users
//@desc   Register a user
//@acces  Public
router.post(
  '/', //prvi parametar je route
  [
    //u drugom parametru [] je čekiranje ispravnog unosa preko express-validatora
    //čekiranje samo po sebi ne čini ništa, tek unutar callback funkcije preko validationResult-a se šalje poruka
    body('name', 'Morate unijeti ime').not().isEmpty(), //ako nema unosa poruka "Morate unijeti ime"
    body('email', 'Unesite validnu email adresu').isEmail(),
    body('password', 'Unesite password od 6 ili više karaktera').isLength({
      min: 6,
    }),
  ], //treći parametar je callback funkcija sa (req,res)
  async (req, res) => {
    const errors = validationResult(req); // errors je rezultat čekiranja validacije req.body-a
    if (!errors.isEmpty()) {
      //ako errors nije "!" empty tj. ako postoji nešto vratit će status kod 400 i json "errors": [ {za sve što nije u redu}, ]
      return res.status(400).json({ errors: errors.array() });
    }
    //ovo će uraditi ako je validacija OK
    const { name, email, password } = req.body;

    try {
      //Pronađi objekat User po unesenom email-u
      let user = await User.findOne({ email }); //isto kao email:email zbog ES6
      if (user) {
        return res.status(400).json({ poruka: 'Korisnik već postoji' });
      }
      //ako user ne postoji onda će biti kreiran kao novi User
      user = new User({
        name, //isto kao name:name
        email,
        password,
      });
      //prije nego se sejvira moramo izvršiti enkripciju password-a
      const salt = await bcrypt.genSalt(10); //generisanje 10 -strukog saltovanja
      user.password = await bcrypt.hash(password, salt); //sada password postaje hashovan 10*saltovan
      await user.save(); //sada je sačuvan u bazu

      //Umjesto res.send() sada šaljemo json web token:
      const payload = {
        user: { id: user.id }, //preko user.id-a pristupamo cijelom objektu User-to je sada "payload.user"
      };

      jwt.sign(
        payload, //user.id
        config.get('jwtSecret'), //unutar config-default.json -drugi parametar
        {
          //treći parametar je objekat sa opcijama
          expiresIn: 36000, //za 10 sati će  prekinuti konekciju
        }, //četvrti parametar callback sa err i token
        (err, token) => {
          if (err) throw err;
          res.json({ token }); //poslat će kriptovani token sa user.id brojem, vremenom exp(expire) itd
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router; //exportovanje routera
