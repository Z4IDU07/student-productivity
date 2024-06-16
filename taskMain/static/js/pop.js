
const fm = document.getElementById('t-info')


priority = ''

function goBack() {
    window.history.back();
}


function prioritize(ji) {
    if (ji == "hpri") {
        priority = 'high'
    }
    else {
        priority = 'low'
    }
    // console.log(priority)
}



fm.addEventListener("submit", (e) => {
    e.preventDefault();
    let flag = 0

    let taskname = document.querySelector(".t-inp");
    let due = document.querySelector(".time-inp");
    let descript = document.querySelector(".desc-inp");
    let ttime = document.querySelector(".ttime-inp")
    
    if (taskname.value==""){
        alert("Task name must not be empty");
        flag = 1;
    }
    if (due.value==""){
        alert("Due must not be empty")
        flag = 1;
    }
    // alert('new task added')
    if(flag==0){
        getID();
    }


});



function creatediv(idval) {
    if (priority == 'high') {
        var cssProperties = {
            backgroundColor: "indianred",
        };
    }
    else {
        var cssProperties = {
            backgroundColor: "rgb(159, 187, 110)",
        };
    }
    let taskname = document.querySelector(".t-inp");
    let due = document.querySelector(".time-inp");
    let descript = document.querySelector(".desc-inp");
    let ttime = document.querySelector(".ttime-inp");
    let day = document.querySelector(".day-inp");

    console.log('')
    console.log("THis is from function", taskname.value)
    mNewObj = document.createElement('div');
    console.log("priority: " + priority);
    cname = 'task' + idval; 
    bname = cname + "-btn";
    sendData(taskname, due, descript, priority, cname, ttime, day); ///////////////function call
    // mNewObj.class = "sep-task";
    mNewObj.innerHTML +=
        `<div id="${cname}" class="sep-task"` +
        '<div class="content-task">' +
        '<div class="top-div">' +
        `<h4 id="tname-h4">${taskname.value}</h4>` +
        `<h4>${due.value}</h4>` +
        '</div>' +
        `<div class="desc-div"> ${descript.value}` +
        '</div>' +
        '<div class="wrapper-btn-div">' +
        '<div id="btn-div">' +
        ' <div class="btn-fs">' +
        `<button id="${bname}" onclick="editTask('${cname}')" class="btn"><i class="fa-solid fa-pen-to-square"></i></button>` +
        `<button id="${bname}" onclick="completedtask('${cname}')" class="btn"><i class="fa-solid fa-check"></i></i></button>` +
        '</div>' +
        '<div class="goto-div">' +
        '<button class="btn"><i class="fa-solid fa-arrow-right-long"></i></button>' +
        '</div></div></div></div></div>';



    document.getElementById("newww").appendChild(mNewObj);
    var sp = document.getElementById(cname);
    Object.assign(sp.style, cssProperties);
    // for (var j = 0; j < sp.length; j++) {
    //     Object.assign(sp[j].style, cssProperties);
    // }


    // else{
    //     bg.style.backgroundColor
    // }
    // alert(mNewObj.taskname);
}


function completedtask(cid) {
    $.ajax({
        url: '/complete',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ "value": cid}),
        success: function (response) {
            console.log(response)
            // alert("Task added successfully");
        },
        error: function (error) {
            console.log(error);
        }
    });
};



