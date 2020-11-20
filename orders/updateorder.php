<?php
$mysqli = new mysqli("localhost", "root", "usbw", "test");
if($mysqli->connect_error) {
  exit('Could not connect');
}

$orderStatus = $_GET['orderStatus'];

$sql = "UPDATE orders SET orderStatus=$orderStatus WHERE orderID = ?";

if ($stmt = $mysqli->prepare($sql)) {
	$stmt->bind_param("i", $_GET['orderID']);
	$stmt->execute();
	$stmt->close();
}
else {
	printf("error: %s\n", $mysqli->error);
}
?> 