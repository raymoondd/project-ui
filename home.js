// --- State Management ---
let tasks = JSON.parse(localStorage.getItem('routineTasks')) || [];
let pomodoroTimer;
let timeLeft = 0 * 0; // 25 minutes in seconds
let isWorking = true;
let isTimerRunning = false;
let notifiedTasks = new Set();

// --- DOM Elements ---
const timeEl = document.getElementById('current-time');
const dateEl = document.getElementById('current-date');
const taskForm = document.getElementById('task-form');
const timelineContainer = document.getElementById('timeline-container');
const progressBar = document.getElementById('progress-bar');
const taskFraction = document.getElementById('task-fraction');
const themeToggle = document.getElementById('theme-toggle');

const timerDisplay = document.getElementById('timer-display');
const timerStatus = document.getElementById('timer-status');
const startBtn = document.getElementById('timer-start');
const pauseBtn = document.getElementById('timer-pause');
const resetBtn = document.getElementById('timer-reset');

// --- Initialization ---
function init() {
    updateClock();
    setInterval(updateClock, 1000);
    setInterval(checkActiveTasks, 60000); // Check active tasks every minute
    
    // Load theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    renderTasks();
    updateProgress();
}

// --- Dashboard Clock ---
function updateClock() {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString([], { hour12: true });
    dateEl.textContent = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// --- Theme Toggle ---
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// --- Toast Notification System ---
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    
    // Play a basic system beep (using Web Audio API)
    playBeep();

    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function playBeep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime); // A4 note
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
}

// --- Task Management ---
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newTask = {
        id: Date.now().toString(),
        title: document.getElementById('task-title').value,
        desc: document.getElementById('task-desc').value,
        startTime: document.getElementById('start-time').value,
        endTime: document.getElementById('end-time').value,
        category: document.getElementById('task-category').value,
        completed: false
    };

    tasks.push(newTask);
    saveAndRender();
    taskForm.reset();
    showToast(`Task added: ${newTask.title}`);
});

function toggleTaskComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveAndRender();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('routineTasks', JSON.stringify(tasks));
    renderTasks();
    updateProgress();
}

// --- Timeline Rendering & Logic ---
function renderTasks() {
    timelineContainer.innerHTML = '';
    
    // Sort tasks by start time
    const sortedTasks = [...tasks].sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (sortedTasks.length === 0) {
        timelineContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No tasks scheduled for today.</p>';
        return;
    }

    const now = new Date();
    const currentTimeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    sortedTasks.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Check if active
        if (!task.completed && currentTimeStr >= task.startTime && currentTimeStr <= task.endTime) {
            div.classList.add('active');
        }

        div.innerHTML = `
            <div class="task-header">
                <span class="task-title">${task.title}</span>
                <span class="category-badge">${task.category}</span>
            </div>
            <div class="task-time">🕒 ${task.startTime} - ${task.endTime}</div>
            ${task.desc ? `<div class="task-desc">${task.desc}</div>` : ''}
            <div class="task-actions">
                <button class="btn ${task.completed ? 'outline' : 'primary'}" onclick="toggleTaskComplete('${task.id}')">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="btn outline" onclick="deleteTask('${task.id}')">Delete</button>
            </div>
        `;
        timelineContainer.appendChild(div);
    });
}

function updateProgress() {
    if (tasks.length === 0) {
        progressBar.style.width = '0%';
        taskFraction.textContent = '0/0 Completed';
        return;
    }
    const completed = tasks.filter(t => t.completed).length;
    const percentage = (completed / tasks.length) * 100;
    
    progressBar.style.width = `${percentage}%`;
    taskFraction.textContent = `${completed}/${tasks.length} Completed`;
}

function checkActiveTasks() {
    const now = new Date();
    const currentTimeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    tasks.forEach(task => {
        if (!task.completed && task.startTime === currentTimeStr && !notifiedTasks.has(task.id)) {
            showToast(`Time to start: ${task.title}`);
            notifiedTasks.add(task.id);
        }
    });
    
    // Re-render to update active highlight borders
    renderTasks();
}

// --- Pomodoro Timer ---
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
    document.title = `${minutes}:${seconds} - Routine Monitor`;
}

function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    
    pomodoroTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(pomodoroTimer);
            isTimerRunning = false;
            
            // Switch modes
            isWorking = !isWorking;
            timeLeft = isWorking ? 25 * 60 : 5 * 60;
            timerStatus.textContent = isWorking ? "Study Session" : "Break Time!";
            
            showToast(isWorking ? "Break is over! Time to study." : "Great job! Take a 5-minute break.");
            updateTimerDisplay();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(pomodoroTimer);
    isTimerRunning = false;
}

function resetTimer() {
    clearInterval(pomodoroTimer);
    isTimerRunning = false;
    isWorking = true;
    timeLeft = 25 * 60;
    timerStatus.textContent = "Study Session";
    updateTimerDisplay();
    document.title = "Daily Study & Routine Monitor";
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Boot app
init();
