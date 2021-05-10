const fs = require('fs');
const axios = require('axios');


const MEDIA_DIR = './media'; // is there a good file to put constants stored?
const TYPE_ENDPOINT = 'https://pokeapi.co/api/v2/type/';
const HABITAT_ENDPOINT = 'https://pokeapi.co/api/v2/pokemon-habitat/';
const TEST_TYPE = 'flying';
const TEST_HABITAT = 'cave';


// where should these functions go?  In src maybe but what would the file be called?

if (!fs.existsSync(MEDIA_DIR)){
    fs.mkdirSync(MEDIA_DIR);
}

async function sendRequest(endpoint, filter) { // at what point does it make sense to name a specific function call ?
    try {
        const url = endpoint + filter + '/';
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
    }   
}

async function getTypePokemon(type) {
    const typeResponse = await sendRequest(TYPE_ENDPOINT, type);
    const typePokemon = typeResponse.pokemon; // this one is nested one more level
    return typePokemon.map((pokemon) => {
        return {
            'name': pokemon['pokemon']['name'],
            'endpoint': pokemon['pokemon']['url']
        };
    });
}

async function getHabitatPokemon(habitat) {
    const habitatResponse = await sendRequest(HABITAT_ENDPOINT, habitat);
    const habitatPokemon = habitatResponse.pokemon_species;
    return habitatPokemon.map((pokemon) => {
        return {
            'name': pokemon['name'],
            'endpoint': pokemon['url'].replace('pokemon-species', 'pokemon')
        };
    })
}

// const typePokemon = getTypePokemon(TEST_TYPE).then(console.log);
const habitatPokemon = getHabitatPokemon(TEST_HABITAT).then(console.log);


