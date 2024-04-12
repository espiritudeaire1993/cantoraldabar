function showMenuNav() {
    nav = document.getElementById('topnav');
    if (nav.className === 'topnav') {
        nav.className += ' responsive'
    } else {
        nav.className = 'topnav'
    }
}



// document.getElementById('form_general_search').addEventListener('focusin', () => {
//     let element = document.getElementById('container_modal_searching');
//     element.classList.add('on');
//     console.log(document.activeElement);
// });

// document.getElementById('form_general_search').addEventListener('focusout', () => {
//     console.log("blur");
//     let element = document.getElementById('container_modal_searching');
//     element.classList.remove('on');
//     console.log(document.activeElement);
    
// });
