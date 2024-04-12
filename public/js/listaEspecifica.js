

let input_busqueda_opciones_agregar = document.getElementById('input_busqueda_opciones_agregar');
let container_busqueda_opciones_agregar = document.getElementById('container_busqueda_opciones_agregar');
let tabla_busqueda_opciones_agregar = document.getElementById('tabla_busqueda_opciones_agregar');
let tbody_songs_list = document.getElementById('tbody_songs_list');
let idLista = document.getElementById('id_lista').getAttribute('data-id-lista');
container_busqueda_opciones_agregar.style.display = 'none';

input_busqueda_opciones_agregar.addEventListener('input', async e => {
    tabla_busqueda_opciones_agregar.innerHTML = '';
    let busqueda = e.srcElement.value;
    let display = 'none';
    if (!isEmpty(busqueda)) {
        display = ' block';
        //console.log(busqueda);
        let res = await fetch(`/api/busqueda_para_lista?busqueda=${busqueda}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let respuesta = await res.json();
        let songs = respuesta.songs;
        tabla_busqueda_opciones_agregar.innerHTML = '';
        songs.forEach(song => {
            let tr = crearElemento('tr', 'tr_Song_Add_to_List', 'tr_Song' + song._id);
            let tdSong = crearElemento('td', 'td_Song', 'td_Song_' + song._id, song.name);
            let tdAdd = crearElemento('td', 'td_Add', 'td_Add_' + song._id, '', getNameIcon(song._id));
            tr.appendChild(tdSong);
            tr.appendChild(tdAdd);
            tr.addEventListener('click', e => {
                let spanIcon = tr.getElementsByTagName('span')[0]
                let isChecked = spanIcon.classList.contains('checked');
                if (isChecked) {
                    spanIcon.innerText = 'check_box_outline_blank'
                    removeSongFromList(song._id)
                } else {
                    spanIcon.innerText = 'check_box'
                    addSongToList(song._id, song.name);
                }
                spanIcon.classList.toggle('checked');

            });
            tabla_busqueda_opciones_agregar.appendChild(tr);
        });
    } else {
        tabla_busqueda_opciones_agregar.innerHTML = '';
    }
    container_busqueda_opciones_agregar.style.display = display
});



async function addSongToList(_id, name) {

    let tr = crearElemento('tr', '', _id);
    let tdSong = crearElemento('td', 'td_songs_on_list');
    let tdRemove = crearElemento();

    let aSong = crearElemento('a', '', '', name);
    aSong.href = `/api/getSong?id=${_id}&lista=true&idLista=${idLista}`;

    let aRemove = crearElemento('a', '', '', '', 'remove');

    tdSong.appendChild(aSong);
    tdRemove.appendChild(aRemove);
    tr.appendChild(tdSong);
    tr.appendChild(tdRemove);

    tbody_songs_list.appendChild(tr);

    let res = await fetch('/api/saveSongToList',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idSong: _id,
                idLista
            })
        });
    let resultado = await res.json();
    console.log(resultado);

}

async function removeSongFromList(idSong) {
    let fila = document.getElementById(`${idSong}`);
    fila.remove();

    let res = await fetch('/api/removeSongFromList',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idSong,
                idLista
            })
        });
    let resultado = await res.json();
    console.log(resultado);
}

function getNameIcon(idSong) {
    let arrayOfIds = getIdFromSongs();
    if (arrayOfIds.indexOf(idSong) > -1) {
        return 'check_box'
    }
    return 'check_box_outline_blank'
}

function getIdFromSongs() {
    let trs = document.getElementsByClassName('tr_songs_on_list');
    let arrayOfIds = [];
    for (const e of trs) {
        arrayOfIds.push(e.id);
    }
    //console.log(arrayOfIds);
    return arrayOfIds;

}

function crearElemento(tipo, _class = '', _id = '', value = '', icon = null) {
    let elemento = document.createElement(tipo);

    elemento.className = _class;
    elemento.id = _id;
    elemento.innerHTML = value;
    if (icon) {
        let spanIcon = document.createElement('span');

        spanIcon.className = 'material-symbols-outlined add_to_list';
        spanIcon.innerText = icon;
        if (icon === 'check_box') {
            spanIcon.classList.add('checked');
        }

        elemento.appendChild(spanIcon);
    }
    return elemento;
}

function isEmpty(value) {
    return value === "" ? true : false
}