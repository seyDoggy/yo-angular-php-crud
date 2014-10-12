
<?php
require 'vendor/autoload.php';

$app = new \Slim\Slim();

$app->get('/cars', 'getCars');
$app->get('/cars/:id', 'getCar');
$app->post('/cars', 'addCar');
$app->put('/cars/:id', 'updateCar');
$app->delete('/cars/:id', 'deleteCar');

$app->run();

function getConnection() {
    $dbhost="localhost";
    $dbport="8889";
    $dbuser="root";
    $dbpass="root";
    $dbname="cars_demo";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

function getCars() {
    $sql = "select * FROM cars ORDER BY id";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $cars = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($cars);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getCar($id) {
    $sql = "select * FROM cars WHERE id=".$id." ORDER BY id";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $cars = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($cars);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function addCar() {
    $app = \Slim\Slim::getInstance();
    $req = $app->request();
    $car = json_decode($req->getBody());

    $sql = "INSERT INTO cars (make, model, year, pkg) VALUES (:make, :model, :year, :pkg)";

    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("make", $car->make);
        $stmt->bindParam("model", $car->model);
        $stmt->bindParam("year", $car->year);
        $stmt->bindParam("pkg", $car->pkg);
        $stmt->execute();
        $car->id = $db->lastInsertId();
        $db = null;
        echo json_encode($car);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function updateCar($id) {
    $app = \Slim\Slim::getInstance();
    $req = $app->request();
    $car = json_decode($req->getBody());

    $sql = "UPDATE cars SET make=:make, model=:model, year=:year, pkg=:pkg WHERE id=:id";

    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("make", $car->make);
        $stmt->bindParam("model", $car->model);
        $stmt->bindParam("year", $car->year);
        $stmt->bindParam("pkg", $car->pkg);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $db = null;
        echo json_encode($car);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function deleteCar($id) {
    $sql = "DELETE FROM cars WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
