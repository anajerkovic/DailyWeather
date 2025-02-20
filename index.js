import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const API_KEY = "5b999f9257f57b49747bd78119475543";
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true })); // Middleware to parse form data


app.get("/", (req, res) => {
    res.render("index.ejs", { city: null,  error: null });
});

app.post("/", (req,res) => {
    res.render("index.ejs", { city: null,  error: null });
});

app.post("/weather", async (req,res) => {
    try{
        const CITY_NAME = req.body["city_name"];
        const response = await axios.get("https://api.openweathermap.org/data/2.5/weather?q="+CITY_NAME+"&appid="+API_KEY+"&units=metric");
        const currentTime = response.data.dt;
        const currentDate = new Date(currentTime*1000);
    
        res.render("index.ejs",
            {
                city: response.data.name,
                main: response.data.weather[0].main,
                description: response.data.weather[0].description,
                temp: response.data.main.temp,
                humidity: response.data.main.humidity,
                currentDate: currentDate.toDateString(),
                currentTime: currentDate.toLocaleTimeString(),
                icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`, 
                temp_min: response.data.main.temp_min, 
                temp_max: response.data.main.temp_max,
                error:null
            });

    }catch(error){
        let errorMessage = "An error occurred. Please try again.";

        // Handle city not found error
        if (error.response && error.response.status === 404) {
            errorMessage = "City not found. Please enter a valid city name.";
        }

        res.render("index.ejs", {
            city: null,
            error: errorMessage,
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})