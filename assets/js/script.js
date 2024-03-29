// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Give variable to submit button
const submitBtn = $('#submitTaskBtn');

// Todo:+ create a function to generate a unique task id
function generateTaskId() {
    // Make task ID current timestamp in milliseconds - will not need to check for repeat IDs
    nextId = dayjs().unix();
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
}

// Give due date entry a date picker widget
function datePicker() {
    $('#taskDueDateInput').datepicker({
      changeMonth: true,
      changeYear: true,
    });
  };


// Function to see if task is upcoming or overdue
function checkTaskStatus(dueDate) {
    const dateToday = dayjs();
    let dateDiff = dueDate.diff(dateToday, 'day')
    let status; 

    if (dateDiff > 7) {
        status = 'dueLater'
    } else if ( dateDiff >= 0 && dateDiff < 7) {
        status = 'dueSoon'
    } else if (dateDiff < 0) {
        status = 'overdue'
    }
    return status;
}

// Constructor for new task object
const Task = function() {
    this.taskId = nextId;
    this.taskTitle = $('#taskTitleInput').val();
    this.taskDueDate = dayjs($('#taskDueDateInput').val());
    this.taskDescription = $('#taskDescriptionInput').val();
    this.taskStatus = checkTaskStatus(this.taskDueDate);
    this.taskProgress = 'todo';

}

// Function to create a new task object and add it to our task array
function newTask() {
    const task = new Task();
    taskList.push(task);
    return taskList;
}

// Makes tasks draggable
function draggable() {
    $('.draggable').draggable({ 
        snap: '.droppable',
        revert: 'invalid' });
}

// Todo:+ create a function to create a task card
function createTaskCard(task) {
    task.taskStatus = checkTaskStatus(dayjs(task.taskDueDate));
    const taskCard = $(
        `<div class="task-card draggable ${task.taskStatus}" data-id="${task.taskId}">
            <h5 class="card-header">${task.taskTitle}</h5>
            <div class="card-body">
                <h5 class="card-title">${dayjs(task.taskDueDate).format('MMM/DD/YYYY')}</h5>
                <p class="card-text">${task.taskDescription}</p>
                <button type="button" id="deleteTaskBtn">Delete Task</button>
            </div>
        </div>`
        );
    if (task.taskProgress === 'todo') {
        $('#todo-cards').append(taskCard);
    } else if (task.taskProgress === 'inProgress') {
        $('#in-progress-cards').append(taskCard)
    } else if (task.taskProgress === 'done') {
        $('#done-cards').append(taskCard)
    }

    draggable();
}

// Function to reset task form
function resetForm() {
    $('#taskTitleInput, #taskDueDateInput, #taskDescriptionInput').val('');
}

// Todo:+ create a function to render the task list and make cards draggable
function renderTaskList() {
    for (const task of taskList) {
        createTaskCard(task);
}}

// Todo:+ create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    
    newTask();
    createTaskCard(taskList[taskList.length - 1])
    resetForm();
    generateTaskId();
    localStorage.setItem("tasks", JSON.stringify(taskList))
}



// Todo:+ create a function to handle deleting a task
function handleDeleteTask(event){
    event.stopPropagation();

    const taskCard = $(this).closest('.task-card');
    taskCard.remove();

    const taskId = taskCard.data('id');
    taskList = taskList.filter(function(task) {
        return task.taskId !== taskId;
    })
    
    localStorage.setItem("tasks", JSON.stringify(taskList))
}


// Todo:+ create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('id');
    const targetLane = $(this).attr('id');

    let newProgress;
    switch (targetLane) {
        case 'todo-column':
            newProgress = 'todo';
            break;
        case 'in-progress-column':
            newProgress = 'inProgress';
            break;
        case 'done-column':
            newProgress = 'done';
            break;
        default:
            newProgress = 'todo';
    }

    // Update the task's progress in taskList
    const taskIndex = taskList.findIndex(task => task.taskId === taskId);
    if (taskIndex !== -1) {
        taskList[taskIndex].taskProgress = newProgress;
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }
    $('.task-card').remove();
    renderTaskList();
}

// Make lanes droppable and handle drop events
function droppable() {
    $('.droppable').droppable({
        accept: '.draggable',
        drop: handleDrop
    });
}



// Todo:+ when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker

$(document).ready(function () {
    datePicker();
    renderTaskList();
    submitBtn.on('click', handleAddTask);
    $(document).on('click', '#deleteTaskBtn', handleDeleteTask);
    droppable(); 
});
