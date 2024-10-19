import bodyParser from "body-parser";
import express from "express";
import https from "https";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index" , {query: null, temp: null, description: null, icon: null});
});

app.post("/search", (req, res) => {
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const url = 'https://api.openweathermap.org/data/2.5/weather?q='+ query +'&appid='+ apiKey +'&units=metric';
    https.get(url, (response) => {
        console.log('statusCode:', response.statusCode);
        response.on('data', (d) => {
            const weatherData = JSON.parse(d);
            const weatherTemp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const weatherIcon = weatherData.weather[0].icon;
            res.render("result", {query: query, temp: weatherTemp, description: weatherDescription, icon: weatherIcon});
            setTimeout(() => {
                res.redirect("/");
            }, 3000);
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});