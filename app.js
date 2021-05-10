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

async function requestPokemon(endpoint, filter) { // at what point does it make sense to name a specific function call ?
    try {
        const url = endpoint + filter + '/';
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
    }   
}

async function getSprite(endpoint){
    // https://www.kindacode.com/article/using-axios-to-download-images-and-videos-in-node-js/
    try {
        const response = await axios.get(endpoint);
        return response.data.sprites.front_default;
    } catch (err) {
        throw 'API call unsuccessful -- confirm valid endpoint and filters!'
    }
}

async function getTypePokemon(type) {
    const typeResponse = await requestPokemon(TYPE_ENDPOINT, type).catch(e => { console.log(e) });
    const typePokemon = typeResponse.pokemon; // this one is nested one more level
    return typePokemon.map((pokemon) => {
        return {
            'name': pokemon['pokemon']['name'],
            'endpoint': pokemon['pokemon']['url']
        };
    });
}

async function getHabitatPokemon(habitat) {
    const habitatResponse = await requestPokemon(HABITAT_ENDPOINT, habitat).catch(e => { console.log(e) });
    const habitatPokemon = habitatResponse.pokemon_species;
    return habitatPokemon.map((pokemon) => {
        return {
            'name': pokemon['name'],
            'endpoint': pokemon['url'].replace('pokemon-species', 'pokemon')
        };
    })
}


function filterPokemon(type_pokemon, habitat_pokemon) {
    // https://stackoverflow.com/questions/53603040/filter-array-of-objects-by-another-array-of-objects
    // why doesn't this work?  --> final_pokemon = this.type_pokemon.filter(element => this.habitat_pokemon.includes(element));
    return type_pokemon.filter((pokemon) => habitat_pokemon.find(({ name }) => pokemon.name === name));
}

async function formatPokemon(pokemon_list) {
    // they recommended using normal for loop -> https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop/37576787#37576787
    const finalPokemon = [];
    for (poke in pokemon_list) {
        console.log(poke);
        const spritePath = await getSprite(poke['endpoint']).catch(e => { console.log(e) })
        console.log(spritePath)
        finalPokemon.push({
            'name': poke['name'],
            'sprite': spritePath
        });
    }
    return finalPokemon
}

async function getPokemon(type, habitat) {
    const typePokemon = await getTypePokemon(type);
    const habitatPokemon = await getHabitatPokemon(habitat);
    const pokemonList = filterPokemon(typePokemon, habitatPokemon);
    // const pokemon = pokemonList.reduce((pokemon) => {
    //     console.log(pokemon);
    //     const spritePath = await getSprite(pokemon['endpoint']).catch(e => { console.log(e) })
    //     return {
    //         'name': pokemon['name'],
    //         'sprite': spritePath
    //     };
    // })
    const pokemon = await formatPokemon(pokemonList)
    console.log(pokemon)
}

// add handling for when there isn't a type/habitat specified

getPokemon(TEST_TYPE, TEST_HABITAT)




