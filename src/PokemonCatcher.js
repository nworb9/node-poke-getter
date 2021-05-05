const bent = require('bent');

const typeEndpoint = 'https://pokeapi.co/api/v2/type/';
const habitatEndpoint = 'https://pokeapi.co/api/v2/pokemon-habitat/';



class PokemonCatcher {
    constructor(habitat, type) {
        this.habitat = habitat;
        this.type = type;
        this.type_pokemon = [];
        this.habitat_pokemon = [];
        this.pokemon = [];
    }

    async init () {
        await this.config();
    }

    async config() {
        this.type_pokemon = await this.getPokemonByType();
        this.habitat_pokemon = await this.getPokemonByHabitat();
        this.pokemon = await this.filterPokemon();
    }

    async filterPokemon() {}

    async getPokemonByType() {
        let results = await this._sendRequest(typeEndpoint, this.type);
        if ('pokemon' in results) { // better way to validate this?
            return this._unnestTypePokemon(results['pokemon'])
        } 
        else { // how are you meant to define reuseable errors in JS
            throw 'API call unsuccessful -- confirm valid endpoint and filters!'
        }
    }

    async getPokemonByHabitat() {
        let results = await this._sendRequest(habitatEndpoint, this.habitat);
        if ('pokemon_species' in results) {
            return this._unnestHabitatPokemon(results['pokemon_species']);
        }
        else {
            throw 'API call unsuccessful -- confirm valid endpoint and filters!'
        }
    }

    _unnestTypePokemon(pokemon_list) {
        var result = [];
        for (var i = 0; i < pokemon_list.length; i++) {
            var new_pokemon = {
                'pokemon': pokemon_list[i]['pokemon']['name'],
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
                'pokemon': pokemon_list[i]['name'],
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