const tasks =[];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;
let statusApp = "stop";


const bAdd = document.querySelector('#bAdd');
const itTask = document.querySelector('#itTask');
const form = document.querySelector('#form');
const taskName = document.querySelector('#time #taskName');

renderTasks();
renderTime();

function drawGift(size, symbol) {
    let box = "";
    if(size == 1){
        box = '#';
        return box;
    }
    
    return '#\n'
}

drawGift(4, '+');

function maxDistance(movements) {
    let movePossible = 0;
    let moveRight = 0;
    let moveLeft = 0;
    for(let char of movements){
        if(char == '*'){
            movePossible++;
        }
        if(char == '<'){
            moveLeft++;
        }
        if(char == '>'){
            moveRight++;
        }
    }
    let distance = 0;
    if(moveLeft > moveRight){
        distance = moveLeft - moveRight;
    }else if(moveRight > moveLeft){
        distance = moveRight - moveLeft;
    }
    distance +=movePossible;
    return distance;
}

function decode(message) {
    let firstBracket = message.indexOf('(');
    let endBracket = message.indexOf(')');
    let result = (firstBracket == -1 || endBracket == -1) ? message : "";
    for(let i = 0; i<message.length; i+=endBracket) {
        console.log("Nº Bucle:" + i);
        let newMessage = message.substring(firstBracket+1,endBracket);

        if(newMessage.indexOf('(') != -1){
            let priorMessage = newMessage.substring(newMessage.indexOf('(')+1, endBracket);
            let endBracketDeep = message.lastIndexOf(')');
            newMessage = message.substring(firstBracket+1,endBracketDeep);

            let firstInvert = newMessage.replace('(' + priorMessage + ')',invertStr(priorMessage));
            result = message.replace('(' + newMessage + ')', invertStr(firstInvert) );
            
           // message =  message.substring(,message.length);

            message = message.substring();
        }else{
            result = message.replace('('+  newMessage + ')', invertStr(newMessage));
        }

    }
    return result;
}

function invertStr(str){
    let result = '';
    for(let i = str.length-1; i >= 0; i--){
        result += str[i];
    }
    return result;
}

/*
const a = decode('hola (odnum)')
console.log(a) // hola mundo

const b = decode('(olleh) (dlrow) (aloh)!')
console.log(b) // hello world!

const c = decode('sa(u(cla)atn)s')
console.log(c) // santaclaus
*/
// Paso a paso:
// 1. Invertimos el anidado -> sa(ualcatn)s
// 2. Invertimos el que queda -> santaclaus


form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(itTask.value !== "") {
        createTask(itTask.value);
        itTask.value = '';
        renderTasks();
    }
});

function createTask(value) {
    const newTask = {
        id: (Math.random() * 100).toString(36).slice(3),
        title: value,
        completed: false
    };
    tasks.unshift(newTask);
}

function renderTasks() {
    const html = tasks.map(task => {
        return `
            <div class="task">
            <div class="completed">${
              task.completed
                ? "<span class='done'>Done</span>"
                : `<button class="start-button" data-id="${task.id}">Start</button></div>`
            }
                <div class="title">${task.title}</div>
            </div>`;
    });

    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.innerHTML = html.join("");

    const startButtons = document.querySelectorAll('.task .start-button');

    startButtons.forEach((startButton) => {
        startButton.addEventListener("click", () => {
          if (!timer) {
            startButtonHandler(startButton.getAttribute("data-id"));
            startButton.textContent = "In progress...";
          }
        });
      });
}

function startButtonHandler(id) {
    time = 0.5 * 10;
    current = id;
    const taskIndex = tasks.findIndex(task => task.id === id);
    document.querySelector("#time #taskName").textContent = tasks[taskIndex].title;
    timer = setInterval(() => {
        timerHandler(id);
    },1000);
}

function timerHandler(id) {
    time--;
    renderTime();

    if(time === 0) {
        clearInterval(timer);
        markCompleted(id);
        timer = null;
        renderTasks();
        startBreak();
    }
}

function markCompleted(id) {
    const taskId = tasks.findIndex((task) => task.id === id);
    tasks[taskId].completed = true;
}

function startBreak(){
    time = 1 * 60;
    taskName.textContent = 'Break';
    timerBreak = setInterval(() => {
        timerBreakHandler();
    }, 1000);
}

function timerBreakHandler() {
    time--;
    renderTime();

    if(time === 0) {
        clearInterval(timerBreak);
        current = null;
        timerBreak = null;
        taskName.textContent = '';
        renderTasks();
    }
}

function renderTime(){
    const timeDiv = document.querySelector('#time #value');
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    timeDiv.textContent = `${minutes < 10 ? '0' : ''}${minutes}:
        ${seconds < 10 ? '0' : ''}${seconds}`;
}


