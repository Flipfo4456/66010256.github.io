document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("taskList"); // 📌 ใช้ใน home.html
    const saveTaskBtn = document.getElementById("saveTask"); // 📌 ใช้ใน add_task.html
    const subjectInput = document.getElementById("subject"); // 📌 ใช้ใน add_task.html
    const colorButtons = document.querySelectorAll(".color-option"); // 📌 ใช้ใน add_task.html
    const currentDateElement = document.getElementById("currentDate");
    const currentTimeElement = document.getElementById("currentTime");
    let selectedColor = "#5A91E6"; // ค่าเริ่มต้น

    function updateCurrentTime() {
        const now = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        if (currentDateElement && currentTimeElement) {
            currentDateElement.textContent = now.toLocaleDateString("en-US", options);
            currentTimeElement.textContent = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
        }
    }
    setInterval(updateCurrentTime, 1000);
    updateCurrentTime();

    const API_URL = "http://localhost:3000/tasks"; // 🔗 URL ของ Backend

    // 📌 เมื่อคลิกเลือกสี ให้ตั้งค่าสีที่เลือก (ใช้ใน add_task.html เท่านั้น)
    if (colorButtons.length > 0) {
        colorButtons.forEach(button => {
            button.addEventListener("click", function () {
                colorButtons.forEach(btn => btn.classList.remove("selected"));
                this.classList.add("selected");
                selectedColor = this.getAttribute("data-color");
                console.log("🎨 สีที่เลือก:", selectedColor);
            });
        });
    }

    // 📌 โหลด Task จาก Backend (ใช้เฉพาะใน home.html)
    async function loadTasks() {
        if (!taskList) return; // ❌ ออกจากฟังก์ชันถ้าไม่ใช่หน้า Home
        try {
            const response = await fetch(API_URL);
            const tasks = await response.json();
            taskList.innerHTML = "";
            tasks.forEach(task => createTaskElement(task));
        } catch (error) {
            console.error("❌ โหลด Task ล้มเหลว:", error);
        }
    }

    // 📌 บันทึก Task ไปที่ Backend (ใช้เฉพาะใน add_task.html)
    async function saveTask() {
        if (!subjectInput) return; // ❌ ออกจากฟังก์ชันถ้าไม่ใช่หน้า Add Task
        const subject = subjectInput.value.trim();
        if (!subject) {
            alert("❌ กรุณากรอกชื่อวิชา (Subject)");
            return;
        }

        const newTask = { subject, color: selectedColor };
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });

            if (response.ok) {
                console.log("✅ บันทึก Task สำเร็จ:", newTask);
                window.location.href = "index.html"; // 🔄 กลับไปหน้า Home
            } else {
                console.error("❌ บันทึก Task ล้มเหลว");
            }
        } catch (error) {
            console.error("❌ เกิดข้อผิดพลาด:", error);
        }
    }

    // 📌 ลบ Task จาก Backend (ใช้ใน home.html)
    async function deleteTask(taskId) {
        try {
            const response = await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });
            if (response.ok) {
                console.log(`🗑 Task ID ${taskId} ถูกลบ`);
                loadTasks(); // โหลด Task ใหม่
            } else {
                console.error("❌ ลบ Task ล้มเหลว");
            }
        } catch (error) {
            console.error("❌ เกิดข้อผิดพลาด:", error);
        }
    }

    // 📌 เมื่อกด Play ให้ไป `system2.html` และบันทึก Task (ใช้ใน home.html)
    function playTask(task) {
        localStorage.setItem("selectedTaskSubject", task.subject);
        localStorage.setItem("selectedTaskColor", task.color);
        window.location.href = "system2.html";
    }

    // 📌 สร้าง Task บนหน้า Home
    function createTaskElement(task) {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.style.backgroundColor = task.color;
        taskDiv.innerHTML = `
            <div class="task-header">
                <span class="task-category">${task.subject}</span>
                <button class="delete-task" data-id="${task.id}">X</button>
            </div>
            <button class="play-task"></button>
        `;
        taskList.appendChild(taskDiv);

        // ปุ่มลบ Task
        taskDiv.querySelector(".delete-task").addEventListener("click", function () {
            deleteTask(task.id);
        });

        // ปุ่ม Play
        taskDiv.querySelector(".play-task").addEventListener("click", function () {
            playTask(task);
        });
    }

    // 📌 โหลด Task เฉพาะหน้า Home
    if (taskList) {
        loadTasks();
    }

    // 📌 บันทึก Task เฉพาะหน้า Add Task
    if (saveTaskBtn) {
        saveTaskBtn.addEventListener("click", saveTask);
    }
});
