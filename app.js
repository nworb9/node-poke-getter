const { response } = require('express');
const request = require('request');

const TYPE_ENDPOINT = 'https://pokeapi.co/api/v2/type/'
const HABITAT_ENDPOINT = 'https://pokeapi.co/api/v2/pokemon-habitat/'

const TEST_TYPE = 'flying'

request(TYPE_ENDPOINT + TEST_TYPE + '/', function (error, response, body) {
    if (!error && response.statusCode == 200){
        console.log(JSON.parse(body))
    }
})