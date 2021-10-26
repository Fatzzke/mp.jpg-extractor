
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
    let searchpattern = [0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34, 0x32] // ftypmp42 first 4 bytes omitted for a better search pattern

    //naive approach 
    let index = 0
    let found = false;
    do {
        index = filearray.indexOf(searchpattern[0], index)
        if (index == -1) {
            console.log("video not found")
            return -1
            break;
        }
        for (let i = 1; i < searchpattern.length; i++) {

            if (filearray[index + i] != searchpattern[i]) {
                index++;
                break;
            }
            if (i == searchpattern.length - 1) {
                console.log("pattern found: " + index);
                found = true;
            }
        }

    } while (!found)

    return index = index - 4 //because we ignored the first 4 bytes in the pattern
}