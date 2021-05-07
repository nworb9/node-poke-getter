const bent = require('bent'); // switch entirely to axios
const fs = require('fs');
const axios = require('axios');

const MEDIA_DIR = './media';
const TYPE_ENDPOINT = 'https://pokeapi.co/api/v2/type/';
const HABITAT_ENDPOINT = 'https://pokeapi.co/api/v2/pokemon-habitat/';



class PokemonCatcher {
    constructor(habitat, type) {
        this.habitat = habitat;
        this.type = type;
    }

    async init () {
        if (!fs.existsSync(MEDIA_DIR)){
            fs.mkdirSync(MEDIA_DIR);
        }
        await this.config();
        return 1;
    }

    async config() { 
        const getPokemon = async() => {
            const type_pokemon = await this._getPokemonByType();
            const habitat_pokemon = await this._getPokemonByHabitat();
            const filtered_pokemon = await this._filterPokemon(habitat_pokemon, type_pokemon);
            console.log("filtered pokemon", filtered_pokemon)
            // const sprites = Promise.all(  // getting a list of promises (the downloading sprites)
            //     final_pokemon.map(async (pokemon) => {
            //         const sprite = this._getSprite(pokemon.endpoint);
            //         return sprite
            //     })
            // )
            const final_pokemon = filtered_pokemon.reduce((list, pokemon) => {
                console.log('list', list)
                console.log('pokemon', pokemon)
            }, [])
            return final_pokemon
            
        }
        const pokemon = await getPokemon()
        return pokemon
    }

    async _getSprite(endpoint){
        // https://www.kindacode.com/article/using-axios-to-download-images-and-videos-in-node-js/
        try {
            const response = await axios({
                method: "GET",
                url: endpoint,
                responseType: "stream",
            });
            console.log(response)
        } catch (err) {
            throw 'API call unsuccessful -- confirm valid endpoint and filters!'
        }
    }

    async _filterPokemon(habitat_pokemon, type_pokemon) {
        if (type_pokemon.length & habitat_pokemon.length) {
            return type_pokemon.filter(element => habitat_pokemon.includes(element));
        }
        else if (habitat_pokemon != []) {
            return habitat_pokemon;
        }
        else if (type_pokemon != []) {
            return type_pokemon;
        }
    }

    async _getPokemonByType() {
        let results = await this._sendRequest(TYPE_ENDPOINT, this.type);
        if ('pokemon' in results) { // better way to validate this?
            return this._unnestTypePokemon(results['pokemon'])
        } 
        else { // how are you meant to define reuseable errors in JS
            throw 'API call unsuccessful -- confirm valid endpoint and filters!'
        }
    }

    async _getPokemonByHabitat() {
        let results = await this._sendRequest(HABITAT_ENDPOINT, this.habitat);
        if ('pokemon_species' in results) {
            return this._unnestHabitatPokemon(results['pokemon_species']);
        }
        else {
            throw 'API call unsuccessful -- confirm valid endpoint and filters!'
        }
    }

    _unnestTypePokemon(pokemon_list) {
        var result = [];
        for (var i = 0; i < pokemon_list.length; i++) { // still need to replace w/ functional equivalent
            var new_pokemon = {
                'name': pokemon_list[i]['pokemon']['name'],
                'endpoint': pokemon_list[i]['pokemon']['url']
            };
            result.push(new_pokemon);
        }
        return result;
    }

    _unnestHabitatPokemon(pokemon_list) {
        var result = [];
        for (var i = 0; i < pokemon_list.length; i++) {
            var new_pokemon = {
                'name': pokemon_list[i]['name'],
                'endpoint': pokemon_list[i]['url'].replace('pokemon-species', 'pokemon')
            };
            result.push(new_pokemon);
        }
        return result;
    }

    async _sendRequest(endpoint, filter) {
        const url = endpoint + filter + '/';
        const getJSON = bent('json');
        return getJSON(url);
    }
}   

module.exports = PokemonCatcher