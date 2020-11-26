var mapHide = [{
	"stylers": [{
		"saturation" : -100,
		"gamma": 0.1,
	}]
}];
var mapShow = [{
	"stylers": [{
		"gamma": 1
	}]
}];

var map;
var orderData;
var buffer = ""; //used to store item name when requesting it from database, could not figure out how to return it from a function
var activeOrder = 0; //stores orderID of open order

// - RECEIVING DATA FROM SQL TABLES
//
//FOR ITEMS

function parseItem(data, index) {
	var output = data.split("/");
	buffer = output[index];
}

function getItem(itemID, property) {
	
	//get item name from database
	
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			parseItem(this.responseText, property);
		}
	};
	xhttp.open("GET", "orders/getitem.php?itemID="+itemID, true);
	xhttp.send();
}

//FOR ORDERS

function parseOrderData(data) {
	
	//check if end of order table has been reached
	
	if (data.includes("///")) { 
		orderData[0] = -1;
		return;
	}
	orderData = data.split("/");
}

function getOrder(orderID, cFunction, updateActiveOrder) {
	
	//update active order
	
	if (updateActiveOrder) {
		activeOrder = orderID;
	}
	
	var xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			cFunction(this.responseText);
		}
	};
	
	xhttp.open("GET", "orders/getorder.php?orderID="+orderID, true);
	xhttp.send();
}

// - SENDING DATA TO SQL TABLES
//
//UPDATE ORDER STATUS

function modOrderStatus(orderID, statusValue) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "orders/updateorder.php?orderID=" + orderID + "&orderStatus=" + statusValue, true);
	xhttp.send();
}

// - GOOGLE MAPS API STUFF && DIALOG ANIMATION
//
//GOOGLE MAP LOADING/TOGGLING

function initMap() {
	const start = { lat: 45.424721, lng: -75.695 }; //ottawa
	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 13,
		center: start,
		disableDefaultUI: true,
		gestureHandling: "none",
		styles: mapHide,
	});
}

function toggleMap(i) {
	if (i == 1) { //show map 
		map.setOptions({
			styles: mapShow,
			gestureHandling: "cooperative",
			disableDefaultUI: false,
		});
	}
	else { //hide map
		map.setOptions({
			styles: mapHide,
			gestureHandling: "none",
			disableDefaultUI: true,
		});
	}
}

//DIALOG ANIMATION

function toggleDialog(x) {
	
	//x is used to prevent the dialog from reappearing if one clicks on the map while the dialog is hidden
	//this is because we want the user to be able to interact with the map
	
	var img = document.getElementById("bodyShiftButton");
	var container = document.getElementById("container");
	var childContainer = document.getElementById("map_order_list");
	
	//move dialog without animation if drone manager is meant to open
	if (x == 3) {
		img.src = "misc/down.svg";
		container.style.top = "-50%";
		childContainer.style.top = "80%";
		toggleMap(1);
		return;
	}
	
	//check if dialog is hidden already, uses image src tag for this
	if (img.src.includes("up.svg")) { //dialog open
		img.src = "misc/down.svg";
		var mainPos = 50; //position of main dialog
		var orderListPos = 100; //position of child dialog
		var id = setInterval(frame, 1);
		function frame() {
			if (mainPos == -50) {
				clearInterval(id);
			}
			else {
				mainPos--;
				container.style.top = mainPos + '%';
				orderListPos = orderListPos - 0.1;
				childContainer.style.top = orderListPos + '%';
			}
		}
		toggleMap(1);
	}
	else if (img.src.includes("down.svg") && !x) { //dialog closed, also checks if user clicked on map
		img.src = "misc/up.svg";
		var mainPos = -50; //position of main dialog
		var orderListPos = 90; //position of child dialog
		var id = setInterval(frame, 1);
		function frame() {
			if (mainPos == 50) {
				clearInterval(id);
			}
			else {
				mainPos++;
				container.style.top = mainPos + '%';
				orderListPos = orderListPos + 0.1;
				childContainer.style.top = orderListPos + '%';
			}
		}
		toggleMap(0);
	}
}