function editTask(eid) {
    // Get the parent div of the clicked button
    // const arr = eid.split("-");
    // let nowc = arr[0];
    console.log(" ID from edit task: " + eid);
    let t;
    let dued;
    let desc;
    // var eddiv = document.getElementById("pop-edit");
    $.ajax({
        url: '/edit',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ "value": eid }),
        success: function (response) {
            t = response.result['taskname'];
            dued = response.result['due'];
            desc = response.result['desc'];
            console.log("Recieved");
            console.log(t);
            myeditobj = document.createElement('div');
            myeditobj.id = "pop-cnt2";
            myeditobj.innerHTML += '<div class="t-add" >' +
                '<form method="post" id="te-info">' +
                '<div class="title-div">' +
                '<h2>Edit Task</h2>' +
                '<div class="btn-div">' +
                `<button type="button" onclick="prioritize('hpri')" style="color: red;"><i class="fa-solid fa-circle"></i></button>` +
                `<button type="button" onclick="prioritize('pri')" style="color: green;"><i class="fa-solid fa-circle"></i></button>` +

                '</div></div>' +
                '<div class="t-div">' +
                '<h4>Title</h4>' +
                `<input class="t-inpe" type="text" value=${t} name="tname">` +
                '</div>' +
                '<div class="desc-div">' +
                '<h4>Description</h4>' +
                `<textarea class="desc-inpe" name="descs" id="" cols="30" rows="10"></textarea>` +
                '</div>' +
                '<div class="time-div">' +
                '<h4>Time</h4>' +
                `<input class="time-inpe" type="time" value=${dued}>` +
                '</div>' +
                '<div class="create-div">' +
                `<input class="edit-inp" value="Edit Task ->" type="button" onclick="editsub(${eid})">` +

                '</div>' +
                '</form>';
            document.querySelector('body').append(myeditobj);
            // alert("Task added successfully");
            var dm = document.getElementById('pop-cnt2');
            dm.style.display = "block";

            console.log(dm)

        },
        error: function (error) {
            console.log(error);
        }
    });



};

function editsub(para) {
    para = para.id;
    let taskname = document.querySelector(".t-inpe");
    let due = document.querySelector(".time-inpe");
    let descript = document.querySelector(".desc-inpe");
    var dm = document.getElementById('pop-cnt2');
    dm.style.display = 'none';

    console.log("this is para: " + para);
    $.ajax({
        url: '/update',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            'taskname': taskname.value,
            'due': due.value,
            'desc': descript.value,
            'prio': priority,
            'task_ID': para,
            'status': "nope"
        }),
        success: function (response) {
            console.log("edit works")
            // alert("Task added successfully");
        },
        error: function (error) {
            console.log(error);
        }
    });
}






function sendData(taskname, duedate, description, prio, c, ttime, day) {
    
    $.ajax({
        url: '/process',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            'taskname': taskname.value,
            'due': duedate.value,   
            'desc': description.value,
            'prio': prio,
            'task_ID': c,
            'ctime': ttime.value,
            'day': day.value,
            'status': "nope"
        }),
        success: function (response) {
            console.log("GOtcha")
            // alert("Task added successfully");
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getID(){
    $.ajax({
        url: '/getId',
        success: function (response) {
            console.log("GOtcha")
            console.log(response.id_val);
            creatediv(response.id_val);
            // alert("Task added successfully");
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// CHAT BOT SCRIPTS


function toggleChatbot() {
    const chatbotPopup = document.getElementById("chatbotPopup");
    chatbotPopup.classList.toggle("active");
    console.log("Called");
}

function sendMessage() {
    const userMessage = document.getElementById("userMessage").value;
    if (userMessage.trim() !== "") {
        const chatbotPopupBody = document.getElementById("chatbotPopupBody");
        const userChatItem = document.createElement("p");
        userChatItem.textContent = userMessage;
        userChatItem.classList.add("user-message"); // Add user message class
        chatbotPopupBody.appendChild(userChatItem);
        chatbotPopupBody.scrollTop = chatbotPopupBody.scrollHeight;

        // Send message to Flask server
        fetch(`/get?msg=${encodeURIComponent(userMessage)}`)
            .then(response => response.text())
            .then(data => {
                receiveMessageFromServer(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        document.getElementById("userMessage").value = ""; // Clear input field
    }
}

function receiveMessageFromServer(message) {
    const chatbotPopupBody = document.getElementById("chatbotPopupBody");
    const chatbotChatItem = document.createElement("p");
    chatbotChatItem.textContent = message;
    chatbotChatItem.classList.add("bot-message"); // Add bot message class
    chatbotPopupBody.appendChild(chatbotChatItem);
    chatbotPopupBody.scrollTop = chatbotPopupBody.scrollHeight;
}


// function getUsername(){
//     $.ajax({
//         url: '/unameret',
//         success: function (response) {
//             u_nameChoi = response.result['uname'];
//             console.log(response); 
//         },
//         error: function (error) {
//             console.log(error);
//         }
//     });
// }
