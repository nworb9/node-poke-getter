const fs = require("fs");
const axios = require("axios");

const MEDIA_DIR = "./media"; // is there a good file to put constants stored?
const TYPE_ENDPOINT = "https://pokeapi.co/api/v2/type/";
const HABITAT_ENDPOINT = "https://pokeapi.co/api/v2/pokemon-habitat/";
const TYPE = "dark";
const HABITAT = "cave";

if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR);
}

async function requestPokemon(endpoint, filter) {
  try {
    const url = endpoint + filter + "/";
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getSprite(pokemon) {
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

async function getTypePokemon(type) {
  const typeResponse = await requestPokemon(TYPE_ENDPOINT, type).catch((e) => {
    console.log(e);
  });
  const typePokemon = typeResponse.pokemon;
  return typePokemon.map((pokemon) => ({
    name: pokemon["pokemon"]["name"],
    endpoint: pokemon["pokemon"]["url"],
  }));
}

async function getHabitatPokemon(habitat) {
  const habitatResponse = await requestPokemon(HABITAT_ENDPOINT, habitat).catch(
    (e) => {
      console.log(e);
    }
  );
  const habitatPokemon = habitatResponse.pokemon_species;
  return habitatPokemon.map((pokemon) => ({
    name: pokemon["name"],
    endpoint: pokemon["url"].replace("pokemon-species", "pokemon"),
  }));
}

function filterPokemon(type_pokemon, habitat_pokemon) {
  return type_pokemon.filter((pokemon) =>
    habitat_pokemon.find(({ name }) => pokemon.name === name)
  );
}

async function getPokemon(type, habitat) {
  const typePokemon = await getTypePokemon(type);
  const habitatPokemon = await getHabitatPokemon(habitat);
  const pokemonList = filterPokemon(typePokemon, habitatPokemon);
  const finalPokemon = await Promise.all(
    pokemonList.map(async (poke) => {
       const sprite = await getSprite(poke).catch((e) => {console.log(e)});
       return {
         name: poke["name"],
         sprite: sprite,
       }
    }
  ));
  return finalPokemon;
}

// add handling for when there isn't a type/habitat specified

const pokemon = getPokemon(TYPE, HABITAT).then(console.log);