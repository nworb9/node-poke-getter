const bent = require('bent');

const typeEndpoint = 'https://pokeapi.co/api/v2/type/';
const habitatEndpoint = 'https://pokeapi.co/api/v2/pokemon-habitat/';

class PokemonCatcher {
    constructor(habitat, type) {
        this.habitat = habitat;
        this.type = type;
        this.type_pokemon = [];
        this.habitat_pokemon = [];
    }

    getPokemonByType() {
        this.type_pokemon = await this._sendRequest(typeEndpoint, this.type);
        return this.type_pokemon;
    }

    getPokemonByHabitat() {
        this.habitat_pokemon = await this._sendRequest(habitatEndpoint, this.habitat);
        return this.habitat_pokemon;
    }

    _sendRequest(endpoint, filter) {
        const url = endpoint + filter + '/';
        const getJSON = bent('json');
        let pokemon = await getJSON(url);
        return pokemon;
    }
}   

module.exports = PokemonCatcher