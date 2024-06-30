const BACKEND_LINK = 'https://c0ef-34-125-214-167.ngrok-free.app'; //Change if needed
const ADDRESS_DEFAULT = 'Nhà Văn hóa Sinh viên TP.HCM, Lưu Hữu Phước, Đông Hoà, Dĩ An, Bình Dương, Vietnam';

let base64String = document.getElementById('base64Input');
let boundingBoxes = null;

document.getElementById('fileInput').addEventListener('change', (event) => {
    let file = event.target.files[0]; //get file
    //reset everything
    let preview = document.getElementById('preview');
    preview.innerHTML = '';
    document.getElementById('status').innerText = '';
    document.getElementById('result').innerHTML = '';
    base64String.value = '';

    if (file) {
        let reader = new FileReader();
        
        reader.onload = function(e) {
            let img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);

            // Store the Base64 string in a hidden input
            base64String.value = e.target.result.split(',')[1];
        }
        //read the file --> decode to base64
        reader.readAsDataURL(file);
    }
});

document.getElementById('uploadForm').addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(base64String);
    if (!base64String.value) {
        document.getElementById('status').innerText = "No file selected.";
        return;
    }
    let payload = {
        "image": base64String.value,
        "time": new Date().toLocaleDateString(),
        "address": ADDRESS_DEFAULT
    };
    document.getElementById('status').innerText = "Uploading...";
    //Call to backend (ML model)
    fetch(BACKEND_LINK + "/process", {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin':  'http://127.0.0.1:5500',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Authorization',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('status').innerText = "";
        //Should return image (image with boudning box) + button for more details (not active)
        if (data.image) {
            let img = document.createElement('img');
            img.src = 'data:image/png;base64,' + data.image;
            document.getElementById('result').appendChild(img);
            // let button = document.createElement('button');
            // button.innerText = "Get Additional Info";
            // if (data.type === "grocery" || data.type === "restaurant") {
            //     //button next
            //     button.addEventListener('click', () => {
            //         getDetailedAnalysis("/" + data.type);
            //     });
            //     document.getElementById('result').appendChild(button);
            //     //Status next
            //     let additionalStatus = document.createElement('p');
            //     additionalStatus.id = 'nextStatus';
            //     document.getElementById('result').appendChild(additionalStatus);

            //     boundingBoxes = data.preds
            // } 
        } else {
            document.getElementById('status').innerText = "Upload failed!";
        }
        //console.log(data);
    })
    .catch(error => {
        document.getElementById('status').innerText = "Upload failed!";
        //console.error(error);
    });
});

// function getDetailedAnalysis(endpoint) {
//     document.getElementById('status').innerText = "Fetching additional info...";

//     payload = {
//         "image": base64String.value,
//         "time": boundingBoxes
//     };
//     fetch(BACKEND_LINK + endpoint, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(payload)
//     })
//     .then(response => response.json())
//     .then(data => {
//         document.getElementById('nextStatus').innerText = "";
//         if (data.info) {
//             let infoText = document.createElement('p');
//             infoText.innerText = data.info;
//             document.getElementById('result').appendChild(infoText);
//         } else {
//             document.getElementById('nextStatus').innerText = "Failed to fetch additional info!";
//         }
//         //console.log(data);
//     })
//     .catch(error => {
//         document.getElementById('status').innerText = "Failed to fetch additional info!";
//         //console.error(error);
//     });
// }
