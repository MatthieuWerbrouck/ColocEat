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
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#menu-table tbody');
    const historyTableBody = document.querySelector('#history-table tbody');
    const menuForm = document.getElementById('menu-form');
    const settingsForm = document.getElementById('settings-form');
    const modal = document.getElementById('menu-modal');
    const settingsModal = document.getElementById('settings-modal');
    const openModalBtn = document.getElementById('open-modal');
    const openSettingsModalBtn = document.getElementById('open-settings-modal');
    const closeModalBtns = document.querySelectorAll('.close');

    // Charger les menus existants
    const storedMenus = JSON.parse(localStorage.getItem('menus')) || [];
    const currentWeekMenus = filterCurrentWeekMenus(storedMenus);
    currentWeekMenus.forEach(menu => {
        addMenuToTable(menu, tableBody);
    });
    storedMenus.forEach(menu => {
        addMenuToTable(menu, historyTableBody);
    });

    fetch('data/menus.json')
        .then(response => response.json())
        .then(data => {
            const currentWeekMenus = filterCurrentWeekMenus(data.menus);
            currentWeekMenus.forEach(menu => {
                addMenuToTable(menu, tableBody);
            });
            data.menus.forEach(menu => {
                addMenuToTable(menu, historyTableBody);
            });
        })
        .catch(error => console.error('Error fetching menus:', error));

    // Appliquer le thème sélectionné
    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-mode', theme === 'dark');

    // Ouvrir la modale pour ajouter un menu
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Ouvrir la modale des paramètres
    openSettingsModalBtn.addEventListener('click', () => {
        settingsModal.style.display = 'block';
        const storageMethod = localStorage.getItem('storageMethod') || 'local';
        document.getElementById('storage').value = storageMethod;
        document.getElementById('theme').value = theme;
    });

    // Fermer les modales
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
            settingsModal.style.display = 'none';
        });
    });

    // Fermer les modales en cliquant en dehors de celles-ci
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
        if (event.target == settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Ajouter un nouveau menu
    menuForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const date = document.getElementById('date').value;
        const menu = document.getElementById('menu').value;
        const storageMethod = localStorage.getItem('storageMethod') || 'local';

        const newMenu = { date, menu };
        if (isCurrentWeek(newMenu.date)) {
            addMenuToTable(newMenu, tableBody);
        }
        addMenuToTable(newMenu, historyTableBody);

        if (storageMethod === 'local') {
            saveMenuToLocal(newMenu);
        } else if (storageMethod === 'json') {
            saveMenuToJson(newMenu);
        }

        modal.style.display = 'none';
    });

    // Enregistrer les paramètres
    settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const storageMethod = document.getElementById('storage').value;
        const theme = document.getElementById('theme').value;
        localStorage.setItem('storageMethod', storageMethod);
        localStorage.setItem('theme', theme);
        document.body.classList.toggle('dark-mode', theme === 'dark');
        settingsModal.style.display = 'none';
    });

    function addMenuToTable(menu, tableBody) {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const menuCell = document.createElement('td');

        dateCell.textContent = menu.date;
        menuCell.textContent = menu.menu;

        row.appendChild(dateCell);
        row.appendChild(menuCell);
        tableBody.appendChild(row);
    }

    function saveMenuToLocal(menu) {
        const menus = JSON.parse(localStorage.getItem('menus')) || [];
        menus.push(menu);
        localStorage.setItem('menus', JSON.stringify(menus));
    }

    function saveMenuToJson(menu) {
        fetch('data/menus.json')
            .then(response => response.json())
            .then(data => {
                data.menus.push(menu);
                return fetch('data/menus.json', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            })
            .catch(error => console.error('Error saving menu:', error));
    }

    function filterCurrentWeekMenus(menus) {
        const currentWeekMenus = menus.filter(menu => isCurrentWeek(menu.date));
        return currentWeekMenus;
    }

    function isCurrentWeek(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 7));
        return date >= startOfWeek && date <= endOfWeek;
    }

    window.showTab = function(tabId) {
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            tab.style.display = 'none';
        });
        document.getElementById(tabId).style.display = 'block';
    };

    // Afficher l'onglet de la semaine en cours par défaut
    showTab('current-week');
});