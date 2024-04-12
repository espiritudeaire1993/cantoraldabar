let checks = document.getElementsByClassName('checkbox_tag');
let table = document.getElementById('table_filtered_songs');
let tbody = document.getElementById('tbody_table_filtered_songs');
for (let index = 0; index < checks.length; index++) {
    const element = checks[index];
    element.addEventListener('change', () => {
        filteredSearching();
    });
}

document.getElementById('title_search_input').addEventListener('input', () => {
    filteredSearching();
});

document.getElementById('composer_search_input').addEventListener('input', () => {
    filteredSearching();
});

function getUrl() {
    let checkedTags = verificarChecked();
    let titleSong = document.getElementById('title_search_input').value;
    let nameComposer = document.getElementById('composer_search_input').value;
    if (checkedTags.length === 0 && isEmpty(titleSong) && isEmpty(nameComposer)) {
        return null;
    }
    let url = `filteredSearching?`;

    url += checkedTags.length > 0 ? `tags=${checkedTags}&` : ``;
    url += !isEmpty(titleSong) ? `title=${titleSong}&` : ``;
    url += !isEmpty(nameComposer) ? `composer=${nameComposer}&` : ``;

    return url;
}

function isEmpty(value) {
    return value === "" ? true : false
}

async function filteredSearching() {
    let url = getUrl();
    if (url !== null) {
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let songs_result = await response.json();
        tbody.innerHTML = '';
        if (songs_result.songs.length > 0) {
            songs_result.songs.forEach(song => {
                let tr = document.createElement('tr');
                let td_title = crearCeldaConLink(song.name, `/api/getSong?id=${song._id}`, 'title_song', 'title_song', '<span class="material-symbols-outlined">import_contacts</span>');
                let td_composer = crearCeldaConLink(song.composerId.name, `/api/cancionesde?composerId=${song.composerId._id}`, 'composer', 'composer', '<span class="material-symbols-outlined">face</span>');
                let td_tags = crearCelda(song.tags, 'tags', 'tags', '<span class="material-symbols-outlined">tag</span>');
                tr.append(td_title, td_composer, td_tags);
                tbody.append(tr);
            });
        }
    } else {
        tbody.innerHTML = '';
    }

}

function crearCeldaConLink(contenido, url, nameClass, id, icon = '') {
    let textoHTML = `<a href=${url}>${icon + contenido}</a>`
    let td = crearCelda(textoHTML, nameClass, id);
    return td;
}

function crearCelda(contenido, nameClass, id, icon = '') {
    let td = document.createElement('td');
    td.innerHTML = icon + contenido;
    td.className = nameClass;
    td.id = id;
    return td;
}

function verificarChecked() {
    let tags = [];
    for (let index = 0; index < checks.length; index++) {
        const element = checks[index];
        if (element.checked) {
            tags.push(element.value);
        };
    }
    return tags;
}

