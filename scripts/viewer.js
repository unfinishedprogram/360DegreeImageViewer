function panoViewerInstance(parent_element) {
    this.panoramas = []
    this.renderer = new THREE.WebGLRenderer();
    this.mouse = new THREE.Vector2();
    this.mouseBool = false;
    this.oldMouse = new THREE.Vector2();
    this.pickPosition = new THREE.Vector2();
    this.renderer_container = document.getElementById(parent_element);
    this.pano_group;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, rendererContainer.clientWidth / rendererContainer.clientHeight, 0.1, 1000);
    this.raycaster = new THREE.Raycaster();


    this.createPanoMat = function(image){
        texture = THREE.ImageUtils.loadTexture(image); //Loading the texture
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = -1; //Mirroring to correct
        return new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture, side: THREE.DoubleSide });
    }

    this.initalize = function() {
        document.addEventListener('keydown', this.keyPressed);
        this.renderer.domElement.addEventListener('mousemove', this.mouseMove);
        this.renderer.domElement.addEventListener('mousedown', this.mouseDown);
        this.renderer.domElement.addEventListener('mouseup', this.mouseUp);
        this.renderer.domElement.addEventListener('click', this.moveSphere);

        this.renderer.setSize(this.renderer_container.clientWidth, this.renderer_container.clientHeight);
        this.renderer_container.appendChild(this.renderer.domElement);

        var sphere_geo = new THREE.SphereBufferGeometry(1, 64, 32);

        panoMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        panosphere = new THREE.Mesh(sphere_geo, panoMat);
        panosphere.name = "panosphere";
        //var panoDot = new THREE.Mesh(dot, defMat);

        scene.add(panosphere);
        //scene.add(panoDot);
    }

    this.mouseMove = function(e) {
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

    this.getCanvasRelativePosition = function(e) {
        var canvas = renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * canvas.width / rect.width,
            y: (e.clientY - rect.top) * canvas.height / rect.height,
        };
    }

    this.setPickPosition = function(e) {
        const pos = getCanvasRelativePosition(e);
        pickPosition.x = (pos.x / renderer.domElement.width) * 2 - 1;
        pickPosition.y = (pos.y / renderer.domElement.height) * -2 + 1;  // note we flip Y
    }

    this.moveSphere = function(e) {
        setPickPosition(e);

        this.raycaster.setFromCamera(pickPosition, camera);
        this.panoDot.position.copy(raycaster.ray.direction);
    }

    this.mouseDown = function(e) {
        this.mouseBool = true;
    }

    this.mouseUp = function(e) {
        this.mouseBool = false;
    }

    this.resizeWindow = function() {
        this.renderer.setSize(this.rendererContainer.clientWidth, this.rendererContainer.clientHeight);
        this.camera.aspect = rendererContainer.clientWidth / rendererContainer.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    this.keyPressed = function(e) {
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

    animate = function() {
        requestAnimationFrame(animate);
        this.renderer.render(this.scene, this.camera);
    }
    animate();
}

