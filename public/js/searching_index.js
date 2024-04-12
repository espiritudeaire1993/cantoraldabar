let ulListSongs = document.getElementById('song_list_modal_search');
let ulListComposers = document.getElementById('composer_list_modal_search');
let container_modal = document.getElementById('container_modal_searching');



document.getElementById('input_general_search').addEventListener('input', async (entrada) => {
    //console.log(entrada.srcElement.value); 
    let searching = entrada.srcElement.value;
    limpiarListas()
    document.getElementById('searching_input_text').innerText = 'Todas las coincidencias de ' + searching;
    if (!isEmpty(searching)) {
        const response = await fetch('/api/general_search_limit?general_search=' + searching, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        let busqueda = await response.json();
        limpiarListas()
        let songs = busqueda.songs;
        let composers = busqueda.composers;

        llenarListaCanciones(songs);
        llenarListaCompositores(composers);

    } 

});

function llenarListaCanciones(songs){
    songs.forEach(song => {
        ulListSongs.appendChild(elementoListaSong(song));
    });
}
function llenarListaCompositores(composers){
    composers.forEach(composer => {
        ulListComposers.appendChild(elementoListaComposer(composer));
    });
}

function limpiarListas() {
    ulListSongs.innerHTML = '';
    ulListComposers.innerHTML = '';
}

function elementoListaSong(song) {
    let element = document.createElement('li');
    element.innerHTML = `<a href='/api/getSong?id=${song._id}'><span class="material-symbols-outlined">import_contacts</span>${song.name}</a>`
    return element;
}

function elementoListaComposer(composer) {
    let element = document.createElement('li');
    element.innerHTML = `<a href='/api/cancionesde?composerId=${composer._id}'><span class="material-symbols-outlined">face</span>${composer.name}</a>`
    return element;
}

function isEmpty(value) {
    return value === "" ? true : false;
}