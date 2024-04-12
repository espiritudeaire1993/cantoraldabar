
let _LEVEL;
let _USER_NAME;
//console.log("entro");

document.addEventListener('DOMContentLoaded', () => {
    _USER_NAME = document.documentElement.getAttribute('data-user-name');
    _LEVEL = document.documentElement.getAttribute('data-user-level');
    //console.log(user_name,level);
});