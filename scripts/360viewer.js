let imageIndex = 0;
var loadedImages = []
var loadedMats = []
var panoMat
var running = false;
var panosphere;
function openFiles() {
    var images = document.getElementById('fileExplorer').files;
    document.getElementById('fileExplorer').style.display = "none";
    function readFile(index) {
        var reader = new FileReader();
        if (index >= images.length - 1) { return; }

        reader.onload = function (e) {
            loadedMats.push(createPanoMat(e.target.result)); //Adding texture to the precompiled materials
            readFile(index + 1); //Recursion
        }
        reader.readAsDataURL(images[index]);
    }
    readFile(0);
    main();
}

function addImageToView(image){
    //loadedMats.push(createPanoMat(image));
    if (!running){
        main();
    }
    panosphere.material = createPanoMat(image);
    
}

function createPanoMat(image){
    texture = THREE.ImageUtils.loadTexture(image); //Loading the texture
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1; //Mirroring to correct
    return new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture, side: THREE.DoubleSide });
}

function main() {
    running = true;
    var mouse = new THREE.Vector2();
    var oldMouse = new THREE.Vector2();
    var pickPosition = new THREE.Vector2();
    var rendererContainer = document.getElementById('rendererContainer')

    document.addEventListener('keydown', keyPressed);
    var mouseBool = false;

    window.onresize = resizeWindow;

    function resizeWindow() {
        renderer.setSize(rendererContainer.clientWidth, rendererContainer.clientHeight);
        camera.aspect = rendererContainer.clientWidth / rendererContainer.clientHeight;
        camera.updateProjectionMatrix();
    }

    function keyPressed(e) {
        if (`${e.code}` == "KeyA") {
            if (imageIndex > 0) {
                imageIndex--;
            }
            panosphere.material = loadedMats[imageIndex];
        }
        if (`${e.code}` == "KeyD") {
            if (imageIndex < loadedMats.length - 1) {
                imageIndex++;
            }
            panosphere.material = loadedMats[imageIndex];
        }
    }

    function mouseMove(e) {
        oldMouse.copy(mouse);
        mouse = getCanvasRelativePosition(e);
        if (mouseBool && oldMouse.x && mouse.x && oldMouse.y && mouse.y) {
            camera.rotation.order = 'YXZ';
            camera.rotateY((oldMouse.x - mouse.x) / 360);
            camera.rotateX((oldMouse.y - mouse.y) / 360);
            camera.rotation.z = 0;


            oldMouse.x = mouse.x
            oldMouse.y = mouse.y
        }

        if (camera.rotation.y > 360) {
            camera.rotation.y = panosphere.rotation.y - 360;
        }

        if (camera.rotation.x > Math.PI / 2 - 0.5) {
            camera.rotation.x = Math.PI / 2 - 0.5;
        }
        if (camera.rotation.x < -(Math.PI / 2 - 0.5)) {
            camera.rotation.x = -(Math.PI / 2 - 0.5);
        }
    }

    function getCanvasRelativePosition(e) {
        var canvas = renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * canvas.width / rect.width,
            y: (e.clientY - rect.top) * canvas.height / rect.height,
        };
    }

    function setPickPosition(e) {
        const pos = getCanvasRelativePosition(e);
        pickPosition.x = (pos.x / renderer.domElement.width) * 2 - 1;
        pickPosition.y = (pos.y / renderer.domElement.height) * -2 + 1;  // note we flip Y
    }

    function moveSphere(e) {
        setPickPosition(e);

        raycaster.setFromCamera(pickPosition, camera);
        panoDot.position.copy(raycaster.ray.direction);
    }


    function mouseDown(e) {
        mouseBool = true;
    }
    function mouseUp(e) {
        mouseBool = false;
    }
    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(90, rendererContainer.clientWidth / rendererContainer.clientHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    var raycaster = new THREE.Raycaster();

    renderer.setSize(rendererContainer.clientWidth, rendererContainer.clientHeight);
    renderer.antialias = true;
    rendererContainer.appendChild(renderer.domElement);

    renderer.domElement.addEventListener('mousemove', mouseMove);
    renderer.domElement.addEventListener('mousedown', mouseDown);
    renderer.domElement.addEventListener('mouseup', mouseUp);
    renderer.domElement.addEventListener('click', moveSphere);


    var sphere = new THREE.SphereBufferGeometry(1, 64, 32);

    var dot = new THREE.SphereBufferGeometry(0.04, 32, 16);
    panoMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    defMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    panosphere = new THREE.Mesh(sphere, panoMat);
    panosphere.name = "panosphere";
    var panoDot = new THREE.Mesh(dot, defMat);


    scene.add(panosphere);
    scene.add(panoDot);
    panoDot.position.z = 1;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

}
