function panoViewerInstance(parent_element) {
    this.panoramas = []
    this.renderer = new THREE.WebGLRenderer();
    console.log(this.renderer);
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

        this.renderer.setSize(this.renderer_container.clientWidth, this.renderer_container.clientHeight);
        this.renderer_container.appendChild(this.renderer.domElement);

        var sphere_geo = new THREE.SphereBufferGeometry(1, 64, 32);

        this.panoMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.panosphere = new THREE.Mesh(sphere_geo, this.panoMat);
        this.panosphere.name = "panosphere";
        //var panoDot = new THREE.Mesh(dot, defMat);

        this.scene.add(this.panosphere);

        animate();
        //scene.add(panoDot);
    }
   

    this.getCanvasRelativePosition = function(e) {
        var canvas = this.renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * canvas.width / rect.width,
            y: (e.clientY - rect.top) * canvas.height / rect.height,
        };
    }

    this.mouseMove = function(e) {
        this.mouse = this.getCanvasRelativePosition(e);
        this.oldMouse.copy(this.mouse);
        if (mouseBool && this.oldMouse.x && mouse.x && this.oldMouse.y && mouse.y) {
            this.camera.rotation.order = 'YXZ';
            this.camera.rotateY((this.oldMouse.x - mouse.x) / 360);
            this.camera.rotateX((this.oldMouse.y - mouse.y) / 360);
            this.camera.rotation.z = 0;

            this.oldMouse.x = this.mouse.x
            this.oldMouse.y = this.mouse.y
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

    

    this.setPickPosition = function(e) {
        const pos = getCanvasRelativePosition(e);
        pickPosition.x = (pos.x / this.renderer.domElement.width) * 2 - 1;
        pickPosition.y = (pos.y / this.renderer.domElement.height) * -2 + 1;  // note we flip Y
    }

    this.moveSphere = function(e) {
        this.setPickPosition(e);

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
        this.camera.aspect = this.rendererContainer.clientWidth / this.rendererContainer.clientHeight;
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
    this.initalize();
}

