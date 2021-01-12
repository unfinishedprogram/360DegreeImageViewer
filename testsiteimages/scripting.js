    function openFiles(){
    var images = document.getElementById('import_panoramas').files;
    document.getElementById('image_upload_button_container').style.display = "none";
    imageCont = document.getElementById('uploaded_images_container');
    function readFile(index){
        var reader = new FileReader();
        if(index >= images.length-1){return;}

        reader.onload = function(e){
            insertImage(imageCont, reader.result)
            readFile(index+1); //Recursion
        }
        reader.readAsDataURL(images[index]);
        
    }
    readFile(0);
}

function insertImage(element, image){
    let img_elm = document.createElement('img');
    img_elm.src = image;
    img_elm.classList.add('uploaded_preview_image');
    img_elm.onclick = function(){
        choseImage(image)
    };
    element.appendChild(img_elm);
}

function choseImage(image){
    let img_elm = document.createElement('img');
    img_elm.src = image;
    img_elm.style.width = '500px';
    document.body.appendChild(img_elm);
}