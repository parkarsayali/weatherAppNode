"use strict";

const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");
const hostname = "127.0.0.1";
const port = 8000;

const replaceVal = (tempVal, curVal) => {
  // tempVal contains all the tempvalues in home.html
  let temprature = tempVal.replace(
    "{%tempval%}",
    (curVal.main.temp - 273.15).toFixed(2)
  );
  temprature = temprature.replace(
    "{%tempmin%}",
    (curVal.main.temp_min - 273.15).toFixed(2)
  );
  temprature = temprature.replace(
    "{%tempmax%}",
    (curVal.main.temp_max - 273.15).toFixed(2)
  );
  temprature = temprature.replace("{%temploc%}", curVal.name);
  temprature = temprature.replace("{%tempcont%}", curVal.sys.country);
  temprature = temprature.replace("{%tempstat%}", curVal.weather[0].main);

  return temprature;
};

const server = http.createServer((req, res) => {
  if ((req.url = "/")) {
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=mumbai&appid=902b9f64d4661bc3d7d5449aa60fcf24`
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
        console.log("end");
      });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
