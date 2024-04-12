"use strict";

var INFO = document.getElementById('infoSongToUpdate').getAttribute('info');
input_composer.addEventListener('input', function _callee(entrada) {
  var searching, display, response, respuesta, composers;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //console.log(entrada.srcElement.value); 
          searching = entrada.srcElement.value;
          display = 'none';
          container.innerHTML = '';

          if (isEmpty(searching)) {
            _context.next = 14;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(fetch('/api/getComposersByName?name=' + searching, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }));

        case 6:
          response = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(response.json());

        case 9:
          respuesta = _context.sent;
          composers = respuesta.composers;

          if (composers.length > 0) {
            container.innerHTML = '';
            composers.forEach(function (element) {
              var div = crearElemento('div', element.name, 'composer_selector');
              div.addEventListener('click', function (evento) {
                input_composer.value = div.innerText;
                input_composer.setAttribute('composerId', element._id);
                container.innerHTML = '';
                container.style.display = 'none';
                seleccion_composer = true;
              });
              container.appendChild(div);
              display = 'block';
              input_composer.setAttribute('composerId', searching);
              seleccion_composer = false;
            });
          } else {
            display = 'none';
          }

          _context.next = 15;
          break;

        case 14:
          display = 'none';

        case 15:
          container.style.display = display;

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
});
var input_composer = document.getElementById('input_composer');
var seleccion_composer = false;
var container = document.getElementById('container_composers');
var btnCrear = document.getElementById('btn_crear');
var btnYes = document.getElementById('btn_yes');
var btnNo = document.getElementById('btn_no');
var checks = document.getElementsByClassName('checkbox_tag');

btnCrear.onclick = function () {
  var value_input_title = document.getElementById('input_name_song');
  var value_input_lyric = document.getElementById('input_lyric');

  if (!(isEmpty(value_input_title.value) && isEmpty(value_input_lyric.value))) {
    document.getElementById('container_validacion_modal').style.display = 'block';
  }
};

btnYes.onclick = function _callee2() {
  var value_input_title, value_input_composer, value_input_lyric, tags, composerRespuesta, response, nameComposer, composerId, resultado_save_song;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          value_input_title = document.getElementById('input_name_song').value.toUpperCase();
          value_input_composer = document.getElementById('input_composer').value;
          value_input_lyric = document.getElementById('input_lyric').value;
          tags = verificarChecked();
          nameComposer = convertirPrimerasLetrasMayusculas(value_input_composer);

          if (isEmpty(value_input_composer)) {
            nameComposer = 'unknown';
          }

          _context2.next = 8;
          return regeneratorRuntime.awrap(fetch('/api/getOneComposerByName?name=' + nameComposer, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }));

        case 8:
          response = _context2.sent;
          _context2.next = 11;
          return regeneratorRuntime.awrap(response.json());

        case 11:
          composerRespuesta = _context2.sent;

          if (!(composerRespuesta.compositor === null)) {
            _context2.next = 19;
            break;
          }

          _context2.next = 15;
          return regeneratorRuntime.awrap(fetch('/api/save_composer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name_composer: nameComposer
            })
          }));

        case 15:
          response = _context2.sent;
          _context2.next = 18;
          return regeneratorRuntime.awrap(response.json());

        case 18:
          composerRespuesta = _context2.sent;

        case 19:
          composerId = composerRespuesta.compositor._id;
          _context2.next = 22;
          return regeneratorRuntime.awrap(fetch('/api/guardar_canto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: value_input_title,
              lyric: value_input_lyric,
              composerId: composerId,
              tags: tags
            })
          }));

        case 22:
          response = _context2.sent;
          _context2.next = 25;
          return regeneratorRuntime.awrap(response.json());

        case 25:
          resultado_save_song = _context2.sent;
          console.log(resultado_save_song);
          document.getElementById('container_validacion_modal').style.display = 'none'; //response = await fetch('/api/aportar_canto');
          //await response.

        case 28:
        case "end":
          return _context2.stop();
      }
    }
  });
};

btnNo.onclick = function () {
  document.getElementById('container_validacion_modal').style.display = 'none';
};

function crearElemento(tipo) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var nameClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var elemento = document.createElement(tipo);
  elemento.nameClass = nameClass;
  elemento.innerText = value;
  return elemento;
}

function isEmpty(value) {
  return value === "" ? true : false;
}

function convertirPrimerasLetrasMayusculas(texto) {
  texto = texto.toLowerCase();
  return texto.replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
}

function verificarChecked() {
  var checks = document.getElementsByClassName('checkbox_tag');
  var tags = [];

  for (var index = 0; index < checks.length; index++) {
    var element = checks[index];
    if (element.checked) tags.push(element.value);
  }

  return tags;
}