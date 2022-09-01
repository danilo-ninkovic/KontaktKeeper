// ---- basic CRUD API kolekciju Contact-s od pojedinačnog User-a
//router.get() - traženje kontakata
//router.post() - unos novog kontakta (nakon validacije unosa)
//router.put('/:id' - promjena postojećeg Contact-a, preko id-a od User-a
//provjerava se i da li User vlasnik od traženog Contact-a (contactById.user.toString() !== req.user.id)
//ako je sve ok onda se pomoću Contact.findByIdAndUpdate mijenjaju oni parametri Contact-a koni su uneseni ostali ostaju ne promijenjeni
//router.delete('/:id) - brisanje traženog Contact-a preko User-id
//provjera da li postoji traženi Contact
//provjerava se i da li User vlasnik od traženog Contact-a (contactById.user.toString() !== req.user.id)
//ako je sve ok onda se pomoću Contact.findByIdAndRemove briše traženi Contact

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); //čekiranje token-a u parametru 2
const { body, validationResult } = require('express-validator'); //za validaciju unesenih podataka user-a

const User = require('../models/User'); //importovanje "user" kolekcije po UserSchema iz User.js
const Contact = require('../models/Contact'); //importovanje "contact" kolekcije

//@route  GET api/contacts
//@desc   Get all users contacts
//@acces  Private, zato što moraš prvo biti logovan
router.get('/', auth, async (req, res) => {
  try {
    //dohvatanje user iz Contact kolekcije pomoću req.user(iz auth-a).id sortirani po datumu (most recent)
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1, //descending
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server eror iz contacts.get');
  }
});

//@route  POST api/contacts
//@desc   Add new contact
//@acces  Private pa će trebati "auth" autorizacija a potreban je čekiranje body unosa (name)
router.post(
  '/',
  [auth, [body('name', 'Morate unijeti ime').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req); // errors je rezultat čekiranja validacije req.body-a
    if (!errors.isEmpty()) {
      //ako errors nije "!" empty tj. ako postoji nešto vratit će status kod 400 i json "errors": [ {za sve što nije u redu}, ]
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body; //ovo su body unosi za post

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id, //ovo je id user-a iz auth-a
      });
      const contact = await newContact.save(); //uneseno je sačuvano kao "contact"
      res.json(contact); //i poslano u response kao json
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error iz contact.js');
    }
  }
);

//@route  PUT api/contacts/:id
//@desc   Update contact preko id-a
//@acces  Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body; //ovo su body unosi za update

  //Izgradnja contact objecta
  const contactFields = {};
  if (name) contactFields.name = name; //ako je unesno name onda punimo contactFileds {}
  if (email) contactFields.email = email; //isto ...
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contactById = await Contact.findById(req.params.id);
    //ovo je id od kontakta iz URL-a "/:id", treba biti isti kao id kontakta koji mijenjamo

    if (!contactById)
      return res.status(404).json({ msg: 'Kontakt nije pronađen' });

    //Biti siguran da user posjeduje kontak za update
    if (contactById.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Niste ovlašteni za promjenu' });
    }
    // i konačno update
    contactById = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $set: contactFields, //promijeniti sa onim što je uneseno "contactFields"
      },
      { new: true } // ako ne postoji pronađeni onda će sačuvati kao novi
    );
    res.json(contactById); // sada to šalje u res
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error iz contact.js');
  }
});

//@route  DELETE api/contacts/:id
//@desc   Brisanje contact-a preko id-a
//@acces  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let contactById = await Contact.findById(req.params.id);
    //ovo je id od kontakta iz URL-a "/:id", treba biti isti kao id kontakta koji mijenjamo

    if (!contactById)
      return res
        .status(404)
        .json({ msg: 'Kontakt za brisanje ,nije pronađen' });

    //Biti siguran da user posjeduje kontak za update
    if (contactById.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Niste ovlašteni za brisanje' });
    }
    // i konačno delete
    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Kontakt obrisan' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error iz contact.js');
  }
});

module.exports = router;
