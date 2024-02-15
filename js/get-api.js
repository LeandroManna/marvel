// Clase para interactuar con la API de Marvel
class MarvelAPI {
    constructor(apikey) {
        this.apikey = apikey;
        this.baseUrl = 'https://gateway.marvel.com/v1/public';
    }

    async getCharacters(offset = 0, limit = 20) {
        const ts = 1; // timestamp fijo para esta solicitud de ejemplo
        const hash = '70fa8da3449c16d8b6f50d5de1de5cda'; // hash fijo para esta solicitud de ejemplo
        const url = `${this.baseUrl}/characters?apikey=${this.apikey}&ts=${ts}&hash=${hash}&offset=${offset}&limit=${limit}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch characters');
            }
            const data = await response.json();
            return data.data.results;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }
}

// Lista global de personajes mostrados
let displayedCharacters = [];

// Función para mostrar los personajes en la página
function displayCharacters(characters) {
    const characterList = document.getElementById('character-list');

    characters.forEach(character => {
        const name = character.name;
        if (!displayedCharacters.includes(name)) {
            displayedCharacters.push(name); // Agregar el nombre a la lista global
            const image = `${character.thumbnail.path}.${character.thumbnail.extension}`;
            const listItem = document.createElement('div');
            listItem.classList.add('col-md-3', 'mb-4');
            listItem.innerHTML = `
                <div class="card h-100 mb-4" data-bs-toggle="modal" data-bs-target="#characterModal-${character.id}">
                    <img src="${image}" class="card-img-top w-100" alt="${name}" data-bs-toggle="modal" data-bs-target="#characterModal-${character.id}">
                    <div class="card-body">
                        <h5 class="title">${name}</h5>
                    </div>
                </div>
            `;
            characterList.appendChild(listItem);

            // Modal content
            const modal = `
            <div class="modal fade" id="characterModal-${character.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${name}</h5>
                            <div class="close-container">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                        </div>
                        <div class="modal-body">
                            <img src="${image}" class="img-fluid" alt="${name}">
                            <p><strong>Descripción:</strong> ${character.description}</p>
                            <p><strong>Comics:</strong> ${character.comics.available}</p>
                            <p><strong>Series:</strong> ${character.series.available}</p>
                            <p><strong>Modified:</strong> ${new Date(character.modified).toISOString().slice(0, 10)}</p>
                
                            <!-- Puedes agregar más información del personaje aquí -->
                        </div>
                        <div class="modal-footer">
                            <a href="${character.urls.find(url => url.type === 'comiclink').url}" target="_blank" class="btn btn-primary">Ver más</a>
                        </div>
                    </div>
                </div>
            </div>
            `;

            // Append modal to body
            document.body.insertAdjacentHTML('beforeend', modal);
        }
    });

    // Eliminar el botón "Cargar más" si está presente
    removeLoadMoreButton();

    // Agregar el botón para cargar más personajes si hay más disponibles
    const loadMoreButton = document.createElement('button');
    loadMoreButton.classList.add('btn', 'btn-primary', 'mt-4', 'load-more-button');
    loadMoreButton.innerText = 'Cargar más';
    loadMoreButton.addEventListener('click', async () => {
        const apikey = 'd1a4b5799674017b19611509530f0707';
        const api = new MarvelAPI(apikey);
        const offset = displayedCharacters.length;
        const newCharacters = await api.getCharacters(offset);
        if (newCharacters.length === 0) {
            alert('No hay más personajes para mostrar.');
        } else {
            displayCharacters(newCharacters);
        }
    });
    characterList.appendChild(loadMoreButton);
}



// Función para eliminar el botón "Cargar más" si está presente
function removeLoadMoreButton() {
    const loadMoreButtons = document.getElementsByClassName('load-more-button');
    for (let button of loadMoreButtons) {
        button.remove();
    }
}

// Función principal
async function main() {
    const apikey = 'd1a4b5799674017b19611509530f0707'; // Clave pública proporcionada
    const api = new MarvelAPI(apikey);
    const characters = await api.getCharacters();
    displayCharacters(characters);
}

// Ejecutar la función principal cuando se cargue la página
document.addEventListener('DOMContentLoaded', main);
