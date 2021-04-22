const bent = require('bent');

const typeEndpoint = 'https://pokeapi.co/api/v2/type/';
const habitatEndpoint = 'https://pokeapi.co/api/v2/pokemon-habitat/';

class PokemonCatcher {
    constructor(habitat, type) {
        this.habitat = habitat;
        this.type = type;
    }

    getPokemonByType(callback) {
        return this._sendRequest(typeEndpoint, this.type, callback);

    }

    getPokemonByHabitat(callback) {
        return this._sendRequest(habitatEndpoint, this.habitat, callback);
    }

    _sendRequest(endpoint, filter, callback) {
        const url = endpoint + filter + '/';
        const getJSON = bent('json');
        getJSON(url);
    }
}   

module.exports = PokemonCatcher