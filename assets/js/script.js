// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Define buttons
const submitBtn = $('#submitTaskBtn');

// Todo: create a function to generate a unique task id
function generateTaskId() {
    // Make task ID current timestamp in milliseconds - will not need to check for repeat IDs
    nextId = new Date().getTime();
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
}

// Give due date entry a date picker widget
const datePicker = function() {
    $('#taskDueDateInput').datepicker({
      changeMonth: true,
      changeYear: true,
    });
  };


// Function to see if task is upcoming or overdue
const checkTaskStatus = function(dueDate) {
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
    this.taskCard = $(
        `<div class="task-card to-do">
            <h5 class="card-header">Task</h5>
            <div class="card-body">
                <h5 class="card-title">${this.taskTitle}</h5>
                <p class="card-text">${this.taskDescription}</p>
                <button type="button" id="deleteTask">Delete Task</button>
            </div>
        </div>`
    )
}

// Function to create a new task object and add it to our task array
const newTask = function() {
    const task = new Task();
    taskList.push(task);
    return taskList;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    task.taskCard.addClass(task.taskStatus)
    $('body').append(task.taskCard);
}

// Function to reset task form
    function resetForm() {
        $('#taskTitleInput, #taskDueDateInput, #taskDescriptionInput').val('');
    }

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    
    newTask();
    localStorage.setItem("tasks", JSON.stringify(taskList))
    createTaskCard(taskList[taskList.length - 1])
    resetForm();
    generateTaskId();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    datePicker();
// Click event for submitting a task entry, rendering the task, and storing it to local storage
    submitBtn.on('click', handleAddTask)
});
