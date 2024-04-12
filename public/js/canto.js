//document.getElementById('container_validacion_modal').style.display = 'block';
let btnDelete = document.getElementById('btn_delete');
let btnYes = document.getElementById('btn_yes');
let btnNo = document.getElementById('btn_no');

btnDelete.onclick = function () {
    document.getElementById('container_validacion_modal').style.display = 'block';
}
// btnYes.onclick = async function () {
   
//     document.getElementById('container_validacion_modal').style.display = 'none';
// }

btnNo.onclick = function () {
    document.getElementById('container_validacion_modal').style.display = 'none';
}

async function deleteSong(id) {
    let response = await fetch('/api/eliminar_song', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id
        })
    });
    let result = await response.json();
    //console.log(result);
    location.href = '/'
}

