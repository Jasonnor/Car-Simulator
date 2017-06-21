var scene, camera, renderer, controls, car;
var posX = 0.0,
    posY = 0.0,
    rotX = 0.0,
    rotY = 0.0,
    angleWheel = 0.0,
    angleCar = 90.0,
    speed = 100,
    distanceCenter = 22,
    distanceRight = 8.4853,
    distanceLeft = 8.4853;

var geometrySensorCenter, lineSensorCenter, geometrySensorLeft, lineSensorLeft, geometrySensorRight, lineSensorRight;
var geometryTrajectory, trajectory, drawCount = 0;

var run = false,
    firstPerson = false,
    failure = false;

var map1 = [
        [-6, -13, 6, -13, 0, 1],
        [-6, -13, -6, 22, -1, 0],
        [-6, 22, 18, 22, 0, 1],
        [18, 22, 18, 50, -1, 0],
        [18, 50, 30, 50, 0, -1],
        [6, -13, 6, 10, 1, 0],
        [6, 10, 30, 10, 0, -1],
        [30, 10, 30, 50, 1, 0]
    ],
    end1 = [18, 37, 30, 37, 0, 1],
    map2 = [
        [-6, -13, 30, -13, 0, 1],
        [-6, -13, -6, 50, -1, 0],
        [-6, 50, 30, 50, 0, -1],
        [30, -13, 30, 50, 1, 0],
        [6, -13, 6, 37, 1, 0],
        [18, 0, 18, 50, 1, 0]
    ],
    end2 = [18, -13, 18, 0, 1, 0],
    map3 = [],
    end3 = [],
    map = map1,
    end = end1;

var wallHeight = 10,
    wallWidth = 2,
    walls = [],
    endline;

if (Detector.webgl) {
    init();
    animate();
    document.getElementById('preloader').style.display = 'none';
} else {
    var warning = Detector.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}

function init() {
    scene = new THREE.Scene();

    // Create Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20000);
    camera.position.set(0, 0, 120);
    scene.add(camera);

    // Create Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1);
    document.body.appendChild(renderer.domElement);

    // Create a light, set its position, and add it to the scene
    var light = new THREE.PointLight(0x000000);
    light.position.set(-100, 200, 100);
    scene.add(light);

    // Add OrbitControls for panning around with the mouse
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Draw Axis
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-500, 0, 0));
    geometry.vertices.push(new THREE.Vector3(500, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 500, 0));
    geometry.vertices.push(new THREE.Vector3(0, -500, 0));
    var material = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });
    var axis = new THREE.Line(geometry, material);
    scene.add(axis);

    // Draw Endline
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(end[0], end[1], 0));
    geometry.vertices.push(new THREE.Vector3(end[2], end[3], 0));
    geometry.computeLineDistances();
    var material = new THREE.LineDashedMaterial({
        color: 0xff0000,
        dashSize: 0.5,
        gapSize: 0.5,
        linewidth: 2
    });
    endline = new THREE.Line(geometry, material);
    scene.add(endline);

    // Draw Sensor
    geometrySensorCenter = new THREE.Geometry();
    geometrySensorCenter.vertices.push(new THREE.Vector3(0, 0, 3));
    geometrySensorCenter.vertices.push(new THREE.Vector3(0, 0, 3));
    var materialSensor = new THREE.LineBasicMaterial({
        color: 0xff0000,
        linewidth: 5
    });
    lineSensorCenter = new THREE.Line(geometrySensorCenter, materialSensor);
    scene.add(lineSensorCenter);

    geometrySensorRight = new THREE.Geometry();
    geometrySensorRight.vertices.push(new THREE.Vector3(0, 0, 3));
    geometrySensorRight.vertices.push(new THREE.Vector3(0, 0, 3));
    lineSensorRight = new THREE.Line(geometrySensorRight, materialSensor);
    scene.add(lineSensorRight);

    geometrySensorLeft = new THREE.Geometry();
    geometrySensorLeft.vertices.push(new THREE.Vector3(0, 0, 3));
    geometrySensorLeft.vertices.push(new THREE.Vector3(0, 0, 3));
    lineSensorLeft = new THREE.Line(geometrySensorLeft, materialSensor);
    scene.add(lineSensorLeft);

    // Draw Map
    var loader = new THREE.TextureLoader();
    loader.load('./Car-Module/src/texture_wall.jpg', function (texture) {
        material = new THREE.MeshBasicMaterial({
            map: texture
        });
        var count = 0;
        map.forEach(function (coordinate) {
            var xDistance = coordinate[2] - coordinate[0];
            var yDistance = coordinate[3] - coordinate[1];
            var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
            var radians = Math.atan2(yDistance, xDistance);
            geometry = new THREE.BoxGeometry(distance + Math.abs(coordinate[5] * wallWidth), wallWidth, wallHeight);
            walls[count] = new THREE.Mesh(geometry, material);
            walls[count].position.set((coordinate[0] + coordinate[2]) / 2 + coordinate[4] * wallWidth / 2 - coordinate[5] * wallWidth / 2,
                (coordinate[1] + coordinate[3]) / 2 + coordinate[5] * wallWidth / 2, wallHeight / 2);
            walls[count].rotateZ(radians);
            scene.add(walls[count]);
            ++count;
        });
    });

    // Draw Floor  
    var geometryFloor = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    loader = new THREE.TextureLoader();
    loader.load('./Car-Module/src/texture_floor.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(200, 200);
        material = new THREE.MeshBasicMaterial({
            map: texture
        });
        var floor = new THREE.Mesh(geometryFloor, material);
        floor.material.side = THREE.DoubleSide;
        floor.position.set(0, 0, -0.5);
        scene.add(floor);
    });

    // Create Car Sphere
    var sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
    loader = new THREE.TextureLoader();
    loader.load('./Car-Module/src/texture_rock.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(2, 2);
        material = new THREE.MeshBasicMaterial({
            map: texture
        });
        car = new THREE.Mesh(sphereGeometry, material);
        car.position.set(posX, posY, 3);
        //car.geometry.attributes.position.needsUpdate = true;
        scene.add(car);
    });

    //Draw Move Trajectory
    var positions = new Float32Array(30000);
    geometryTrajectory = new THREE.BufferGeometry();
    geometryTrajectory.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometryTrajectory.setDrawRange(0, Math.abs(drawCount / 3));
    var material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        linewidth: 4
    });
    trajectory = new THREE.Line(geometryTrajectory, material);
    scene.add(trajectory);

    // Create an event listener that resizes the renderer with the browser window.
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

