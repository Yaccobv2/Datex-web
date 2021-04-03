<?php
	$configText='';
	$configFile="__DIR__ . '/../data/config.json";
	$dataFile=fopen($configFile, 'w+') or die("Error");
	

	if(isset($_POST["ip"])){
		$configText='{"ip": "'.$_POST["ip"].'",';
	}
	else{
		$configText='{"ip": "192.168.56.20",';
	}
	
	if(isset($_POST["port"])){
		$configText=$configText.'"port": '.$_POST["port"].',';
	} else {
		$configText=$configText.'"port": 80, ';
	}
	
	if(isset($_POST["sampleTime"])){
		$configText=$configText.'"sampleTime": '.$_POST["sampleTime"].',';
	} else {
		$configText=$configText.'"sampleTime": 1,';
	}
	
	if(isset($_POST["sampleQuantity"])){
		$configText=$configText.'"sampleQuantity": '.$_POST["sampleQuantity"].'}';
	} else {
		$configText=$configText.'"sampleQuantity": 100}';
	}
	
	echo $configText;
	
	fwrite($dataFile, $configText);
	fclose($dataFile);
?>