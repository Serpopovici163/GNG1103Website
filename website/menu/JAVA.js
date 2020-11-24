var rIndex,
    table = document.getElementById("table");  
let myEnterButton = document.getElementById("enter")
let myEditButton = document.getElementById("edit")
let myRemoveButton = document.getElementById("remove")
let myAddphotoButton = document.getElementById("addPhoto")

// check the empty input
function checkEmptyInput(){
	var isEmpty = false,
		item = document.getElementById("getItemName").value,
		size = document.getElementById("getServingSize").value,
		price = document.getElementById("getPrice").value;
		flavor = document.getElementById("getFlavors").value;
		availability = document.getElementById("getAvailability").value;
		prepTime = document.getElementById("getPrepTime").value;
		description = document.getElementById("description").value;
		weight = document.getElementById("getWeight").value;
		
	if(item == ""){
		alert("Item name cannot be empty");
		isEmpty = true;
	}
	else if(size == ""){
		alert("Serving Size cannot be empty");
		isEmpty = true;
	}
	else if(price == ""){
		alert("Price cannot be empty");
		isEmpty = true;
	}
	else if(flavor == ""){
		alert("Must include some flavor/condiment");
		isEmpty = true;
	}
	else if(availability == ""){
		alert("availability of item needs to be specified");
		isEmpty = true;
	}
	else if(prepTime == ""){
		alert("enter a preparation time");
		isEmpty = true;
	}else if(description == ""){
		alert("enter a description");
		isEmpty = true;
	}else if(weight == ""){
		alert("enter a weight");
		isEmpty = true;
	}
	return isEmpty;
}

myEnterButton.onclick = function (element){ //clicking enter button
  //add row
  if(!checkEmptyInput()){
  var newRow = table.insertRow(table.length);
  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);
  var cell3 = newRow.insertCell(2);
  var cell4 = newRow.insertCell(3);
  var cell5 = newRow.insertCell(4);
  var cell6 = newRow.insertCell(5);
  var cell7 = newRow.insertCell(6);
  var cell8 = newRow.insertCell(7);
  var Item = document.getElementById("getItemName").value;
  var Text = document.getElementById("description").value;
  var Size = document.getElementById("getServingSize").value;
  var Price = document.getElementById("getPrice").value;
  var Flavor = document.getElementById("getFlavors").value;
  var Availability = document.getElementById("getAvailability").value;
  var PrepTime = document.getElementById("getPrepTime").value;
  var weight = document.getElementById("getWeight").value;
  cell1.innerHTML = Item;
  cell2.innerHTML = Text;
  cell4.innerHTML = weight;
  cell3.innerHTML = Size;
  cell5.innerHTML = Price;
  cell6.innerHTML = Flavor;
  cell7.innerHTML = Availability;
  cell8.innerHTML = PrepTime;
  selectedRowToOutput(); //call the function to set the event to the new row
  document.getElementById("editing").style.visibility="hidden";
  document.getElementById("number").style.visibility="hidden";
  document.getElementById("getItemName").value = "";
  document.getElementById("getServingSize").value = "";
  document.getElementById("description").value="";
  document.getElementById("getPrice").value = "";
  document.getElementById("getFlavors").value = "";
  document.getElementById("getAvailability").value = "";
  document.getElementById("getPrepTime").value = "";
  document.getElementById("getWeight").value = "";
  document.getElementById("editing").style.visibility="hidden";
  document.getElementById("number").style.visibility="hidden";
  }
}

	  

//display the selected row data into input text
function selectedRowToOutput(){
  for(var i=1; i<table.rows.length;i++){
  	table.rows[i].onclick = function(){
		document.getElementById("editing").style.visibility = "visible";
       //gets elected row of index
       rIndex = this.rowIndex;
       console.log(rIndex);	   
       document.getElementById("getItemName").value = this.cells[0].innerHTML;
	   document.getElementById("description").value = this.cells[1].innerHTML;
       document.getElementById("getWeight").value = this.cells[3].innerHTML;
	   document.getElementById("getServingSize").value = this.cells[2].innerHTML;
       document.getElementById("getPrice").value = this.cells[4].innerHTML;
       document.getElementById("getFlavors").value = this.cells[5].innerHTML;
       document.getElementById("getAvailability").value = this.cells[6].innerHTML;
       document.getElementById("getPrepTime").value = this.cells[7].innerHTML;
	   document.getElementById("remove").style.visibility="visible";
	   document.getElementById("number").style.visibility="visible";
	   document.getElementById("number").innerHTML= rIndex;
    }
  }
}
selectedRowToOutput();



myEditButton.onclick = function (element){
var item = document.getElementById("getItemName").value;
var text = document.getElementById("description").value;
var size = document.getElementById("getServingSize").value;
var price = document.getElementById("getPrice").value;
var flavor = document.getElementById("getFlavors").value;
var availability = document.getElementById("getAvailability").value;
var prep = document.getElementById("getPrepTime").value;
var weight = document.getElementById("getWeight").value;
if(!checkEmptyInput()){
  table.rows[rIndex].cells[0].innerHTML = item;
  table.rows[rIndex].cells[1].innerHTML = text;
  table.rows[rIndex].cells[3].innerHTML = weight;
  table.rows[rIndex].cells[2].innerHTML = size;
  table.rows[rIndex].cells[4].innerHTML = price;
  table.rows[rIndex].cells[5].innerHTML = flavor;
  table.rows[rIndex].cells[6].innerHTML = availability;
  table.rows[rIndex].cells[7].innerHTML = prep;
}
  document.getElementById("getItemName").value = "";
  document.getElementById("getServingSize").value = "";
  document.getElementById("description").value="";
  document.getElementById("getPrice").value = "";
  document.getElementById("getFlavors").value = "";
  document.getElementById("getAvailability").value = "";
  document.getElementById("getPrepTime").value = "";
  document.getElementById("getWeight").value = "";
  document.getElementById("editing").style.visibility="hidden";
  document.getElementById("number").style.visibility="hidden";
}

myRemoveButton.onclick = function (element){ 
  table.deleteRow(rIndex);
  // clear input text
  document.getElementById("getItemName").value = "";
  document.getElementById("getServingSize").value = "";
  document.getElementById("description").value="";
  document.getElementById("getPrice").value = "";
  document.getElementById("getFlavors").value = "";
  document.getElementById("getAvailability").value = "";
  document.getElementById("getPrepTime").value = "";
  document.getElementById("getWeight").value = "";
  document.getElementById("editing").style.visibility="hidden";
  document.getElementById("number").style.visibility="hidden";
}


//sidebar



document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");

  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0]);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
    }

    dropZoneElement.classList.remove("drop-zone--over");
  });
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

  // First time - remove the prompt
  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }

  // First time - there is no thumbnail element
  if (!thumbnailElement) {
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");
    dropZoneElement.appendChild(thumbnailElement);
  }

  thumbnailElement.dataset.label = file.name;

  // Show thumbnail for image files
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
    };
  } else {
    thumbnailElement.style.backgroundImage = null;
  }
}