var PokemonCatcher = require('./src/PokemonCatcher.js');
const fetch = require('node-fetch');

const TEST_TYPE = 'flying';
const TEST_HABITAT = 'cave';

// based on this tutorial https://www.vikingcodeschool.com/professional-development-with-javascript/writing-the-api-wrapper

const pokecatcher = new PokemonCatcher(TEST_HABITAT, TEST_TYPE);

async function catchPokemon() {
    try {
        pokecatcher.init().then(val => {
            console.log("success");
            return val + 1;
        }, console.log).then(console.log)
    } catch (err) {
        console.log(err)
    }
}

catchPokemon()
