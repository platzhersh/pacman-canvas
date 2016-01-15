<?php header('Content-Type: application/json');

/* IMPORTANT:
 * change this to the main url of where you host the application, otherwise, every entry will be marked as a cheater
*/
$hostdomain = 'pacman.platzh1rsch.ch';

if (isset($_POST['action'])) {
	switch ($_POST['action']) {
		case 'get':
			if(isset($_POST['page'])) {
				echo getHighscore($_POST['page']);	
			} else {
				echo getHighscore();
			}
			break;
		case 'add':
			if(isset($_POST['name']) || isset($_POST['score']) || isset($_POST['level'])) 
				echo addHighscore($_POST['name'],$_POST['score'], $_POST['level']);
			break;
		case 'reset':
			echo resetHighscore();
			break;
		}
} else if (isset($_GET['action'])) {
	if ($_GET['action'] == 'get') {
		if(isset($_GET['page'])) {
			echo getHighscore($_GET['page']);	
		} else {
			echo getHighscore();
		}
	}
} else echo "define action to call";


function getHighscore($page = 1) {

	$db = new SQLite3('pacman.db');
	createDataBase($db);
	$results = $db->query('SELECT name, score FROM highscore WHERE cheater = 0 AND name != "" ORDER BY score DESC LIMIT 10 OFFSET ' . ($page-1)*10);
	while ($row = $results->fetchArray()) {
		$tmp["name"] = htmlspecialchars($row['name']);
		$tmp["score"] = strval($row['score']);
		$response[] = $tmp;		
	}
	if (!isset($response) || is_null($response)) {
		return "[]";
	} else {
		return json_encode($response);
	}
}

function addHighscore($name, $score, $level) {

	$db = new SQLite3('pacman.db');
	$date = date('Y-m-d h:i:s', time());
	createDataBase($db);
	$ref = isset($_SERVER[ 'HTTP_REFERER']) ? $_SERVER[ 'HTTP_REFERER'] : "";
	$ua = isset($_SERVER[ 'HTTP_USER_AGENT']) ? $_SERVER[ 'HTTP_USER_AGENT'] : "";
	$remA = isset($_SERVER[ 'REMOTE_ADDR']) ? $_SERVER[ 'REMOTE_ADDR'] : "";
	$remH = isset($_SERVER[ 'REMOTE_HOST']) ? $_SERVER[ 'REMOTE_HOST'] : "";

	// some simple checks to avoid cheaters
	$ref_assert = preg_match('/http:\/\/.*' . $hostdomain . '/', $ref) > 0;
	$ua_assert = ($ua != "");
	$cheater = 0;
	if (!$ref_assert || !$ua_assert) {
		$cheater = 1;
	}

	$maxlvlpoints_pills = 104 * 10;
	$maxlvlpoints_powerpills = 4 * 50;
	$maxlvlpoints_ghosts = 4 * 4 * 100;
	// check if score is even possible
	if ($level < 1) {
		$cheater = 1;
	} else if (($score / $level) > (1600 + 1240)) {
		$cheater = 1;
	}

	$name_clean = htmlspecialchars($name);
	$score_clean = htmlspecialchars($score);

	$db->exec('INSERT INTO highscore (name, score, level, date, log_referer, log_user_agent, log_remote_addr, log_remote_host, cheater) '
		. 'VALUES ("' 
			. $name . '", ' 
			. $score . ', ' 
			. $level . ', "' 
			. $date . '", "' 
			. $ref .'", "'
			. $ua . '", "'
			. $remA .'", "'
			. $remH . '", "'
			. $cheater
		.'")'
	);

	$response['status'] = "success";
	$response['level'] = $level;
	$response['name'] = $name;
	$response['score'] = $score;
	$response['cheater'] = $cheater;
	return json_encode($response);
}

function resetHighscore() {
	$db = new SQLite3('pacman.db');
	$date = date('Y-m-d h:i:s', time());
	$db->exec('DROP TABLE IF EXISTS highscore');
	createDataBase($db);
}

function createDataBase($db) {
	$db->exec('CREATE TABLE IF NOT EXISTS highscore(name VARCHAR(60),score INT, level INT, date DATETIME, log_referer VARCHAR(200), log_user_agent VARCHAR(200), log_remote_addr VARCHAR(200), log_remote_host VARCHAR(200), cheater BOOLEAN)');
}

?>