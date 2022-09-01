//ovdje se unutar router.post(), unose email i password od postojećih(registrovanih )User-a
//čekira se validacija unosa, zatim se u bazi pomoću mail-a provjerava postoji li traženi User sa takvim mailom
//ako postoji pomoću bcript-a se upoređuju lozinke da li su iste (unesena i dobivena)
//ako je sve OK pomoću jwt i jwtSEcret-a dobijamo sign() i token

//unutar router.get(), se pomoću auth parametra(funkcija iz middleware-a), provjerava postoji li token za traženog Usera preko user.id
//ako postoji token (x-auth-token) onda se verifikuje req.user - to se sve dešava u middlevare/auth.js
//zatim se user pronađe preko tog req.user.id i pošalje kao json ali selektovano bez password-a

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); //za upoređivanje hash-a
const jwt = require('jsonwebtoken');
const config = require('config'); //u config fajlu je jwtSecret koji je potreban za sign()
const { body, validationResult } = require('express-validator'); //za validaciju unesenih podataka user-a
const User = require('../models/User'); //importovanje "user" kolekcije po UserSchema iz User.js
const auth = require('../middleware/auth'); //funkcija za provjeru tokena u hederu za "private" route-s
//@route  GET api/auth
//@desc   Get logovanje user-a loged-in
//@acces  Private
router.get(
  '/',
  auth, //preko auth parametra će utvrditi postoji li token za traženog user-a
  async (req, res) => {
    try {
      //potražit će usera preko id-a ali neće preuzeti password
      const user = await User.findById(req.user.id).select('-password');
      // i poslati autorizovanog(provjerenog) usera kao json parametar(bez password-a)
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server greška');
    }
  }
);

//@route  POST api/auth
//@desc   Auth user & get token
//@acces  Public
router.post(
  '/',
  [
    body('email', 'Unesite validnu email adresu').isEmail(),
    body('password', 'Morate unijeti password').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req); // errors je rezultat čekiranja validacije req.body-a
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        //ako ne postoji email u bazi
        return res.status(400).json({ poruka: 'Nemate ovlaštenje za pristup' });
      }
      //ako user postoji uporedit ćemo uneseni password sa passwordom u bazi(user.password)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        //ako se ne podudaraju
        return res.status(400).json({ poruka: 'Pogrešna lozinka' });
      }
      //a ako je OK onda:
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
          res.json({ token }); //poslat će kriptovani token   , sa user.id brojem, vremenom exp(expire) itd
        } //u middleware/auth će se taj token provjeriti i potvrditi u router.GET preko drugog parametra "auth"
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
