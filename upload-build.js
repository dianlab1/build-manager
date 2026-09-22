// ============================================================
// UPLOAD BUILD - CAMERA / SNAPSHOT
// ============================================================


// ============================================================
// ELEMENT VARIABLES
// ============================================================

let video = document.querySelector("#video-feed");
let captureBtn = document.querySelector("#snap-build");
const resultImageBuild = document.getElementById("build-result");
let canvas = document.getElementById("capture-build");

let saveBtn = document.querySelector("#upload-build");
let buildInput = document.querySelector("#build-name");


// ============================================================
// CAMERA STREAM
// ============================================================

let cameraStream = null;


// Keeps track of whether we currently have a snapshot
let hasSnapshot = false;


// ============================================================
// BACK BUTTON
// ============================================================

document.getElementById("back").addEventListener("click", function () {

    // Stop camera before leaving page
    stopCamera();

    window.location.href = "index.html";

});


// ============================================================
// START CAMERA
// ============================================================

async function startCamera() {

    try {

        console.log("Starting camera...");


        // Stop any existing stream first
        stopCamera();


        // Reset video element
        video.pause();
        video.srcObject = null;


        // Request camera access
        const stream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: {
                        ideal: "environment"
                    }
                },

                audio: false

            });


        // Store camera stream
        cameraStream = stream;


        // Attach stream to video
        video.srcObject = cameraStream;


        // Show live video
        video.style.display = "block";


        // Hide snapshot
        resultImageBuild.style.display = "none";


        // Wait until video has loaded
        await new Promise(function (resolve) {

            if (video.readyState >= 2) {

                resolve();

            } else {

                video.onloadedmetadata = function () {

                    resolve();

                };

            }

        });


        // Explicitly start playback
        await video.play();


        // There is no frozen snapshot anymore
        hasSnapshot = false;


        console.log("Camera started successfully.");

    }

    catch (error) {

        console.error(
            "Error accessing camera:",
            error
        );

    }

}


// ============================================================
// STOP CAMERA
// ============================================================

function stopCamera() {

    console.log("Stopping camera...");


    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(function (track) {

                track.stop();

            });

        cameraStream = null;

    }


    // Stop video playback
    video.pause();


    // Remove stream from video element
    video.srcObject = null;

}


// ============================================================
// START CAMERA WHEN PAGE LOADS
// ============================================================

startCamera();


// ============================================================
// TAKE SNAPSHOT
// ============================================================

captureBtn.addEventListener(
    "click",
    function () {


        // Make sure the camera is ready
        if (
            !cameraStream ||
            video.videoWidth === 0 ||
            video.videoHeight === 0
        ) {

            console.error(
                "Camera is not ready."
            );

            return;

        }


        // ====================================================
        // GET CANVAS CONTEXT
        // ====================================================

        const context =
            canvas.getContext("2d");


        // ====================================================
        // MATCH CANVAS TO CAMERA RESOLUTION
        // ====================================================

        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;


        // ====================================================
        // COPY CURRENT VIDEO FRAME TO CANVAS
        // ====================================================

        context.drawImage(

            video,

            0,
            0,

            canvas.width,
            canvas.height

        );


        // ====================================================
        // CONVERT FRAME TO IMAGE
        // ====================================================

        const imageDataUrl =
            canvas.toDataURL(
                "image/jpeg",
                0.9
            );


        // ====================================================
        // DISPLAY FROZEN SNAPSHOT
        // ====================================================

        resultImageBuild.src =
            imageDataUrl;


        resultImageBuild.style.display =
            "block";


        // Hide live camera
        video.style.display =
            "none";


        // We now have a valid snapshot
        hasSnapshot = true;


        // ====================================================
        // STOP CAMERA
        // ====================================================

        stopCamera();


        console.log(
            "Snapshot captured and camera frozen."
        );

    }
);


// ============================================================
// UPLOAD BUILD TO INVENTORY
// ============================================================

saveBtn.addEventListener(
    "click",
    async function () {


        // ====================================================
        // MAKE SURE THERE IS A SNAPSHOT
        // ====================================================

        if (
            !hasSnapshot ||
            !resultImageBuild.src
        ) {

            console.warn(
                "Take a snapshot before uploading the build."
            );

            return;

        }


        // ====================================================
        // GET BUILD NAME
        // ====================================================

        let buildName =
            buildInput.value;


        // ====================================================
        // CREATE BUILD OBJECT
        // ====================================================

        let savedBuild = {

            id: Date.now(),

            name: buildName,

            image: resultImageBuild.src

        };


        // ====================================================
        // GET EXISTING BUILDS
        // ====================================================

        let existingBuilds =
            JSON.parse(
                localStorage.getItem(
                    "savedBuilds"
                )
            ) || [];


        // ====================================================
        // ADD NEW BUILD
        // ====================================================

        existingBuilds.push(
            savedBuild
        );


        // ====================================================
        // SAVE TO LOCAL STORAGE
        // ====================================================

        localStorage.setItem(
            "savedBuilds",
            JSON.stringify(
                existingBuilds
            )
        );


        console.log(
            "Build successfully uploaded."
        );


        // ====================================================
        // CLEAR BUILD NAME
        // ====================================================

        buildInput.value = "";


        // ====================================================
        // CLEAR SNAPSHOT
        // ====================================================

        resultImageBuild.src = "";


        resultImageBuild.style.display =
            "none";


        // ====================================================
        // SHOW LIVE CAMERA
        // ====================================================

        video.style.display =
            "block";


        // Reset snapshot state
        hasSnapshot = false;


        // ====================================================
        // START A FRESH CAMERA STREAM
        // ====================================================

        await startCamera();


        console.log(
            "Ready to take another build snapshot."
        );

    }
);