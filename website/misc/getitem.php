<?php
$mysqli = new mysqli("localhost", "root", "usbw", "test");
if($mysqli->connect_error) {
  exit('Could not connect');
}

$sql = "SELECT itemID, name, `desc`, serv_size, weight, price, flav, avail, prep_time FROM menu WHERE itemID = ?";

if ($stmt = $mysqli->prepare($sql)) {
	$stmt->bind_param("i", $_GET['itemID']);
	$stmt->execute();
	$stmt->store_result();
	$stmt->bind_result($itemID, $name, $desc, $serv_size, $weight, $price, $flav, $avail, $prep_time);
	$stmt->fetch();
	$stmt->close();
}
else {
	printf("error: %s\n", $mysqli->error);
}


echo $name . "/" . $desc . "/" . $serv_size . "/" . $weight . "/" . $price . "/" . $flav . "/" . $avail . "/" . $prep_time;
?> 