/*
  maneja la interactividad del usuario
  - Alterna vistas Login/Registro.
  - Guarda el JWT recibido en el localStorage al iniciar sesión.
  - Al cargar o actualizar las tareas, adjunta el JWT en el Header 'Authorization'.
  - Si el token expira o el usuario da clic en "Cerrar sesión", limpia el localStorage y lo regresa al login.
*/

const API_URL = 'http://localhost:3000/api'; // mi puerto

// elementos
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard-container');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authBtn = document.getElementById('auth-btn');
const toggleAuth = document.getElementById('toggle-auth');
const authActionText = document.getElementById('auth-action-text');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const logoutBtn = document.getElementById('logout-btn');

let isLoginMode = true;

// verifica si ya hay sesión activa al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        showDashboard();
    }
});

// intercambia entre Login y Registro
toggleAuth.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
        authTitle.innerText = 'Iniciar Sesión';
        authBtn.innerText = 'Ingresar';
        authActionText.innerText = 'Regístrate aquí';
    } else {
        authTitle.innerText = 'Registro de Usuario';
        authBtn.innerText = 'Registrar';
        authActionText.innerText = 'Inicia sesión aquí';
    }
    authForm.reset();
});

// envia Formulario de Auth (Login o Registro)
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    
    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || 'Ocurrió un error');
            return;
        }

        if (isLoginMode) {
            // guarda token y saltar al dashboard
            localStorage.setItem('token', data.token);
            showDashboard();
        } else {
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            toggleAuth.click(); // cambia a modo login automáticamente
        }
    } catch (err) {
        console.error(err);
        alert('Error al conectar con el servidor');
    }
});

// muestra Dashboard y Carga Tareas
function showDashboard() {
    authContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
    loadTasks();
}

async function loadTasks() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/tasks`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
            // Token expirado o inválido
            logout();
            return;
        }

        const tasks = await res.json();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.titulo;
            taskList.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
}

// crear Nueva Tarea
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = taskInput.value;
    const token = localStorage.getItem('token');

    try {
        const res = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ titulo })
        });

        if (res.ok) {
            taskInput.value = '';
            loadTasks(); // Recargar la lista
        } else {
            const data = await res.json();
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
    }
});

// para cerrar sesión
logoutBtn.addEventListener('click', logout);

function logout() {
    localStorage.removeItem('token');
    dashboardContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
    authForm.reset();
}