// - PAGE LOADING
//

function load() {
	loadOrders();
	initMap();
	
	//check if page opened due to drone management option
	//hide dialog and show map if this is the case
	const query = window.location.search;
	if (query.includes("true")) { //show drone map
		toggleDialog(3); //option 3 does not display animation
	}
}

function loadOrders() {
	var orderList = document.getElementsByClassName("order_list");
	orderList[0].innerHTML = ""; //order list on main dialog
	orderList[1].innerHTML = ""; //order list on map dialog
	for (var x = 0; x < 2; x++) {
		var orderID = 1;

		while (true) {
			getOrder(orderID, parseOrderData, 0);
			alert(orderData); //--------------------------------------------------------------------> ASYNC ERROR
			//check if end of order table has been reached
			if (orderData[0] == -1) {
				break;
			}
			
			//otherwise create list element
			var order = document.createElement("li");
			
			//set colour of order based on orderStatus (index 4)
			if (orderData[4] == 0) { //unacknowledged
				order.style.background = "#ffa099";
			}
			else if (orderData[4] == 1) { //accepted
				order.style.background = "#fcff59";
			}
			else if (orderData[4] == 2) { //shipped
				order.style.background = "#89e687";
			}
			else { //rejected or error
				order.style.background = "#e9e9e9"; 
			}
			
			order.appendChild(document.createTextNode("Order# " + orderData[0]));
			order.appendChild(document.createElement("br"));
			order.appendChild(document.createTextNode(orderData[3]));
			if (x == 0) { //only add onclick functionality to main dialog
				order.setAttribute("onclick", "getOrder(" + orderData[0] + ", showOrder, 1)");
			}
			
			//make sideways scrollable list for map dialog
			if (x == 1) {
				order.setAttribute("class", "sidewaysScroll");
			}
			
			orderList[x].appendChild(order);
			orderID++;
		}
	}
}

function showOrder(data) {
	var orderData = data.split("/");
	var itemList = orderData[1].split(",");
	var optionList = orderData[2].split(",");
	var orderContent = document.getElementById("order_content_content");
	orderContent.innerHTML = "";
	
	//go through items and list them
	for (var z = 0; z < itemList.length; z++) {
		var item = document.createElement("li");
		var checkbox = document.createElement("input");
		
		getItem(itemList[z], 0);
		alert(itemList[z]); //----------------------------------------------------------------------> ASYNC ERROR
		
		checkbox.setAttribute("type","checkbox");
		checkbox.setAttribute("id", z);

		if (orderData[4] == 0) {
			//disable checkbox if order not accepted -> 
			//	0 means not accepted
			//	1 means accepted
			//	-1 means rejected
			//	2 means shipped
			checkbox.setAttribute("disabled", "true");
		}
		
		//change action buttons based on order status
		modButtons();
		
		item.appendChild(checkbox);
		item.appendChild(document.createElement("br"));
		item.appendChild(document.createTextNode(buffer));
		item.appendChild(document.createTextNode(" [Item# " + itemList[z] + "]"));
		item.appendChild(document.createElement("br"));
		item.appendChild(document.createTextNode("Options: "));
		item.appendChild(document.createTextNode(optionList[z]));
		orderContent.appendChild(item);
	}
}

// - MISCELLANEOUS
//
//CHAT FUNCTIONALITY (fake)

function switchChat() { 
	
	//toggles between operator and customer chat
	//an animation would be nice but I have a midterm
	
	var title = document.getElementById("chat_title");
	if (title.innerHTML.includes("Operator")) {
		title.innerHTML = "Customer Chat";
	}
	else {
		title.innerHTML = "Operator Chat";
	}
	var img = document.createElement("img");
	img.setAttribute("class","chat_switch");
	img.setAttribute("src","misc/switch.svg");
	img.setAttribute("onclick","switchChat()");
	title.appendChild(img);
}

