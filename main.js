// let imageSource = document.getElementById("file-input");

// document.getElementById("go").addEventListener("click", async function () {
//     const result = await Tesseract.recognize(
//         imageSource.files[0],
//         'eng',
//     );
//     console.log(result.data.text); // the raw extracted text
// });

// const video = document.getElementById('video-feed');

// const captureBtn = document.getElementById('capture-btn');
// const canvas = document.getElementById('capture-canvas');
// const resultImage = document.getElementById('snapshot-result');

// // 1. Request access to the rear camera ('environment')
// navigator.mediaDevices.getUserMedia({
//     video: { facingMode: 'environment' },
//     audio: false
// })
//     .then(stream => {
//         // Feed the live stream into the HTML video element
//         video.srcObject = stream;
//     })
//     .catch(err => {
//         console.error("Error accessing camera: ", err);
//     });

// // 2. Capture a single frame from the video stream
// captureBtn.addEventListener('click', () => {
//     const context = canvas.getContext('2d');

//     // Set canvas dimensions to match the actual video stream
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     // Draw the current video frame onto the canvas
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // Convert the canvas drawing into a usable Base64 Image URL
//     const imageDataUrl = canvas.toDataURL('image/jpeg');

//     // Display or process your input image
//     resultImage.src = imageDataUrl;
// });

// Open Inventory Pages
let paintInv = document.querySelector("#paint-inventory");

paintInv.addEventListener("click", function () {
    window.location.href = "paint-inventory.html";
});

let buildInv = document.querySelector("#build-inventory");

buildInv.addEventListener("click", function () {
    window.location.href = "build-inventory.html";
});

let paintUp = document.querySelector("#paint-image");

paintUp.addEventListener("click", function () {
    window.location.href = "upload-paint.html";
});

let buildUp = document.querySelector("#build-image");

buildUp.addEventListener("click", function () {
    window.location.href = "upload-build.html";
});
