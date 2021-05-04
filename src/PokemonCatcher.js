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

    async getPokemonByType() { // where to put async and where is it redundant?
        let response = await this._sendRequest(typeEndpoint, this.type);
        return response;
    }

    async getPokemonByHabitat() {
        let response = await this._sendRequest(habitatEndpoint, this.habitat);
        return response;
    }

    async _sendRequest(endpoint, filter) {
        const url = endpoint + filter + '/';
        const getJSON = bent('json');
        return getJSON(url);
    }
}   

module.exports = PokemonCatcher