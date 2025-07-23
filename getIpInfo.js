const axios = require("axios");

function getIpinfo(ip) {
    axios.get(`http://ip-api.com/json/${ip}`)
        .then(response => {
            console.log(`IP data for ${ip}:`, response.data);
        })
        .catch(error => {
            console.log("Error getting IP info:", error);
        });
}

module.exports = getIpinfo;