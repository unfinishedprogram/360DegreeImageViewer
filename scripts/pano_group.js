function pano_group(){
    this.panoramas = [];
    
    this.add_panorama = function(pano){
        this.panoramas.push(pano)
    }
    
    this.load_materials = function(){
        for(let i = 0; i < this.panoramas.length; i++){
            this.panoramas[i].load_mat();
        }
    }
    
    this.add_panorama_list = function(pano_list){
        for(let i = 0; i < pano_list.length; i++){
            this.panoramas.push(pano_list[i]);
        }
    }
}