if (Detector.webgl) {
    init();
    animate();
} else {
    var warning = Detector.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}

var scene, camera, renderer;

function init() {
    scene = new THREE.Scene();

    // Create Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20000);
    camera.position.set(0, 0, 50);
    scene.add(camera);

    // Create Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1);
    document.body.appendChild(renderer.domElement);

    // Create Axis
    var material = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-100, 0, 0));
    geometry.vertices.push(new THREE.Vector3(100, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 100, 0));
    geometry.vertices.push(new THREE.Vector3(0, -100, 0));
    var line = new THREE.Line(geometry, material);
    scene.add(line);

    // Create a light, set its position, and add it to the scene.
    var light = new THREE.PointLight(0x000000);
    light.position.set(-100, 200, 100);
    scene.add(light);

    // Add OrbitControls for panning around with the mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

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
