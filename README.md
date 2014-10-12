yo-angular-php-crud
===================

A sample Yeoman application with an integrated Slim PHP CRUD API.

## Generate some data

It's assumed in this tutorial that you have a MySQL database called `cars_demo` with a table called `cars`, with 5 columns -- `id`, `make`, `model`, `package`, `year`. To give yourself something to work with, add at least one entry right now. Perhaps your favorite car, your dream car and the one you own today.

1. Create the table:

    ```sql
    CREATE TABLE IF NOT EXISTS `cars` (
     `id` int(11) NOT NULL AUTO_INCREMENT,
     `make` varchar(50) NOT NULL,
     `model` varchar(50) NOT NULL,
     `pkg` varchar(50) NOT NULL,
     `year` varchar(50) NOT NULL,
     PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;
    ```

1. Insert some samples:

    ```sql
    INSERT INTO `cars` (`make`, `model`, `pkg`, `year`) VALUES
    ('Ford', 'Escape', 'xlt', '2009'),
    ('Porsche', '918', 'Spyder', '2013');
    ```

## Setting up the app

1. Read more about [yo](http://yeoman.io/) and [AngularJS](https://angularjs.org/).

1. Create your yo application (any will do, I just went with AngularJS).

    ```sh
    yo angular:app myWebApp
    ```

1. Open the generated .gitignore and add the following after all the rest (we'll be using [composer](https://getcomposer.org/) for our PHP dependencies):

    ```sh
    composer.phar
    vendor/
    ```

1. Add a cars route:

    ```sh
    yo angular:route cars
    ```

1. Because we're hosting a php api we're going to need a php server instead of the [Connect](https://github.com/senchalabs/connect) node server that comes bundled with Yeoman. To do this we're going to install [grunt-php](https://github.com/sindresorhus/grunt-php):

    ```sh
    npm install --save-dev grunt-php
    ```

1. Grunt-php (above) claims to be a drop in replacement for grunt-contrib-connect, so with that in mind, I just replaced all instances of the word `connect` in my `Gruntfile.js` with the word `php` and it works (for the most part).

1. While in the `Gruntfile.js`, we'll add our soon-to-be created `api` folder to `copy.dist.files[0].src`:

    ```js
    src: [
        '*.{ico,png,txt}',
        '.htaccess',
        
        ...

        'fonts/*',
        // add the api folder here
        'api/**'
    ]
    ```

1. Also, at `php.options`, add the base folder for our future php script to run from:

    ```js
      options: {
        port: 9000,

        ...

        // add the base folder to run php scripts from
        base:'<%= yeoman.app %>'
      },
    ```

1. Now edit the `.bowerrc` file and change the bower components path to point to `app/`:

    ```js
    {
      "directory": "app/bower_components"
    }
    ```

1. And move the bower folder to the app folder:

    ```sh
    mv bower_components app/
    ```

1. Run `grunt serve` to ensure the PHP server is working (be mindful of [this issue](https://github.com/yeoman/generator-angular/issues/841))

1. Go to `http://localhost:9000/#/cars` to check that the route renders.

1. We'll come back to the front-end later.

## Installing the Slim Framework

1. Read more about [Slim](http://www.slimframework.com/) and [composer](https://getcomposer.org/).

1. In the root of the `app` directory, make a directory called `api`:

    ```sh
    mkdir app/api
    ```

1. Change over the `api` directory install composer locally (if it's not installed globally already):

    ```sh
    curl -s https://getcomposer.org/installer | php
    ```

1. Make a new `composer.json` file and include the Slim dependency:

    ```sh
    {
        "require": {
            "slim/slim": "2.*"
        }
    }
    ```

1. Install Slim via composer:

    ```sh
    php composer.phar install
    ```

## Setting up the Slim PHP API

1. In the `app/api` directory, make a new `index.php` file and add the following:

    ```php
    &lt;?php
    require 'vendor/autoload.php';
    ```

    This will allow all classes found in the vendor folder to be loaded automatically.

1. Next we'll make a new instance of Slim:

    ```php
    $app = new \Slim\Slim();
    ```

1. Define some restful endpoints for dealing with cars using Slim's convenience methods for HTTP verbs, and run the slim application:

    ```php
    $app->get('/cars', 'getCars');
    $app->get('/cars/:id', 'getCar');
    $app->post('/cars', 'addCar');
    $app->put('/cars/:id', 'updateCar');
    $app->delete('/cars/:id', 'deleteCar');

    $app->run();
    ```

1. Define a connection function:

    ```php
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
    ```

1. Define each of the restful functions:

    Create a car...
    ```php
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
    ```

    Read all cars...
    ```php
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
    ```

    Read one car...
    ```php
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
    ```

    Update a car...
    ```php
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
    ```

    Delete a car...
    ```php
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
    ```

1. Test that your api works. I use [Postman](http://www.getpostman.com/).

## Creating our Interface in AngularJS

#### Installing and applying Restangular

1. To consume our restful endpoints I was going to create a factory that added some syntactic sugar to either `$http` or `$resoure`, but then I found [Restangular](https://github.com/mgonto/restangular) and figured there was no point reinventing the reinvented wheel. We're going to use Restangular, which depends on lodash, so we need to include both in our project.

    Install...
    ```sh
    bower install restangular lodash --save
    ```

    ... and wire them into your app...
    ```sh
    grunt wiredep
    ```

1. We need to include Restangular as a dependency in our app module. Edit your `app/scripts/app.js` and add `'restangular'` to the list.:

    ```js
    .module('yoAngularPhpCrudApp', [
        'ngAnimate',
        'ngCookies',
        ...
        'ngTouch',
        'restangular'
    ])
    ```

1. We'll set a global configuration for Restangular in the same file, after our $routeProvider config. This isn't necessary, but we're making the assumption that all our restful calls will be made from the `api` route, therefore saving us a few bytes later on:

    ```js
    .config(function (RestangularProvider) {
        RestangularProvider.setBaseUrl('/api/');
    })
    ```

1. We now have the `Restangular` service available for injecting into our Angular objects. Let's inject Restangular into our cars controller. Edit `app/scripts/controllers/cars.js`:

    ```js
    .controller('CarsCtrl', function ($scope, Restangular) {
    ```

#### Creating handlers in our Cars Controller

1. Let's create our first Restangular object. In the body of our `CarsCtrl`, add the following:

    ```js
    var url = 'cars';
    var Cars = Restangular.all(url);
    ```

1. Next we'll add a `blankCar` object that will help us clear out our model from time to time.

    ```js
    var blankCar = {
      make:"",
      model:"",
      pkg:"",
      year:""
    };
    ```

1. And then a function expression that will get our initial data for us, using Restangular convenience methods, and serve to refresh our data with each digest cycle:

    ```js
    var refreshCars = function() {
      $scope.isEditVisible = false;
      $scope.isAddNewCar = false;
      Cars.getList().then(function(data) {
          console.log('--> api/cars called from refreshCars()');
          $scope.cars = data;
      });
    };
    ```

1. Now let's get to creating our `$scope` objects. We'll start with some function expressions that set a few flags for us to help set and determine various states:

    ```js
    $scope.showAdd = function () {
      if ($scope.isEditVisible === false) {
          $scope.isAddNewCar = true;
      }
    };

    $scope.hideAdd = function () {
      $scope.isAddNewCar = false;
      $scope.newCar = angular.copy($scope.blankCar);
    };

    $scope.showEdit = function (idx) {
      $scope.isEditVisible = idx;
      $scope.newCar = angular.copy(blankCar);
    };
    ```

1. Now we'll add the methods for our remaining HTTP verbs, post, put and delete. Again, we'll use Restangular awesomeness:

    ```sh
    $scope.saveCar = function() {
      $scope.isEditVisible = false;
      $scope.isAddNewCar = false;
      Cars.post($scope.newCar).then(function (data) {
          $scope.cars.push(data);
          console.log('--> newCar saved!');
      },
      function () {
          console.log('--> Could not save newCar!');
      });
    };

    $scope.updateCar = function(idx) {
      $scope.isAddNewCar = false;
      Cars.getList().then(function(data) {
          console.log('--> api/cars called from updateCar()');
          $scope.cars = data;
          var carWithId = _.find($scope.cars, function(car) {
              return car.id === $scope.cars[idx].id;
          });

          carWithId.make = $scope.newCar.make || carWithId.make;
          carWithId.model = $scope.newCar.model || carWithId.model;
          carWithId.pkg = $scope.newCar.pkg || carWithId.pkg;
          carWithId.year = $scope.newCar.year || carWithId.year;
          carWithId.put();
          $scope.isEditVisible = false;
      });
    };

    $scope.deleteCar = function(idx) {
      var car = Restangular.one(url, $scope.cars[idx].id);
      car.remove();
      $scope.cars.splice(idx, 1);
    };
    ```

1. Finally, we'll run our `refreshCars()` method:

    ```js
    refreshCars();
    ```

#### Creating our View

I'm not going to go into a whole lot of detail here about the various things that are happening, but I will point out a few of the basic ideas.

In addition to adding new cars within the view, we're employing an edit-in-place methodology so the cars we do create can be edited within that same view as well. This will allow for a better user experience than shuffling the user off to different views to add and edit entries.

However, there are a lot of things to consider when using one view for multiple tasks, namely preventing users from being able to add a new car and edit another one at the same time. Or preventing users from performing actions on any of the other entries while editing another.

So as you read through the code, have a look at some of the directives in use and some of the logic used to show and hide various components and disable others, depending on the current actions being performed.

```html
<div class="carsContainer">
    <button ng-click="showAdd()" type="button" class="btn btn-sm btn-primary" ng-disabled="isAddNewCar || isEditVisible !== false" aria-hidden="true"><i class="glyphicon glyphicon-plus"></i> Add Car</button>
    <form novalidate="novalidate" class="form-horizontal">
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>pkg</th>
                    <th>Year</th>
                    <th class="text-center">
                        <span ng-hide="isAddNewCar || isEditVisible !== false">Delete</span>
                        <span ng-show="isAddNewCar || isEditVisible !== false">Cancel</span>
                    </th>
                    <th class="text-center">
                        <span ng-hide="isAddNewCar || isEditVisible !== false">Edit</span>
                        <span ng-show="isAddNewCar || isEditVisible !== false">Save</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr ng-show="isAddNewCar">
                    <td>#</td>
                    <td><input ng-model="newCar.make" type="text" class="form-control"/></td>
                    <td><input ng-model="newCar.model" type="text" class="form-control"/></td>
                    <td><input ng-model="newCar.pkg" type="text" class="form-control"/></td>
                    <td><input ng-model="newCar.year" type="text" class="form-control"/></td>
                    <td class="text-center">
                        <button ng-click="hideAdd()" type="button" class="btn btn-sm btn-warning" aria-hidden="true">
                            <i class="glyphicon glyphicon-ban-circle"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button ng-click="saveCar()" type="submit" class="btn btn-sm btn-success" aria-hidden="true">
                            <i class="glyphicon glyphicon-ok"></i>
                        </button>
                    </td>
                </tr>
                <tr ng-repeat="car in cars">
                    <td>{{$index + 1}}</td>
                    <td>
                        <span ng-hide="isEditVisible === $index">{{car.make}}</span>
                        <input ng-show="isEditVisible === $index" ng-model="newCar.make" type="text" class="form-control" ng-value="{{car.make}}" placeholder="{{car.make}}"/>
                    </td>
                    <td>
                        <span ng-hide="isEditVisible === $index">{{car.model}}</span>
                        <input ng-show="isEditVisible === $index" ng-model="newCar.model" type="text" class="form-control" ng-value="{{car.model}}" placeholder={{car.model}}/>
                    </td>
                    <td>
                        <span ng-hide="isEditVisible === $index">{{car.pkg}}</span>
                        <input ng-show="isEditVisible === $index" ng-model="newCar.pkg" type="text" class="form-control" ng-value="{{car.pkg}}" placeholder="{{car.pkg}}"/>
                    </td>
                    <td>
                        <span ng-hide="isEditVisible === $index">{{car.year}}</span>
                        <input ng-show="isEditVisible === $index" ng-model="newCar.year" type="text" class="form-control" ng-value="{{car.year}}" placeholder="{{car.year}}"/>
                    </td>
                    <td class="text-center">
                        <button ng-hide="isEditVisible === $index" ng-click="deleteCar($index)" type="button" ng-disabled="isAddNewCar || isEditVisible !== false" class="btn btn-sm btn-link">
                            <i class="glyphicon glyphicon-trash"></i>
                        </button>
                        <button ng-show="isEditVisible === $index" ng-click="showEdit(false)" type="button" class="btn btn-sm btn-warning" aria-hidden="true">
                            <i class="glyphicon glyphicon-ban-circle"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button ng-hide="isEditVisible === $index" ng-click="showEdit($index)" type="button" ng-disabled="isAddNewCar" class="btn btn-sm btn-link">
                            <i class="glyphicon glyphicon-pencil"></i>
                        </button>
                        <button ng-show="isEditVisible === $index" ng-click="updateCar($index)" type="submit" class="btn btn-sm btn-success" aria-hidden="true">
                            <i class="glyphicon glyphicon-ok"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </form>
</div>
```
