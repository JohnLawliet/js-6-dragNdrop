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

function arrayList(val){
  if (val==0)
    return backlogListArray
  else if (val==1)
    return progressListArray
  else if (val==2)
    return completeListArray
  else if (val==3)
    return onHoldListArray
}

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
  } 
  else {
    arrayList(0).push('Release the course', 'Sit back and relax');
    arrayList(1).push('Work on projects', 'Listen to music') 
    arrayList(2).push('Being cool', 'Getting stuff done') 
    arrayList(3).push('Being uncool') 
  }
  onLoad = true
}


// Set localStorage Arrays
function updateSavedColumns() {
  const arrayNames = ['backlogItems', 'progressItems', 'completeItems', 'onHoldItems']
  arrayNames.forEach((arrayName,index) => {
    let arrayCol = arrayList(index)
    localStorage.setItem(`${arrayName}`,JSON.stringify(arrayCol))
  })
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement('li');
  listEl.textContent = item
  listEl.draggable = true
  listEl.classList.add('drag-item');
  listEl.setAttribute('num',column)
  listEl.setAttribute('index',index)
  listEl.setAttribute('ondragstart','drag(event)')
  listEl.addEventListener('dblclick', () => {
    listEl.contentEditable = true
    listEl.setAttribute('onfocusout',`update(event)`)
  })
  columnEl.appendChild(listEl)  
}

function update(e){  
  let obj = {
    column: e.target.getAttribute("num"),
    index: e.target.getAttribute("index")
  }
  if (e.target.textContent===''){
    updateDOM('delete',obj)
  }
  else{
    obj.text = e.target.textContent
    updateDOM('update',obj)
  }  
}


// Update DOM according to type of work (add,drag,update,delete) then send off to update local storage
function updateDOM(type=null, param=null) {
  // Check localStorage once
  if (!onLoad){
    getSavedColumns();
    for (let i=0; i<4; i++){
      listColumns[i].textContent = ''
      arrayList(i).forEach((item, index) => {
        createItemEl(listColumns[i], i, item, index)
      })
    }
    updateSavedColumns()
    return 1
  }
    
  //Add text node functionality
  if (type === 'add'){
    // {column, itemText}
    let col = param.column
    listColumns[col].textContent = ''
    arrayList(col).forEach((item, index) => {
      createItemEl(listColumns[col], col, item, index)
    })
  }

  //Drag n drop functionality
  else if (type==='drag'){
    let dragNdrop = [param.item, param.currentColumn]
    while (dragNdrop.length!==0){
      let elem = dragNdrop.pop()
      listColumns[elem].textContent = ''
      arrayList(elem).forEach((item, index) => {
        createItemEl(listColumns[elem], elem, item, index)
      })      
    }
  }

  //Delete,update functionality grouped into one coz they come from update function
  else{
    let col = param.column
    let index = param.index
    if (type==='update')
      arrayList(col)[index] = param.text

    else if (type==='delete'){
      arrayList(col).splice(index,1)
      listColumns[col].removeChild(listColumns[col].childNodes[index])
    }
  }
  updateSavedColumns()
}

//When item starts dragging
function drag(e){
  draggedItem = e.target
//   backlogList.addEventListener('dragover',allowDrop(e))
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
  //rebuild arrays sending selected node's previous array
  rebuildArrays(draggedItem.getAttribute("num"))
}

function addToColumn(column){
  let itemText = addItems[column].textContent
  arrayList(column).push(itemText)
  updateDOM('add', {column})
}


//show add item input box
function showInputBox(column){
  addBtns[column].style.visibility = "hidden"
  saveItemBtns[column].style.display = "flex"
  addItemContainers[column].style.display = "flex"
}

//hide add item input box
function hideInputBox(column){
  addBtns[column].style.visibility = "visible"
  saveItemBtns[column].style.display = "none"
  addItemContainers[column].style.display = "none"
  addToColumn(column)
  addItems[column].textContent = ''
}


//Allow arrays to reflect drag and drop items
function rebuildArrays(item) {

    //Changing column number of the selected node and pushing to new column
    draggedItem.setAttribute('num',currentColumn)
    arrayList(currentColumn).push(draggedItem.textContent)

    //Deleting selected item from previous column using attribute index
    let index = draggedItem.getAttribute("index")    
    arrayList(item).splice(index,1)

    updateDOM('drag', {item, currentColumn})
}


//onLoad
updateDOM()

//This won't work. Only 1st column would be affected
// for (let i=0; i<addBtns.length; i++){
//   addBtns[i].addEventListener('click',showInputBox(i))
//   saveItemBtns[i].addEventListener('click',hideInputBox(i))
// }