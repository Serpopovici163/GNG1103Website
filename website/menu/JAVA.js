var rIndex,
table = document.getElementById("table");  
let myEnterButton = document.getElementById("enter")
let myEditButton = document.getElementById("edit")
let myRemoveButton = document.getElementById("remove")
let myAddphotoButton = document.getElementById("addPhoto")

var menuData;

//retrieve row from SQL table provided index >=1
function getItem(itemID) {
	var xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//check if end of table reached
			if (this.responseText.includes("///")) {
				menuData[0] = -1; 
				return;
			}
			
			//if not end of table, populate menuData array
			menuData = this.responseText.split("/");
		}
	};
	
	xhttp.open("GET", "menu/getmenu.php?itemID="+itemID, true);
	xhttp.send();
}

//populate table with database items
function load() {
	var index = 1; //index of item to get
	
	while (true) {
		getItem(index);
		alert(menuData); //------------------------------------------------------------------------>ASYNC
		
		//check if end of database has been reached
		if (menuData[0] == -1) {
			break;
		}
		
		//otherwise populate table
		var bufferRow = table.insertRow(table.length);
		bufferRow.setAttribute("onclick", "selectRow(this)");
		alert("ok");
		for (var i =1; i < 9; i++) { //taking indexes 1 through 9 since 0 is itemID which is only for database purposes
			var cell = bufferRow.insertCell(i-1);
			
			cell.innerHTML = menuData[i];
		}
		index++;
	}
}

// check the empty input
function checkEmptyInput(){
	
	//removed check for flavor since it is not necessary
	
	var isEmpty = false,
	item = document.getElementById("getItemName").value,
	size = document.getElementById("getServingSize").value,
	price = document.getElementById("getPrice").value;
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

//SQL request to insert row
function addItem() {
	var xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			alert(this.responseText);
		}
	};
	
	xhttp.open("POST", "menu/additem.php?itemID=" + rIndex + "&name='" + table.rows[rIndex].cells[0].innerHTML + "'&desc='" + table.rows[rIndex].cells[1].innerHTML + "'&serv_size=" + table.rows[rIndex].cells[2].innerHTML + "&weight=" + table.rows[rIndex].cells[3].innerHTML + "&price=" + table.rows[rIndex].cells[4].innerHTML + "&flav='" + table.rows[rIndex].cells[5].innerHTML + "'&avail=" + table.rows[rIndex].cells[6].innerHTML + "&prep_time=" + table.rows[rIndex].cells[7].innerHTML, true);
	xhttp.send();
}

//check if text field data matches existing row in column
function checkDuplicate() {
	if (document.getElementById("getItemName").value == table.rows[rIndex].cells[0].innerHTML) {
		return true;
	}
	return false;
}

myEnterButton.onclick = function (element){ //clicking enter button
	//add row
	if(!checkEmptyInput() && !checkDuplicate()){
		var newRow = table.insertRow(table.length);
		rIndex = table.rows.length-1; //-1 to remove table header from count
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
		addItem();
	}
	else if (checkDuplicate()) {
		updateMenu();
	}
	
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

//display the selected row data into input text
function selectRow(row) {
	document.getElementById("editing").style.visibility = "visible";
	//gets elected row of index
	rIndex = row.rowIndex;
	console.log(rIndex);	   
	document.getElementById("getItemName").value = row.cells[0].innerHTML;
	document.getElementById("description").value = row.cells[1].innerHTML;
	document.getElementById("getWeight").value = row.cells[3].innerHTML;
	document.getElementById("getServingSize").value = row.cells[2].innerHTML;
	document.getElementById("getPrice").value = row.cells[4].innerHTML;
	document.getElementById("getFlavors").value = row.cells[5].innerHTML;
	document.getElementById("getAvailability").value = row.cells[6].innerHTML;
	document.getElementById("getPrepTime").value = row.cells[7].innerHTML;
	document.getElementById("remove").style.visibility="visible";
	document.getElementById("number").style.visibility="visible";
	document.getElementById("number").innerHTML= rIndex;
}

//SQL request to update menu entry
function updateMenu() {
	var xhttp = new XMLHttpRequest();	
	xhttp.open("POST", "menu/updatemenu.php?itemID=" + rIndex + "&name='" + table.rows[rIndex].cells[0].innerHTML + "'&desc='" + table.rows[rIndex].cells[1].innerHTML + "'&serv_size=" + table.rows[rIndex].cells[2].innerHTML + "&weight=" + table.rows[rIndex].cells[3].innerHTML + "&price=" + table.rows[rIndex].cells[4].innerHTML + "&flav='" + table.rows[rIndex].cells[5].innerHTML + "'&avail=" + table.rows[rIndex].cells[6].innerHTML + "&prep_time=" + table.rows[rIndex].cells[7].innerHTML, true);
	xhttp.send();
}

//edit menu item
myEditButton.onclick = function (element){
	var item = document.getElementById("getItemName").value;
	var text = document.getElementById("description").value;
	var size = document.getElementById("getServingSize").value;
	var price = document.getElementById("getPrice").value;
	var flavor = document.getElementById("getFlavors").value;
	var availability = document.getElementById("getAvailability").value;
	var prep = document.getElementById("getPrepTime").value;
	var weight = document.getElementById("getWeight").value;
	if(checkEmptyInput()){
		return;
	}
	table.rows[rIndex].cells[0].innerHTML = item;
	table.rows[rIndex].cells[1].innerHTML = text;
	table.rows[rIndex].cells[3].innerHTML = weight;
	table.rows[rIndex].cells[2].innerHTML = size;
	table.rows[rIndex].cells[4].innerHTML = price;
	table.rows[rIndex].cells[5].innerHTML = flavor;
	table.rows[rIndex].cells[6].innerHTML = availability;
	table.rows[rIndex].cells[7].innerHTML = prep;
	updateMenu();
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

//SQL request to delete database row
function deleteRow() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "menu/deletemenuitem.php?itemID="+rIndex, true);
	xhttp.send();
}

myRemoveButton.onclick = function (element){ 
table.deleteRow(rIndex);
deleteRow();
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