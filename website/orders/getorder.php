<?php
$mysqli = new mysqli("localhost", "root", "usbw", "test");
if($mysqli->connect_error) {
  exit('Could not connect');
}

$sql = "SELECT orderID, orderContent, orderOptions, orderTime, orderStatus FROM orders WHERE orderID = ?";

if ($stmt = $mysqli->prepare($sql)) {
	$stmt->bind_param("i", $_GET['orderID']);
	$stmt->execute();
	$stmt->store_result();
	$stmt->bind_result($orderID, $orderContent, $orderOptions, $orderTime, $orderStatus);
	$stmt->fetch();
	$stmt->close();
}
else {
	printf("error: %s\n", $mysqli->error);
}

echo $orderID . "/" . $orderContent . "/" . $orderOptions . "/" . $orderTime . "/" . $orderStatus;
?> 