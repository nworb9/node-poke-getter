import request from 'request';

const typeEndpoint = 'https://pokeapi.co/api/v2/type/'
const habitatEndpoint = 'https://pokeapi.co/api/v2/pokemon-habitat/'

const TEST_TYPE = 'flying'
const TEST_HABITAT = 'cave'

// based on this tutorial https://www.vikingcodeschool.com/professional-development-with-javascript/writing-the-api-wrapper

request(typeEndpoint + TEST_TYPE + '/', function (error, response, body) {
    if (!error && response.statusCode == 200){
        console.log(JSON.parse(body))
    }
})

request(habitatEndpoint + TEST_HABITAT + '/', function (error, response, body) {
    if (!error && response.statusCode == 200){
        console.log(JSON.parse(body))
    }
})