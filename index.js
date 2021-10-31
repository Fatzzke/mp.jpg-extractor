
function readfile(element) {
    let file = document.querySelector('#inputfile').files[0];

    let fr2 = new FileReader();
    fr2.onload = function () {
        let fileblob = fr2.result;
        let filearray = new Uint8Array(fileblob);
        let index = getVideoIndex(filearray);
        if (index == -1) {
            document.getElementById('status').innerHTML = "Status: Video not found"
            return;
        }
        let videoblob = new Blob([fileblob.slice(index)], { tyoe: "video/mp4" });
        console.log(videoblob)
        let videoUrl = URL.createObjectURL(videoblob);
        document.getElementById('outputvid').src = videoUrl

        document.getElementById('status').innerHTML = "Status: Ok"
    }
    fr2.readAsArrayBuffer(file)

    let fr = new FileReader();
    fr.onload = function () {
        document.getElementById('output').src = fr.result

    }
    fr.readAsDataURL(file);

}

function getVideoIndex(filearray) {
    let fileTypeIsom = [0x69, 0x73, 0x6f, 0x6d];
    let fileTyoemp42 = [0x6d, 0x70, 0x34, 0x32];
    let found = false;
    let index = 0;
    // getting all ftyp indexes
    do{
    index = getFtypeIndex(index, filearray);
        if(index == -1)
            return -1;
    //checking if its a matching type

        //mp42
        for(let i = 0; i < fileTyoemp42.length; i++){
            if(filearray[index + i + 4] != fileTyoemp42[i]){
                break;
            }
            if(i == fileTyoemp42.length -1){
                console.log("type mp42 found")
                found = true;
                return index - 4;
            }
        }

        //isom
        for(let i = 0; i < fileTypeIsom.length; i++){
            if(filearray[index + i + 4] != fileTypeIsom[i]){
                break;
            }
            if(i == fileTypeIsom.length -1){
                console.log("type Isom found")
                found = true;
                return index - 4;
            }
        }

    } while(index != -1 ||  !found)

    return -1;
}


//returns index of FTYP. -1 If not found
//naive approach 
function getFtypeIndex(startIndex, filearray){
    let index = startIndex;
    let searchFTYP = [0x66, 0x74, 0x79, 0x70]; // ftyp search pattern
    let found = false;
    do {
        index = filearray.indexOf(searchFTYP[0], index)
        if (index == -1) {
            console.log("video not found")
            return -1
        }
        for (let i = 1; i < searchFTYP.length; i++) {

            if (filearray[index + i] != searchFTYP[i]) {
                index++;
                break;
            }
            if (i == searchFTYP.length - 1) {
                console.log("ftype found: " + index);
                found = true;
            }
        }

    } while (!found)
    return index 
}
