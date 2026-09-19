//Set Variables for Camera Access
let video = document.querySelector("#video-feed");
let captureBtn = document.querySelector("#snap-build");
const resultImageBuild = document.getElementById('build-result');
let canvas = document.getElementById('capture-build');

document.getElementById('back').addEventListener("click", function () {
    window.location.href = "index.html";
});

//Get Camera Access
navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' },
    audio: false
})
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing camera: ", err);
    });

//Capture a single frame from the video stream
captureBtn.addEventListener('click', async () => {
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match the actual video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas drawing into a usable Base64 Image URL
    const imageDataUrl = canvas.toDataURL('image/jpeg');

    // Display or process your input image
    resultImageBuild.src = imageDataUrl;
});

//Upload to Inventory
let saveBtn = document.querySelector("#upload-build");
let buildInput = document.querySelector("#build-name");

saveBtn.addEventListener("click", function () {
    let buildName = buildInput.value;

    let savedBuild = {
        id: Date.now(),
        name: buildName,
        image: resultImageBuild.src
    };

    let existingBuilds = JSON.parse(localStorage.getItem("savedBuilds")) || [];
    existingBuilds.push(savedBuild);
    localStorage.setItem("savedBuilds", JSON.stringify(existingBuilds));

    buildInput.value = "";
});