function updateCamera() {
    // First Person
    if (document.getElementById('firstPerson').checked == true) {
        firstPerson = true;
    }
    // Third Person
    else if (document.getElementById('thirdPerson').checked == true) {
        firstPerson = false;
        camera.position.set(0, 0, 120);
    }
}

function updateMap(value) {
    switch (value) {
        case 'map1':
            map = map1;
            end = end1;
            break;
        case 'map2':
            map = map2;
            end = end2;
            break;
        case 'map3':
            map = map3;
            end = end3;
            break;
    }
    walls.forEach(function (wall) {
        scene.remove(wall);
    });
    var loader = new THREE.TextureLoader();
    loader.load('./Car-Module/src/texture_wall.jpg', function (texture) {
        material = new THREE.MeshBasicMaterial({
            map: texture
        });
        var count = 0;
        map.forEach(function (coordinate) {
            var xDistance = coordinate[2] - coordinate[0];
            var yDistance = coordinate[3] - coordinate[1];
            var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
            var radians = Math.atan2(yDistance, xDistance);
            geometry = new THREE.BoxGeometry(distance + Math.abs(coordinate[5] * wallWidth), wallWidth, wallHeight);
            walls[count] = new THREE.Mesh(geometry, material);
            walls[count].position.set((coordinate[0] + coordinate[2]) / 2 + coordinate[4] * wallWidth / 2 - coordinate[5] * wallWidth / 2,
                (coordinate[1] + coordinate[3]) / 2 + coordinate[5] * wallWidth / 2, wallHeight / 2);
            walls[count].rotateZ(radians);
            scene.add(walls[count]);
            ++count;
        });
    });
    scene.remove(endline);
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(end[0], end[1], 0));
    geometry.vertices.push(new THREE.Vector3(end[2], end[3], 0));
    geometry.computeLineDistances();
    var material = new THREE.LineDashedMaterial({
        color: 0xff0000,
        dashSize: 0.5,
        gapSize: 0.5,
        linewidth: 2
    });
    endline = new THREE.Line(geometry, material);
    scene.add(endline);
}

function degreeToRadian(degree) {
    return degree * Math.PI / 180.0;
}

function animate() {
    requestAnimationFrame(animate);
    var angleFix = angleCar - 90
    if (angleFix > 360)
        angleFix -= 360;
    else if (angleFix < 0)
        angleFix += 360;
    var angle = degreeToRadian(angleFix);
    if (typeof car != 'undefined') {
        car.position.set(posX, posY, 3);
        if (firstPerson) {
            car.rotation.set(0, 0, angle);
            var angle = degreeToRadian(angleCar);
            var relativeCameraOffset = new THREE.Vector3(0, -6, 6);
            var cameraOffset = relativeCameraOffset.applyMatrix4(car.matrixWorld);
            camera.position.x = cameraOffset.x;
            camera.position.y = cameraOffset.y;
            camera.position.z = cameraOffset.z;
            camera.lookAt(new THREE.Vector3(posX + 10.0 * Math.cos(angle), posY + 10.0 * Math.sin(angle), 6));
        } else {
            car.rotation.set(rotX, rotY, 0);
            controls.update();
        }
    }
    // Draw Sensor
    geometrySensorCenter.vertices[0].x = posX;
    geometrySensorCenter.vertices[0].y = posY;
    geometrySensorCenter.vertices[1].x = posX + distanceCenter * Math.cos(degreeToRadian(angleCar));
    geometrySensorCenter.vertices[1].y = posY + distanceCenter * Math.sin(degreeToRadian(angleCar));
    lineSensorCenter.geometry.verticesNeedUpdate = true;

    geometrySensorRight.vertices[0].x = posX;
    geometrySensorRight.vertices[0].y = posY;
    geometrySensorRight.vertices[1].x = posX + distanceRight * Math.cos(degreeToRadian(angleCar - 45));
    geometrySensorRight.vertices[1].y = posY + distanceRight * Math.sin(degreeToRadian(angleCar - 45));
    lineSensorRight.geometry.verticesNeedUpdate = true;

    geometrySensorLeft.vertices[0].x = posX;
    geometrySensorLeft.vertices[0].y = posY;
    geometrySensorLeft.vertices[1].x = posX + distanceLeft * Math.cos(degreeToRadian(angleCar + 45));
    geometrySensorLeft.vertices[1].y = posY + distanceLeft * Math.sin(degreeToRadian(angleCar + 45));
    lineSensorLeft.geometry.verticesNeedUpdate = true;

    // Draw Trajectory
    var positions = trajectory.geometry.attributes.position.array;
    positions[drawCount++] = posX;
    positions[drawCount++] = posY;
    positions[drawCount++] = 0;
    trajectory.geometry.setDrawRange(0, Math.abs(drawCount / 3));
    trajectory.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}
