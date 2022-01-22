
// jshint version:6
// require('dotenv').config()

const express = require("express");
const app = express();

app.use(express.static(__dirname + '/public'));

const https = require('https');

const hbs = require('express-handlebars');

app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", function (req, res) {
    res.render("index");

})

app.post("/", function (req, res) {
    const Location = req.body.location;
    // if(req.body.location!=null){
    //     Location==req.body.location;
    // }

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + Location + "&appid=a1ee93f3cea7cd7e6f0b4c44c73a6c73&units=metric";
    https.get(url);

    https.get(url, function (response) {
        response.on("data", function (data) {

            const wea_data = JSON.parse(data);
            if (wea_data.cod==200) {

                // console.log(wea_data);
                // const weather_icon = "http://openweathermap.org/img/w/o1n.png";
                const weather_icon = "http://openweathermap.org/img/w/" + wea_data.weather[0].icon + ".png";


                res.render("index", {
                    icon_source: weather_icon,
                    desc:wea_data.weather[0].description,
                    place: Location,
                    temp: wea_data.main.temp,
                    maxtemp:wea_data.main.temp_max,
                    mintemp:wea_data.main.temp_min
                });
            }

            else{
                res.render("index", {
                    icon_source: "undefined",
                    desc:"undefined",
                    place: "Location undefined",
                    temp: "undefined",
                    maxtemp:"undefined",
                    mintemp:"undefined"
                });
            }

        })


    })

});

app.listen(3000, function () {
    console.log("weather app is running");
})
