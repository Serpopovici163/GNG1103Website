<?php
$mysqli = new mysqli("localhost", "root", "usbw", "test");
if($mysqli->connect_error) {
  exit('Could not connect');
}

$sql = "SELECT * FROM orders";

if ($stmt = $mysqli->prepare($sql)) {
	$stmt->execute();
	$stmt->store_result();
	$stmt->fetch();
	$stmt->close();
}
else {
	printf("error: %s\n", $mysqli->error);
}

echo var_dump($stmt);
?> 