

let user_name;
let level;
let _id_song;
let allListsOfUser;
const main_section = document.getElementById('main_section');
const contenedor_modal = document.getElementById('container_modal');
const container_lists_all_lists = document.getElementById('container_lists_all_lists');
const input_create_new_list = document.getElementById('input_create_new_list');


document.addEventListener('DOMContentLoaded', () => {
    user_name = document.documentElement.getAttribute('data-user-name');
    level = document.documentElement.getAttribute('data-user-level');
    if (document.getElementById('container_section_canto')) {
        _id_song = document.getElementById('container_section_canto').getAttribute('data-id-song');
    }


});

function verificarChecked() {
    let checks = document.getElementsByClassName('check_lista');
    let lists = [];
    for (let index = 0; index < checks.length; index++) {
        const element = checks[index];
        if (element.checked) lists.push(element.value);
    }
    return lists;
}

async function saveSongToLists() {
    let checked_lists = verificarChecked();
    allListsOfUser.forEach(list => {
        let idIndex = list.songs.findIndex(song => song._id === _id_song);
        if (idIndex > -1) {
            if (!checked_lists.includes(list._id)) {
                list.songs.splice(idIndex, 1);
            }
        } else if (checked_lists.includes(list._id)) {
            list.songs.push(_id_song);
        }
    });

    let response = await fetch('/api/saveList', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            lists: allListsOfUser
        })
    });

    let respuesta = await response.json();
    allListsOfUser = respuesta.lists;


    contenedor_modal.style.display = 'none';
    container_lists_all_lists.innerHTML = "";

}

async function createList(tipo) {

    if (!isEmpty(input_create_new_list.value)) {
        let response = await fetch('/api/createList', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                new_list_name: input_create_new_list.value
            })
        });
        let resultado = await response.json();
        allListsOfUser = resultado.respuesta.lists;


        switch (tipo) {
            case 1: //indica que fue llamado desde canto.ejs
                agregarCheckLista(resultado._id, input_create_new_list.value, container_lists_all_lists);
                break;
            case 2://indica que fue llamado desde mis_listas.ejs
                agregarListaATabla(resultado._id, input_create_new_list.value);
                break;
        }
        input_create_new_list.value = "";
        let spanLength = document.getElementById('span_length_lists');
        spanLength.textContent = spanLength.textContent++;
    }
}

async function openModalAddList() {
    container_lists_all_lists.innerHTML = "";
    allListsOfUser = await allLists();
    allListsOfUser = allListsOfUser.allLists.lists;

    if (allListsOfUser.length > 0) {
        allListsOfUser.forEach(list => {
            agregarCheckLista(list._id, list.name, container_lists_all_lists, list.songs);
        });
    }

    contenedor_modal.style.display = 'block';
}

async function allLists() {
    let response = await fetch('/api/allLists', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let respuesta = await response.json();

    return respuesta;
}


function agregarCheckLista(_id, name, container, songs = null) {
    let checkContainer = crearElemento('div', 'container_check');
    let labelCheck = crearElemento('label', 'label_check');
    labelCheck.innerText = name;
    let check = crearElemento('input', 'check_lista');
    check.type = 'checkbox';
    check.value = _id;

    if (songs) {
        songs.forEach(song => {
            if (song._id === _id_song) {
                check.checked = true;
                return;
            }
        });
    }

    agregarAPadre(checkContainer, check, labelCheck);
    agregarAPadre(container, checkContainer);

}


function agregarListaATabla(_id, name) {
    // <a href=<%='/api/lista?idLista=' + list.id %>> <%= list.name %></a>
    let tbody = document.getElementById(`tbody_all_lists`);
    let tr = crearElemento('tr', `tr_list_${_id}`, `list_${_id}`);
    let url = `/api/lista?idLista=${_id}`;
    let tdName = crearElemento('td', 'td_list_name', `td_list_name_${_id}`, `<a href=${url}>${name}</a>`);

    let tdActions = document.createElement('td');
    let button = crearBoton('button', `button_list_${_id}`, 'delete');
    console.log(_id, name);

    tdActions.appendChild(button);
    button.addEventListener('click', e => {
        deleteList(_id);
    });
    tr.appendChild(tdName);
    tr.appendChild(tdActions);
    //juandi 55511
    tbody.appendChild(tr);
}

function crearBoton(_class, _id, icon) {
    let spanIcon = crearElemento('span', "material-symbols-outlined", '', icon);
    let boton = crearElemento('button', _class, _id);

    boton.appendChild(spanIcon);

    return boton;
}

async function deleteList(_id) {

    let response = await fetch('/api/deleteList', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idListaEliminar: _id
        })
    });

    let respuesta = await response.json();

    document.getElementById(`list_${_id}`).remove();
    let spanLength = document.getElementById('span_length_lists');
    spanLength.textContent = spanLength.textContent--;
}

function crearElemento(tipo, _class, _id, value = "") {
    let element = document.createElement(tipo);

    element.className = _class;
    element.id = _id;
    element.innerHTML = value;

    return element;
}

function agregarAPadre(padre, ...elemento) {
    elemento.forEach(e => {
        padre.appendChild(e);
        console.log(e);
    });
}

function isEmpty(value) {
    return value === "" ? true : false
}

