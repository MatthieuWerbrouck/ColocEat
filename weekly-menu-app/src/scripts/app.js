// Fichier contenant la logique JavaScript de l'application pour gérer les menus de la semaine

const menuForm = document.getElementById('menu-form');
const menuList = document.getElementById('menu-list');

// Charger les menus depuis le fichier JSON
function loadMenus() {
    fetch('./data/menus.json')
        .then(response => response.json())
        .then(data => displayMenus(data))
        .catch(error => console.error('Erreur lors du chargement des menus:', error));
}

// Afficher les menus dans la liste
function displayMenus(menus) {
    menuList.innerHTML = '';
    menus.forEach(menu => {
        const menuItem = document.createElement('li');
        menuItem.textContent = `${menu.jour}: ${menu.plat} - ${menu.description}`;
        menuList.appendChild(menuItem);
    });
}

// Sauvegarder un nouveau menu
function saveMenu(event) {
    event.preventDefault();
    const jour = event.target.jour.value;
    const plat = event.target.plat.value;
    const description = event.target.description.value;

    const newMenu = { jour, plat, description };
    
    // Ici, vous devriez ajouter la logique pour sauvegarder le menu dans le fichier JSON
    // Cela nécessiterait un backend pour gérer l'écriture dans le fichier

    // Réinitialiser le formulaire
    menuForm.reset();
    loadMenus(); // Recharger les menus après ajout
}

// Événements
menuForm.addEventListener('submit', saveMenu);
document.addEventListener('DOMContentLoaded', loadMenus);