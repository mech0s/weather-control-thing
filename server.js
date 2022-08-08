// server.js
// Required steps to create a servient for creating a thing
const Servient = require('@node-wot/core').Servient;
const HttpServer = require('@node-wot/binding-http').HttpServer;
const td = require("./weather_control_thing.td.json");

const mcutil = require("minecraft-server-util");
const config = require("./config.json");


const RCON = new mcutil.RCON();

let weather_state = "rain";

const servient = new Servient();
servient.addServer(new HttpServer());
servient.start().then((WoT) => {
    WoT.produce( td )
    .then((thing) => {
        console.log("Produced " + thing.getThingDescription().title);
        thing
        .setActionHandler("clear", async () => setWeather("clear"))
        .setActionHandler("rain", async () => setWeather("rain"))
        .setActionHandler("thunder", async () => setWeather("thunder"))
        

        thing.expose().then(() => {
            console.log(thing.getThingDescription().title + " ready");
            setWeather("clear");
        })
    })

});


function setWeather(val){
    if (weather_state != val) {
        RCON.connect(config.mchost,config.mcport)
        .then ( (res) => {
            console.log("Connected " + res);
                return RCON.login('minecraft');
        })
        .then( ( loggedin ) => console.log('logged in')    )
        .then( ( ready ) => RCON.run('weather '+val) )
        .then ( () => RCON.close() );
        weather_state = val;
    }
}

