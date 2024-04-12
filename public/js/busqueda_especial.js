
function showDeleteOptions(id) {
    let divDeleteOptions = document.getElementById('options_delete_songs_' + id);
    let divActionsSong = document.getElementById('actions_songs_' + id);
    divDeleteOptions.style.display = 'block';
    divActionsSong.style.display = 'none';

}

function hideDeleteOptions(id) {
    let divDeleteOptions = document.getElementById('options_delete_songs_' + id);
    let divActionsSong = document.getElementById('actions_songs_' + id);
    divDeleteOptions.style.display = 'none';
    divActionsSong.style.display = 'block';
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
    console.log(result);
    location.href = '/api/busqueda_especial?limit=20&pag=1'
}