
// IMPORTANT PAGE AND COMPLETED PAGE 

function creating_imp(ress) {
    const ImpTasksArray = ress;

    // Iterate over each array in the dictionary
    if (Array.isArray(ImpTasksArray)) {
        ImpTasksArray.sort((a, b) => {
            if (a.prio === 'high' && b.prio !== 'high') {
                return -1; // High priority tasks first
            } else if (a.prio !== 'high' && b.prio === 'high') {
                return 1; // High priority tasks first
            } else {
                // If both have the same priority, sort by time left (assuming due is in "HH:mm" format)
                const timeA = a.due.split(":");
                const timeB = b.due.split(":");

                // Compare hours
                if (parseInt(timeA[0]) !== parseInt(timeB[0])) {
                    return parseInt(timeA[0]) - parseInt(timeB[0]);
                }
                // If hours are equal, compare minutes
                else {
                    return parseInt(timeA[1]) - parseInt(timeB[1]);
                }
            }
        });
        // Iterate over the array
        ImpTasksArray.forEach(task => {
            const taskElement = createTaskElement(task);
            document.getElementById("newww").appendChild(taskElement);

        });
    }
}

function createTaskElement(task) {
    // Create task element
    const taskElement = document.createElement('div');
    taskElement.id = task.task_ID;
    taskElement.className = 'sep-task';
    taskElement.innerHTML = `
        <div class="content-task">
            <div class="top-div">
                <h4>${task.taskname}</h4>
                <h4>${task.due}</h4>
            </div>
            <div class="desc-div">${task.desc}</div>
            <div class="wrapper-btn-div">
                <div id="btn-div">
                    <div class="btn-fs">
                        <button id="btn1" onclick="editTask('${task.task_ID}')" class="btn"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button id="btn2" onclick="completedtask('${task.task_ID}')" class="btn"><i class="fa-solid fa-check"></i></button>
                    </div>
                    <div class="goto-div">
                        <button class="btn"><i class="fa-solid fa-arrow-right-long"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
    // Add background color based on priority
    const cssProperties = {
        backgroundColor: task.prio === 'high' ? "indianred" : "rgb(159, 187, 110)"
    };
    Object.assign(taskElement.style, cssProperties);

    const dueTime = new Date();
    const [hours, minutes] = task.due.split(':');
    dueTime.setHours(hours, minutes, 0, 0);
    const now = new Date();
    const timeLeft = dueTime - now;
    if (timeLeft <= 0) {
        taskElement.classList.add('urgent');
    } else if (timeLeft <= 3600000 && task.prio === 'low') {
        taskElement.classList.add('low-urgent');
    }

    taskElement.addEventListener('mouseenter', function () {
        const descDiv = taskElement.querySelector('.desc-div');

        const originalDesc = descDiv.innerHTML;

        const dueTime = new Date();
        const [hours, minutes] = task.due.split(':');
        dueTime.setHours(hours, minutes, 0, 0);
        const timerInterval = setInterval(function () {
            const now = new Date();
            const timeLeft = dueTime - now;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                descDiv.textContent = 'Time is up!';
            } else {
                const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
                descDiv.textContent = `Time left: ${hoursLeft}:${minutesLeft}:${secondsLeft}`;
            }
        }, 1000);
        taskElement.addEventListener('mouseleave', function () {
            clearInterval(timerInterval);
            descDiv.innerHTML = originalDesc;
        });
    });

    return taskElement;
}


function important_wind() {
    console.log("called");
    $.ajax({
        url: '/imppage',
        type: 'POST',
        contentType: 'application/json',
        success: function (response) {
            creating_imp(response.important_task);
            console.log(response)
            console.log("Recieved");

            // alert("Task added successfully");
        },
        error: function (error) {
            console.log(error);
        }
    });

}
function completed_wind() {
    console.log("called");
    $.ajax({
        url: '/completedpage',
        type: 'POST',
        contentType: 'application/json',
        success: function (response) {
            creating_imp(response.completed_task);
            console.log(response)
            console.log("Recieved");

            // alert("Task added successfully");
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function taskHome_wind() {
    console.log("called");
    $.ajax({
        url: '/homepage',
        type: 'POST',
        contentType: 'application/json',
        success: function (response) {
            creating_imp(response.homepageTasks);
            console.log(response)
            console.log("Recieved");

        },
        error: function (error) {
            console.log(error);
        }
    });
}



document.getElementById("showTableButton").addEventListener("click", function () {
    document.getElementById("taskTable").classList.toggle("show");
    populateTaskTable();
});

function populateTaskTable() {
    const tableBody = document.getElementById("taskTableBody");

    tableBody.innerHTML = '';

    $.ajax({
        url: '/homepage',
        type: 'POST',
        success: function (response) {
            response.homepageTasks.forEach(task => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${task.taskname}</td>
                    <td>${task.desc}</td>
                    <td>${task.due}</td>
                    <td>${task.ctime}</td>
                `;
                tableBody.appendChild(row);
            });
        },
        error: function (error) {
            console.error('Error fetching tasks:', error);
        }
    });
}
