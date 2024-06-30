const BACKEND_LINK = 'http://127.0.0.1:5000'; //Change if needed

document.getElementById('fileInput').addEventListener('change', (event) => {
    let file = event.target.files[0]; //get file
    //reset everything
    let preview = document.getElementById('preview');
    preview.innerHTML = '';
    document.getElementById('status').innerText = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('base64Input').value = '';

    if (file) {
        let reader = new FileReader();
        
        reader.onload = function(e) {
            let img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);

            // Store the Base64 string in a hidden input
            document.getElementById('base64Input').value = e.target.result.split(',')[1];
        }
        //read the file --> decode to base64
        reader.readAsDataURL(file);
    }
});

document.getElementById('uploadForm').addEventListener('submit', (event) => {
    event.preventDefault();
    let base64String = document.getElementById('base64Input').value;
    //console.log(base64String);
    if (!base64String) {
        document.getElementById('status').innerText = "No file selected.";
        return;
    }
    let payload = {
        "image": base64String
    };
    document.getElementById('status').innerText = "Uploading...";
    //Call to backend (ML model)
    fetch(BACKEND_LINK + "/process", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('status').innerText = "";
        //Should return image (image with boudning box) + button for more details
        if (data.image) {
            let img = document.createElement('img');
            img.src = 'data:image/png;base64,' + data.image;
            document.getElementById('result').appendChild(img);
            let button = document.createElement('button');
            button.innerText = "Get Additional Info";
            if (data.type === "grocery" || data.type === "restaurant") {
                button.addEventListener('click', () => {
                    getDetailedAnalysis("/" + data.type);
                });
                document.getElementById('result').appendChild(button);
            }
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

function getDetailedAnalysis(endpoint) {
    document.getElementById('status').innerText = "Fetching additional info...";
    fetch(BACKEND_LINK + endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('status').innerText = "";
        if (data.info) {
            let infoText = document.createElement('p');
            infoText.innerText = data.info;
            document.getElementById('result').appendChild(infoText);
        } else {
            document.getElementById('status').innerText = "Failed to fetch additional info!";
        }
        //console.log(data);
    })
    .catch(error => {
        document.getElementById('status').innerText = "Failed to fetch additional info!";
        //console.error(error);
    });
}
