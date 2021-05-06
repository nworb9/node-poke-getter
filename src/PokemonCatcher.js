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
        this.type_pokemon = [];
        this.habitat_pokemon = [];
        this.pokemon = [];
    }

    async init () {
        await this.config().catch();
    }

    async config() { 
        if (!fs.existsSync(MEDIA_DIR)){
            fs.mkdirSync(MEDIA_DIR);
        }
        this.type_pokemon = await this._getPokemonByType();
        this.habitat_pokemon = await this._getPokemonByHabitat();
        this.pokemon = await this._filterPokemon();
    }

    async getSprite(endpoint){
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

    async _filterPokemon() {
        const final_pokemon = [];
        if (this.type_pokemon.length & this.habitat_pokemon.length) {
            console.log("both exist")
            final_pokemon = this.type_pokemon.filter(element => this.habitat_pokemon.includes(element));
            console.log(final_pokemon)
        }
        else if (this.habitat_pokemon != []) {
            final_pokemon = this.habitat_pokemon;
        }
        else if (this.type_pokemon != []) {
            final_pokemon = this.type_pokemon;
        }
        for (var i = 0; i < final_pokemon.length; i++) { // still need to replace w/ functional equivalent
            var new_pokemon = {
                'name': final_pokemon[i]['name'],
                'sprite': this._getSprite(final_pokemon[i]['endpoint'])
            };
            result.push(new_pokemon);
        }
        return final_pokemon;
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