<?php header('Content-Type: application/json');

if (isset($_POST['action'])) {
	switch ($_POST['action']) {
		case 'get':
			echo getHighscore();
			break;
		case 'add':
			if(isset($_POST['name']) || isset($_POST['score'])) 
				addHighscore($_POST['name'],$_POST['score']);
			break;
		case 'reset':
			resetHighscore();
			break;
		}
} else if (isset($_GET['action'])) {
	if ($_GET['action'] == 'get') echo getHighscore();
} else echo "define action to call";


function getHighscore() {

	$db = new SQLite3('pacman.db');
	$db->exec('CREATE TABLE IF NOT EXISTS highscore(name VARCHAR(60),score INT, date DATETIME)');
	$results = $db->query('SELECT * FROM highscore LIMIT 10');
	while ($row = $results->fetchArray()) {
		$tmp["name"] = $row['name'];
		$tmp["score"] = strval($row['score']);
		$response[] = $tmp;		
	}
	if (!isset($response) || is_null($response)) return "[]";
	else return json_encode($response);
}

function addHighscore($name,$score) {

	$db = new SQLite3('pacman.db');
	$date = date('Y-m-d h:i:s', time());
	$db->exec('CREATE TABLE IF NOT EXISTS highscore(name VARCHAR(60),score INT, date DATETIME)');
	$db->exec('INSERT INTO highscore VALUES ("' . $name . '", ' . $score . ', "' . $date . '")');
	echo $name . ' added';
}

function resetHighscore() {
	$db = new SQLite3('pacman.db');
	$date = date('Y-m-d h:i:s', time());
	$db->exec('DROP TABLE IF EXISTS highscore');
	$db->exec('CREATE TABLE IF NOT EXISTS highscore(name VARCHAR(60),score INT, date DATETIME)');
	echo 'table reset';
}

?>