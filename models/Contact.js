const mongoose = require("mongoose");

const ContactSchema = mongoose.Schema({
  // contact kolekcija će se vezati za pojedinačnog user-a i user kolekcije
  //svaki user će imati svoje kontakte
  //pojedinačnom useru pristupamo preko automatskog id-a  koji generiše mongo i referišemo se na određenu kolekciju "users"
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", //kolekcija od ObjectId-a
  },

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  type: {
    //  personal ili profesional
    type: String,
    default: "personal",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("contact", ContactSchema);
