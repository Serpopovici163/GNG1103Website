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

$sql = "INSERT INTO menu (name, `desc`, serv_size, weight, price, flav, avail, prep_time) VALUES ($name, $desc, $serv_size, $weight, $price, $flav, $avail, $prep_time)";

if ($mysqli->query($sql) === TRUE) {
	$mysqli->close();
}
else {
	printf("error: %s\n", $mysqli->error);
}
?> 