const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;
const request = require('request'); 
const util = require('util');


let apiKey = "2fcf9292d332ee7172fb5b5710d30332";

function firstEntity(nlp, name) {
  return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

module.exports = botBuilder(async message => {
  if (message.type === 'facebook') {
    
    const nlp = message.originalRequest.message.nlp;
    
    const greeting = firstEntity(nlp, 'greetings');
    const thanks = firstEntity(nlp, 'thanks');
    const location = firstEntity(nlp, 'location');
    if (greeting && greeting.confidence > 0.8) {
      return "Hey! How are you?";
    } else if (thanks && thanks.confidence > 0.8) {
      return "You're welcome";
    } else if (location && location.confidence > 0.8) { 
      const lat = location.resolved.values[0].coords.lat;
      const lon = location.resolved.values[0].coords.long;
      const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      promised_request = (url)=> {
        return new Promise((resolve, reject) => {
            request(url, function (err, response, body) {
              if(err){
                console.log('error:', error);
                resolve("Couldn't find the weather");
              } else {
                let weather = JSON.parse(body);
                let message = `It's ${weather.main.temp} degrees celcius in
                     ${weather.name}!`;
                resolve(message);
              } 
            });
        });

      }
      let result = await promised_request(url);
      // let result = await request(url, function (err, response, body) {
      //   if(err){
      //     console.log('error:', error);
      //     return "Couldn't find the weather";
      //   } else {
      //     let weather = JSON.parse(body);
      //     let message = `It's ${weather.main.temp} degrees in
      //          ${weather.name}!`;
      //     return message;
      //   } 
      // });

      return result;
    } else {
      console.log("Couldn't understand message");
    }

  }
});