function sendMessage() {
	//first check if messagebox is empty
	if (document.getElementById("msg").value == "") {
		document.getElementById("msg").placeholder = "REQUIRED FIELD";
		document.getElementById("msg").style.border = "solid red";
		return;
	}
	else {
		document.getElementById("msg").style.border = "";
	}
	
	var message = "ME :: " + document.getElementById("msg").value;
	
	//check if message history tab is empty
	var messageHistory = document.getElementById("msgHist");
	
	if (messageHistory.value == "No messages yet") {
		messageHistory.value = message;
	}
	else {
		messageHistory.value = messageHistory.value + "\n" + message;
	}
	
	//clear message input field
	document.getElementById("msg").value = "";
	document.getElementById("msg").placeholder = "Enter message...";
}

//ACCEPT/REJECT ORDER

function acceptReject(i) {
	//if no order is selected then do nothing
	if (activeOrder == 0) {
		return;
	}
	
	if (i) {
		modOrderStatus(activeOrder, 1);
		modButtons();
	}
	else {
		modOrderStatus(activeOrder, -1);
		modButtons();
	}
	
	loadOrders();
	alert("done orders [" + activeOrder + "]");
	getOrder(activeOrder, showOrder, 0);
}

//BUTTON MANAGEMENT

function problem() {
	alert("Not implemented yet");
}

function ship() {
	var itemList = document.getElementById("order_content_content").getElementsByTagName("li");
	alert(itemList);
	var checkBoxes = 0;
	for (var z = 0; z < itemList.length; z++) {
		var checkbox = document.getElementById(z);
		alert("1");
		if (checkbox.checked) {
			checkBoxes++;
		}
		alert("2");
	}
	if (checkBoxes == itemList.length) {
		alert("Item shipped!");
		modOrderStatus(activeOrder, 2); //set order status to shipped
		loadOrders();
	}
	else {
		alert("Please ensure you have checked off all items before shipping");
	}
}

function modButtons() {
	
	//This function looks up the active order and generates the action buttons accordingly
	
	getOrder(activeOrder, parseOrderData, 0); //update order buffer
	var orderActions = document.getElementById("order_actions");
	orderActions.innerHTML = "";
	
	if (orderData[4] == 0) { //unacknowledged 
		//show accept/reject buttons 
		var acceptButton = document.createElement("button");
		acceptButton.setAttribute("class","halfButton");
		acceptButton.setAttribute("onclick","acceptReject(1)");
		acceptButton.setAttribute("style", "background:#89e687");
		acceptButton.appendChild(document.createTextNode("Accept"));
		orderActions.appendChild(acceptButton);
		
		orderActions.appendChild(document.createTextNode(" ")); //looks better like this
		
		var rejectButton = document.createElement("button");
		rejectButton.setAttribute("class","halfButton");
		rejectButton.setAttribute("onclick","acceptReject(0)");
		rejectButton.setAttribute("style", "background:#ffa099");
		rejectButton.appendChild(document.createTextNode("Reject"));
		orderActions.appendChild(rejectButton);
		
		var problemButton = document.createElement("button");
		problemButton.setAttribute("class","fullButton");
		problemButton.setAttribute("onclick","problem()");
		problemButton.appendChild(document.createTextNode("Report Problem"));
		orderActions.appendChild(problemButton);
	}
	else if (orderData[4] == 1) { //accepted
		//show ship and problem buttons
		var shipButton = document.createElement("button");
		shipButton.setAttribute("class","shipButton");
		shipButton.setAttribute("onclick","ship()");
		shipButton.appendChild(document.createTextNode("Ship!"));
		orderActions.appendChild(shipButton);

		var problemButton = document.createElement("button");
		problemButton.setAttribute("class","fullButton");
		problemButton.setAttribute("onclick","problem()");
		problemButton.appendChild(document.createTextNode("Report Problem"));
		orderActions.appendChild(problemButton);
	}
	else { //shipped or error
		//replace all buttons with problem button 
		var problemButton = document.createElement("button");
		problemButton.setAttribute("style","width:100%;height:115px;border:none;");
		problemButton.setAttribute("onclick","problem()");
		problemButton.appendChild(document.createTextNode("Report Problem"));
		orderActions.appendChild(problemButton);
	}
}