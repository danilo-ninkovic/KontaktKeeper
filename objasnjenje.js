//pomoću "concurrently": "^5.2.0",
//pokretat ćemo oba servera
//(localhost 500) za backend(express) i localhost 300 za React koji je u "client"folderu
//umjesto posebno "npm run server" i "npm start" u dva odvojena terminala
//pozivat će se "npm run dev " za oba pomoću( "dev": "concurrently \"npm run server\" \"npm run client\"")
//u client/package.json, dodat je "proxy": "http://localhost:5000"
//da bi se prilikom axios requesta umjesto npr "http://localhost:5000/api"
// unosilo sam "/api"

//------- u client folderu je smješten React frontend
