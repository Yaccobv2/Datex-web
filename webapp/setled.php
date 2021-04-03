<?php
	//ini_set('display_errors',1);
	//error_reporting(E_ALL);
	header('Access-Control-Allow-Origin: http://localhost');
    header('Content-Type: application/json; charset=utf-8');
	
	function ledIndexToTagConverter($x, $y){
		return "LED" .$x .$y;
	}
	
	$ledDisplay = array();
	$ledDisplayDataFile = '/home/pi/server_examples/webapp/data/leddata.json';
	
	$n=0;
	
	for ($i=0; $i<8; $i++){
		for ($j=0; $j<8; $j++){
			$ledTag=ledIndexToTagConverter($i, $j);
			if(isset($_POST[$ledTag])){
				$ledDisplay[$n] = json_decode($_POST[$ledTag]);
				$n=$n+1;
			}
		}
	}
	
	$ledDisplayJson=json_encode($ledDisplay);
	$dataFile = fopen($ledDisplayDataFile, 'w+') or die("ERR1");
	fwrite($dataFile, $ledDisplayJson);
	fclose($dataFile);
	
	echo "ACK1 ";
	exec("sudo ./setled.py");
	echo "ACK2 ";
?>