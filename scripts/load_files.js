// Returns a list containing the loaded files
function load_files(element_id) {
    let loaded_files = [];
    let files = document.getElementById(element_id).files;

    function readFile(index) {
        var reader = new FileReader();
        if (index >= files.length - 1) { return; }
        reader.onload = function (e) {
            loaded_files.push(e.target.result);
            readFile(index + 1); //Recursion
        }
        reader.readAsDataURL(files[index]);
    }
    readFile(0);
    return loaded_files
}