const ID_SONG = document.getElementById('infoSongToUpdate').getAttribute('info');
const TYPE_FUNCTION = document.getElementById('type-function').getAttribute('type-function');

let input_composer = document.getElementById('input_composer');
let container = document.getElementById('container_composers');
let btnCrear_Modificar = document.getElementById('btn_crear_modificar');
let btnYes = document.getElementById('btn_yes');
let btnNo = document.getElementById('btn_no');
let checks = document.getElementsByClassName('checkbox_tag');

let seleccion_composer = false;

function verificarCamposRequeridos() {
    let value_input_title = document.getElementById('input_name_song');
    let value_input_lyric = document.getElementById('input_lyric');
    let container_tags = document.getElementById('container_tags');
    let tags = verificarChecked();
    if ((!isEmpty(value_input_title.value) && (!isEmpty(value_input_lyric.value)) && (tags.length > 0))) {
        return true;
    }
    value_input_title.className += ' required';
    value_input_lyric.className +=  ' required';
    container_tags.className += ' required';
    return false;
}


btnCrear_Modificar.onclick = function () {
    if (verificarCamposRequeridos()) {
        document.getElementById('container_validacion_modal').style.display = 'block';
    }
}

btnYes.onclick = async function () {
    let value_input_title = document.getElementById('input_name_song').value.toUpperCase();
    let value_input_composer = document.getElementById('input_composer').value.toUpperCase();
    let value_input_lyric = document.getElementById('input_lyric').value;
    let composerId = await verificarComposer(value_input_composer);
    let tags = verificarChecked();

    let resultado_save_update_song = await guardarModificarCanto(value_input_title, composerId, value_input_lyric, tags);

    document.getElementById('container_validacion_modal').style.display = 'none';
    location.href = '/api/getSong?id=' + resultado_save_update_song.resultado._id;
}

btnNo.onclick = function () {
    document.getElementById('container_validacion_modal').style.display = 'none';
}

input_composer.addEventListener('input', async (entrada) => {
    let searching = entrada.srcElement.value;
    let display = 'none'

    container.getElementsByTagName('table')[0].innerHTML = '';

    if (!isEmpty(searching)) {
        const response = await fetch('/api/getComposersByName?name=' + searching, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        let respuesta = await response.json();
        let composers = respuesta.composers;

        if (composers.length > 0) {
            container.getElementsByTagName('table')[0].innerHTML = '';
            composers.forEach(element => {
                let div = crearElemento('tr', element.name, 'composer_selector');
                div.addEventListener('click', (evento) => {
                    input_composer.value = div.innerText;
                    input_composer.setAttribute('composerId', element._id);
                    container.getElementsByTagName('table')[0].innerHTML = '';
                    container.style.display = 'none'
                    seleccion_composer = true;
                });
                container.getElementsByTagName('table')[0].appendChild(div);
                display = 'block'
                input_composer.setAttribute('composerId', searching);
                seleccion_composer = false;
            });
        } else {
            display = 'none'
        }
    } else {
        display = 'none'
    }
    container.style.display = display
});


function getURL() {
    switch (TYPE_FUNCTION) {
        case "1":
            return '/api/guardar_canto';
        case "2":
            return '/api/modificar_song';
    }
}

function getMethod() {
    switch (TYPE_FUNCTION) {
        case "1":
            return 'POST';
        case "2":
            return 'PUT';
    }
}

async function guardarModificarCanto(name, composerId, lyric, tags) {
    let response;
    let _id = TYPE_FUNCTION == '1' ? 1 : ID_SONG;
    response = await fetch(getURL(), {
        method: getMethod(),
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            _id,
            name,
            lyric,
            composerId,
            tags
        })
    });
    return await response.json();
}

async function verificarComposer(nameComposer) {
    //let nameComposer = nameComposer;
    let response;
    let composerRespuesta;

    if (isEmpty(nameComposer)) {
        nameComposer = 'DESCONOCIDO';
    }

    response = await fetch('/api/getOneComposerByName?name=' + nameComposer, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });


    composerRespuesta = await response.json();
    if (composerRespuesta.compositor === null) {
        response = await fetch('/api/save_composer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name_composer: nameComposer
            })
        });
        composerRespuesta = await response.json();
    }
    return composerRespuesta.compositor._id;

}

function crearElemento(tipo, value = '', nameClass = '', id = '') {
    let elemento = document.createElement(tipo);
    elemento.nameClass = nameClass;
    elemento.innerText = value;
    return elemento
}

function isEmpty(value) {
    return value === "" ? true : false
}

function convertirPrimerasLetrasMayusculas(texto) {
    texto = texto.toLowerCase();
    return texto.replace(/\b\w/g, l => l.toUpperCase());
}

function verificarChecked() {
    let checks = document.getElementsByClassName('checkbox_tag');
    let tags = [];
    for (let index = 0; index < checks.length; index++) {
        const element = checks[index];
        if (element.checked) tags.push(element.value);
    }
    return tags;
}