function panorama(image){
    this.image_data = image;
    this.material;

    this.load_mat = function(){
        texture = THREE.ImageUtils.loadTexture(image); //Loading the texture
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = -1; //Mirroring to correct
        this.material = THREE.MeshBasicMaterial({ color: 0xffffff, map: texture, side: THREE.DoubleSide });
    }
}