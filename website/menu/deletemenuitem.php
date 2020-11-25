<?php
$mysqli = new mysqli("localhost", "root", "usbw", "test");
if($mysqli->connect_error) {
  exit('Could not connect');
}

$sql = "DELETE FROM menu WHERE itemID = ?";

if ($stmt = $mysqli->prepare($sql)) {
	$stmt->bind_param("i", $_GET['itemID']);
	$stmt->execute();
	$stmt->close();
}
else {
	printf("error: %s\n", $mysqli->error);
}
?> 