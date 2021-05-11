const fs = require("fs");
const axios = require("axios");
const { type } = require("os");

const MEDIA_DIR = "./media"; // is there a good file to put constants stored?
const TYPE_ENDPOINT = "https://pokeapi.co/api/v2/type/";
const HABITAT_ENDPOINT = "https://pokeapi.co/api/v2/pokemon-habitat/";
const TYPE = "dark";
const HABITAT = "urban";

if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR);
}

const requestPokemon =  async (endpoint, filter) => {
  try {
    const url = endpoint + filter + "/";
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

const getSprite = async (pokemon) => {
  // https://www.kindacode.com/article/using-axios-to-download-images-and-videos-in-node-js/
  try {
    const spritePathLocal = MEDIA_DIR + "/" + pokemon["name"] + ".png";
    const response = await axios.get(pokemon["endpoint"]);
    const spritePathRemote = response.data.sprites.front_default;
    const imageResponse = await axios({
      method: "GET",
      url: spritePathRemote,
      responseType: "stream",
    });
    const write = imageResponse.data.pipe(
      fs.createWriteStream(spritePathLocal)
    );
    write.on("finish", () => {
      console.log("downloaded file!");
    });
    return spritePathLocal;
  } catch (err) {
    throw "Sprite download unsuccessful!";
  }
}

const getTypePokemon = async (type) => {
  if (type) {
    const typeResponse = await requestPokemon(TYPE_ENDPOINT, type).catch(
      (e) => {
        console.log(e);
      }
    );
    const typePokemon = typeResponse.pokemon;
    return typePokemon.map((pokemon) => ({
      name: pokemon["pokemon"]["name"],
      endpoint: pokemon["pokemon"]["url"],
    }));
  } else {
    return [];
  }
}

const getHabitatPokemon = async (habitat) => {
  if (habitat) {
    const habitatResponse = await requestPokemon(
      HABITAT_ENDPOINT,
      habitat
    ).catch((e) => {
      console.log(e);
    });
    const habitatPokemon = habitatResponse.pokemon_species;
    return habitatPokemon.map((pokemon) => ({
      name: pokemon["name"],
      endpoint: pokemon["url"].replace("pokemon-species", "pokemon"),
    }));
  } else {
    return [];
  }
}

const filterPokemon = (type_pokemon, habitat_pokemon) => {
    console.log(type_pokemon);
    console.log(habitat_pokemon);
    if (type_pokemon.length !== 0 && habitat_pokemon.length !== 0) {
        console.log(1);
        return type_pokemon.filter((pokemon) =>
        habitat_pokemon.find(({ name }) => pokemon.name === name)
      );    
    } else if (type_pokemon) {
        console.log(2);
        return type_pokemon;
    } else if (habitat_pokemon) {
        console.log(3);
        return habitat_pokemon;
    }
  
}

const getPokemon = async (type, habitat) => {
  const typePokemon = await getTypePokemon(type);
  const habitatPokemon = await getHabitatPokemon(habitat);
  const pokemonList = filterPokemon(typePokemon, habitatPokemon);
  const finalPokemon = await Promise.all(
    pokemonList.map(async (poke) => {
      const sprite = await getSprite(poke).catch((e) => {
        console.log(e);
      });
      return {
        name: poke["name"],
        sprite: sprite,
      };
    })
  );
  return finalPokemon;
}

// TODO add handling for when there isn't a type/habitat specified

const pokemon = getPokemon(TYPE, HABITAT).then(console.log);
