//u middlevare-u je funkcija koja hvata  request i response ciklus i čekira u heder-u da li ima json token-a ( čekiranje poziva  u drugom parametru request-a)
//Ovo je samo za protected route (private)
const jwt = require('jsonwebtoken');
const config = require('config'); //fajl u kome je  jwtSecret

module.exports = function (req, res, next) {
  //kod middlewarea treba next da bi izašao dalje
  //Get token from header
  const token = req.header('x-auth-token'); //u hederu traži token

  // ako nema tokena u hederu
  if (!token) {
    return res.status(401).json({ msg: 'No token, pristup odbijen' });
  }
  //ako ima tokena
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret')); //verifikuj taj token sa secretom i sad se zove "decoded"
    req.user = decoded.user; //sada je i uneseni user verifikovan
    //u router.get će se pozivati preko id-a, kao "req.user.id" nakon što je ovde verifikovan i potvđen kao req.user
    next(); //dalje
  } catch (err) {
    res.status(401).json({ msg: 'Token nije validan' });
  }
};
