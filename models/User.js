const mongoose = require('mongoose');
//UserShema: name,email,password, date( date se ne unosi -dodaje se po default-u)
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, //znači jedinstven
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, //trenutni datum je default
  },
});

module.exports = mongoose.model('user', UserSchema);
//exportovati će mongose model ( ime kolekcije "user" , pravljena po "UserSchema")
//ovde je kreirana shema za User objekat {name,email,password,date}
//koja će biti importovana unutar users.js kao User, ovako treba sve kolekcije izdvojiti u posebne fajlove
// i samo ih importovati gdje bude trebalo
