const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let onLoad = false

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];


// Drag Functionality
let currentColumn
let draggedItem

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    console.log("hmmm")
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}




// Set localStorage Arrays
function updateSavedColumns() {
  let arrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray]
  const arrayNames = ['backlogItems', 'progressItems', 'completeItems', 'onHoldItems']
  arrayNames.forEach((arrayName,index) => {
    console.log(arrayName)
    localStorage.setItem(`${arrayName}`,JSON.stringify(arrays[index]))
  })
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.textContent = item
  listEl.draggable = true
  listEl.classList.add('drag-item');
  listEl.setAttribute('ondragstart','drag(event)')
  columnEl.appendChild(listEl)
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!onLoad)
    getSavedColumns();

  // Backlog Column
  backlogList.textContent = ''
  backlogListArray.forEach((item, index) => {
    createItemEl(backlogList, 0, item, index)
  })

  // Progress Column
  progressList.textContent = ''
  progressListArray.forEach((item, index) => {
    createItemEl(progressList, 1, item, index)
  })

  // Complete Column
  completeList.textContent = ''
  completeListArray.forEach((item, index) => {
    createItemEl(completeList, 2, item, index)
  })

  // On Hold Column
  onHoldList.textContent = ''
  onHoldListArray.forEach((item, index) => {
    createItemEl(onHoldList, 3, item, index)
  })

  // Run getSavedColumns only once, Update Local Storage
}

//Allow arrays to reflect drag and drop items
function rebuildArrays(parent, draggedItem) {
  console.log("parent : ",parent.id)
  console.log("draggedItem : ",draggedItem)
}


//When item starts dragging
function drag(e){
  draggedItem = e.target
  console.log("dragged item : ",draggedItem.textContent)
}

//column allows for drop
function allowDrop(e){
  e.preventDefault()
}


//When item eters column area
function dragEnter(column){
  listColumns[column].classList.add('over')
  currentColumn = column;
}

//Dropping item in column
function drop(e){
  e.preventDefault();
  //remove background color/padding
  listColumns.forEach(column => {
    column.classList.remove('over')
  })
  //add item to column
  const parent = listColumns[currentColumn]
  parent.appendChild(draggedItem)
  console.log("in drop function parent : ",e)
  console.log(progressListArray)
  rebuildArrays(parent, draggedItem)
}


//onLoad
updateDOM()

