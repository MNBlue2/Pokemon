//como no sabemos lo que tarda la respuesta del servidor en devolver los pokmons, usamos una funcion asincrona que estas devuelven siempre una promesa, es decir
// es decir o es un resultado en una promesa o un error devuelto en una promesa
async function getPokemon(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    //primero miramos que la respuesta http es valida, que no ha salido el tipico 404 not found por ejemplo
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    //como ha ido bien recupiramos los datos en formato json, usamos await para que se espere a que se resuelva la promesa
    const data = await response.json();

    //muestro en consola solo para pruebas
    //console.log(data);

    return data;
  } catch (error) {
    console.error("Error al obtener el Pokemon: ", error.message);
  }
}

function searchPokemon(id) {
  //usamos .then y .catch porque getPokemon nos devuelve una promesa y asi capturamos cuando hay eror y cuando no lo hay
  getPokemon(id)
    .then((data) => {
      console.log("pokemon obtenido corretamente");
      printPokemon(data);
    })
    .catch((error) => {
      console.log("error al recuperar pokemon " + error);
      alert("Nombre o id de Pokemon no válido")
    });
}

function printPokemon(data) {
  // Seleccionamos del dom el div con id="resultado" donde queremos mostrar los datos de los pokemon
  const container = document.getElementById("resultado");
  const cardPokemon = document.createElement("cardPoke");
  // Limpiamos cualquier nuestro div por si antes se habia realizado otr busqueda y así dejarlo en blanco antes de añadirle los datos
  //container.innerHTML = '';

  // Crear un elemento en este caso un H3 con el nombre del Pokeemon
  const namePokemon = document.createElement("h3");
  namePokemon.textContent = `${data.name}`;
  cardPokemon.appendChild(namePokemon);

  // Creamos una elemento de imagen para la imagen del Pokemon
  const imagePokemon = document.createElement("img");
  imagePokemon.src = data.sprites.front_default;
  cardPokemon.appendChild(imagePokemon);

  // Mostramos la altura y peso del Pokemon
  const measurePokemon = document.createElement("p");
  measurePokemon.innerHTML = `Altura: ${data.height / 10} m<br>Peso: ${data.weight / 10} kg`;
  cardPokemon.appendChild(measurePokemon);

  // Mostrar habilidades del Pokémon, como son varias, con map creamos nuevo array mapeando abilities y tomando el nombre de cada habilidad y con join unidos esos valores en una cadena seprada por comas
  const abilitiesPokemon = document.createElement("p");
  abilitiesPokemon.innerHTML = `<br><br>Habilidades:<br><br>${data.abilities
    .map((ability) => ability.ability.name)
    .join("<br>")}`;
  cardPokemon.appendChild(abilitiesPokemon);

  //añadimos una clase al elemento cardPokemon para poder darle estilos
  cardPokemon.classList.add("cardPokemon");

  //añadimos ficha del pokemon al contenedor donde se muestran los resultados
  container.appendChild(cardPokemon);
}

// Método de inicialización
function init() {
  // Seleccionamos elementos del DOM por su ID
  const searchBtn = document.getElementById("searchBtn");
  const resetBtn = document.getElementById("resetBtn");
  const randomBtn = document.getElementById("randomBtn");
  const resultado = document.getElementById("resultado");

  // agregamos los eventos de cada botón

  // Agregamos un evento de clic al botón para buscar pokemons
  searchBtn.addEventListener("click", () => {
    // Limpiamos el resultado anterior
    resultado.innerHTML = "";

    //recuperamos los valores introducimos que luego vamos a buscar
    const namePoke = document.getElementById("namePoke").value;
    //como puede ser uno o varios y sabemos que estan seprarados por comas o un punto o un espacio limpiamos los datos, usamos una expresion regular para esto
    const pokemons = namePoke.split(/[,.\s]+/);

    //comprobamos que no se deje el espacio vacio, al menos tenemos que escribir un pokemon
    if (pokemons.length > 0 && pokemons[0] != "") {
      pokemons.forEach((pokemonId) => {
        searchPokemon(pokemonId); // Llamar a la función para buscar uno a uno cada pokemon e imprimirlo en pntalla
      });
    } else {
      console.error("Por favor ingresa al menos un Pokémon.");
      alert("debes introducir al menos un nombre de pokemon");
    }
  });

  // Agregamos un evento de clic al botón para limiar los datos
  resetBtn.addEventListener("click", () => {
    // Limpiamos los resultados anteriores
    resultado.innerHTML = "";
  });

  // Agregamos evento clic al botón para buscar pokemon de forma aleatoria
  randomBtn.addEventListener("click", () => {
    // Limpiamos el resultado anterior
    resultado.innerHTML = "";

    const maxId = 898; //el total de pokemos que existen
    const ids = new Set(); // Usamos un Set, es decir un conjunto, para evitar pokemons duplicados
    //queremos 4 pokemons al azar
    while (ids.size < 4) {
      // Generaramos un ID aleatorio entre 1 y 898 y le sumamos 1 para que que el resultado sea entre 1 y 898 evitando el cero
      const randomId = Math.floor(Math.random() * maxId) + 1;
      ids.add(randomId); // Agregamos el ID al conunto(si ya existe no se añade)
    }
    // Convertir el Set a un array y lo recorremos para buscar e imprimir la información de los pokemons
    const pokemons = [...ids];
    if (pokemons.length > 0 && pokemons[0] != "") {
      pokemons.forEach((pokemonId) => {
        searchPokemon(pokemonId); // Llamar a la función para buscar uno a uno cada pokemon e imprimirlo en pntalla
      });
    }
  });
}

// Llamamos al método init() cuando el DOM esté  cargado
document.addEventListener("DOMContentLoaded", init);
