
const button_menu_actions = document.getElementsByClassName('button_menu_actions')[0]
const button_back = document.getElementsByClassName('button_back')[0]
const button_menu_changes = document.getElementsByClassName('button_menu_changes')[0]
const botones_cambios_cancion = document.getElementsByClassName('botones_cambios_cancion')[0]
const button_add_to_list = document.getElementsByClassName('button_add_to_list')[0]

const button_menu_updates = document.getElementsByClassName('button_menu_updates')[0]
const actions_songs = document.getElementsByClassName('actions_songs')[0]

let nivelMenu = 1;
let switchMenu = false;

// let user_name = document.documentElement.getAttribute('data-user-name');
// let level = document.documentElement.getAttribute('data-user-level');


function setToggle(element, className) {
    element.classList.toggle(className);
}

function activarDisplay(element, display = 'block') {
    element.style.display = display
    if (display === 'flex') element.style.flexDirection = 'column'
}

function desactivarDisplay(element) {
    element.style.display = 'none'
}

function openMenu() {
    if (!switchMenu) {
        activarDisplay(button_menu_changes)
        if (level == 1 || level == 2) {
            activarDisplay(button_menu_updates)
            activarDisplay(button_add_to_list)
        }
        switchMenu = true
    } else {
        switchMenu = false;
        desactivarDisplay(button_menu_changes)
        if (level == 1 || level == 2) {
            desactivarDisplay(button_add_to_list)
            desactivarDisplay(button_menu_updates)
        }
    }
}

function openMenuChanges() {
    if (level == 1 || level == 2) {
        desactivarDisplay(button_menu_updates)
        desactivarDisplay(button_add_to_list)
    }

    desactivarDisplay(button_menu_actions)
    desactivarDisplay(button_menu_changes)
    activarDisplay(button_back)
    activarDisplay(botones_cambios_cancion, 'flex')
}

function openActionsSong() {
    if (level == 1 || level == 2) {
        desactivarDisplay(button_menu_updates)
        activarDisplay(actions_songs, 'flex')
    }
    desactivarDisplay(button_menu_actions)

    desactivarDisplay(button_menu_changes)

    activarDisplay(button_back)
    
}

function back() {
    desactivarDisplay(button_back)
    desactivarDisplay(botones_cambios_cancion)
    activarDisplay(button_menu_actions)
    activarDisplay(button_menu_changes)
    
    if (level == 1 || level == 2) {
        desactivarDisplay(actions_songs)
        activarDisplay(button_add_to_list)
        
        
        activarDisplay(button_menu_updates)
    }
}