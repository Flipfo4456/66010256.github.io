document.addEventListener("DOMContentLoaded", loadTasks);

        function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    if (taskText === "") return;
    
    let taskList = document.getElementById("taskList");
    let li = createTaskElement(taskText, false);
    taskList.appendChild(li);

    saveTasks();
    taskInput.value = "";
}

function createTaskElement(text, completed) {
    let li = document.createElement("li");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.display = "none";
    checkbox.checked = completed;
    checkbox.onchange = function () {
        li.classList.toggle("completed", checkbox.checked);
        saveTasks();
    };
    
    let label = document.createElement("label");
    label.classList.add("check");
    label.innerHTML = `<svg viewBox="0 0 18 18" height="18px" width="18px">
        <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
        <polyline points="1 9 7 14 15 4"></polyline>
    </svg>`;
    label.htmlFor = checkbox.id = "cbx-" + Math.random().toString(36).substr(2, 9);

    let span = document.createElement("span");
    span.textContent = text;

    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`;
    deleteBtn.onclick = function () {
        li.remove();
        saveTasks();
    };

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    if (completed) li.classList.add("completed");
    return li;
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        let text = li.querySelector("span").textContent;
        let completed = li.querySelector("input").checked;
        tasks.push({ text, completed });
    });
    localStorage.setItem("Fotodo", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("Fotodo")) || [];
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach(task => {
        let li = createTaskElement(task.text, task.completed);
        taskList.appendChild(li);
    });
}
















const particles = [];
const smokeParticles = [];
const particleCount = 10;
const smokeRate = 0.05; // Smaller value for slower smoke appearance rate
let isGasLighterOn = false;

// Function to get a random color
function getRandomColor() {
    const colors = ['orange', 'yellow', 'red']; // List of possible colors
    return colors[Math.floor(Math.random() * colors.length)];
}

// Create regular moving particles
for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    document.body.appendChild(particle);

    // Set initial position randomly
    particle.x = Math.random() * window.innerWidth;
    particle.y = Math.random() * window.innerHeight;

    // Set random speed
    particle.speedX = (Math.random() - 0.5) * 2;
    particle.speedY = (Math.random() - 0.5) * 2;

    // Randomly assign a color to the particle
    particle.style.backgroundColor = getRandomColor();

    particles.push(particle);
}

// Create smoke particles with slower appearance and fade-out
function createSmokeParticle() {
    if (Math.random() < smokeRate) { // Control smoke frequency
        const smoke = document.createElement('div');
        smoke.classList.add('smoke');
        document.body.appendChild(smoke);

        // Set random initial position
        smoke.x = Math.random() * window.innerWidth;
        smoke.y = Math.random() * window.innerHeight;

        // Set random speed for smoke particles
        smoke.speedX = (Math.random() - 0.5) * 1.5;
        smoke.speedY = (Math.random() - 0.5) * 1.5;

        // Add the smoke particle to the array
        smokeParticles.push(smoke);

        // Slowly fade in
        setTimeout(() => {
            smoke.style.opacity = '1';
        }, Math.random() * 2000); // Random delay for gradual appearance

        // Make the smoke fade out after a few seconds
        setTimeout(() => {
            smoke.style.opacity = '0'; // Fade-out effect
            setTimeout(() => {
                smoke.remove(); // Remove smoke after fading out
            }, 4000); // After fading out
        }, 3000); // Fade out after it has been visible for a while
    }
}

// Function to update particle positions
function updateParticles() {
    if (isGasLighterOn) return; // Stop all particles if the checkbox is checked

    // Update regular particles
    particles.forEach(particle => {
        // Update position by speed
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Boundary check to keep particles within the screen
        if (particle.x > window.innerWidth) particle.x = 0;
        if (particle.x < 0) particle.x = window.innerWidth;
        if (particle.y > window.innerHeight) particle.y = 0;
        if (particle.y < 0) particle.y = window.innerHeight;

        // Apply new position
        particle.style.left = particle.x + 'px';
        particle.style.top = particle.y + 'px';
    });

    // Update smoke particles
    smokeParticles.forEach(smoke => {
        // Update position by speed
        smoke.x += smoke.speedX;
        smoke.y += smoke.speedY;

        // Boundary check to keep smoke particles within the screen
        if (smoke.x > window.innerWidth) smoke.x = 0;
        if (smoke.x < 0) smoke.x = window.innerWidth;
        if (smoke.y > window.innerHeight) smoke.y = 0;
        if (smoke.y < 0) smoke.y = window.innerHeight;

        // Apply new position
        smoke.style.left = smoke.x + 'px';
        smoke.style.top = smoke.y + 'px';
    });
}

// Checkbox event listener
document.getElementById('cbtest-19').addEventListener('change', (event) => {
    isGasLighterOn = event.target.checked;

    if (isGasLighterOn) {
        // Gradually fade out particles
        particles.forEach(particle => {
            particle.style.opacity = '0';
        });
    } else {
        // Reset opacity for new particles
        particles.forEach(particle => {
            particle.style.opacity = '1';
        });
    }
});

// Run the animation
function animate() {
    updateParticles();
    createSmokeParticle(); // Randomly create smoke particles slowly
    requestAnimationFrame(animate);
}

animate();