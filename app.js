var PokemonCatcher = require('./src/PokemonCatcher.js');

const TEST_TYPE = 'flying';
const TEST_HABITAT = 'cave';

// based on this tutorial https://www.vikingcodeschool.com/professional-development-with-javascript/writing-the-api-wrapper

const pokecatcher = new PokemonCatcher(TEST_HABITAT, TEST_TYPE);

const pokemon = pokecatcher.getPokemonByType();

console.log('app.js', pokemon);