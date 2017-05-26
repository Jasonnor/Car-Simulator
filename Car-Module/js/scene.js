if (Detector.webgl) {
    init();
    animate();
} else {
    var warning = Detector.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}

var scene, camera, renderer, controls;

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

    // Create a light, set its position, and add it to the scene.
    var light = new THREE.PointLight(0x000000);
    light.position.set(-100, 200, 100);
    scene.add(light);

    // Add OrbitControls for panning around with the mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Draw Axis
    var material = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-100, 0, 0));
    geometry.vertices.push(new THREE.Vector3(100, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 100, 0));
    geometry.vertices.push(new THREE.Vector3(0, -100, 0));
    var axis = new THREE.Line(geometry, material);
    scene.add(axis);

    // Draw Map
    var map = [
        [-6, 0, -6, 22],
        [-6, 22, 18, 22],
        [18, 22, 18, 37],
        [6, 0, 6, 10],
        [6, 10, 30, 10],
        [30, 10, 30, 37]
    ];
    var planeHeight = 6;
    THREE.ImageUtils.crossOrigin = "";
    var image = document.createElement('img');
    image.src = './Car-Module/src/texture_wall.jpg';
    var texture = new THREE.Texture(image);
    texture.needsUpdate = true;
    var material = new THREE.MeshBasicMaterial({
        map: texture
    });

    map.forEach(function (coordinate) {
        geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(coordinate[0], coordinate[1], 0),
            new THREE.Vector3(coordinate[2], coordinate[3], 0),
            new THREE.Vector3(coordinate[2], coordinate[3], planeHeight),
            new THREE.Vector3(coordinate[0], coordinate[1], planeHeight)
        );
        geometry.faces.push(
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(2, 3, 0)
        );
        var plane = new THREE.Mesh(geometry, material);
        scene.add(plane);
    });

    // Create Sphere
    var geometry = new THREE.SphereGeometry(3, 32, 32);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff00ff
    });
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 3);
    scene.add(sphere);

    // Create an event listener that resizes the renderer with the browser window.
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}
