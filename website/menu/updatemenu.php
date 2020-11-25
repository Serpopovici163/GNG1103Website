<?php
$mysqli = new mysqli("localhost", "root", "usbw", "test");
if($mysqli->connect_error) {
  exit('Could not connect');
}

$name = $_GET['name'];
$desc = $_GET['desc'];
$serv_size = $_GET['serv_size'];
$weight = $_GET['weight'];
$price = $_GET['price'];
$flav = $_GET['flav'];
$avail = $_GET['avail'];
$prep_time = $_GET['prep_time'];

$sql = "UPDATE menu SET name=$name, `desc`=$desc, serv_size=$serv_size, weight=$weight, price=$price, flav=$flav, avail=$avail, prep_time=$prep_time WHERE itemID = ?";

if ($stmt = $mysqli->prepare($sql)) {
	$stmt->bind_param("i", $_GET['itemID']);
	$stmt->execute();
	$stmt->close();
}
else {
	printf("error: %s\n", $mysqli->error);
}

echo $name;
?> 