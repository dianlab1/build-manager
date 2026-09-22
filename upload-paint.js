// ============================================================
// CAMERA / PAINT SCANNER
// ============================================================


// ============================================================
// ELEMENT VARIABLES
// ============================================================

// Camera
const video = document.querySelector("#video-feed");
const captureBtn = document.querySelector("#snap-image");
const resultImage = document.getElementById("snapshot-result");
const canvas = document.getElementById("capture-canvas");

// Paint form inputs
const saveBtn = document.querySelector("#upload-image");
const brandInput = document.querySelector("#brand-name");
const colorCodeInput = document.querySelector("#color-code");
const colorNameInput = document.querySelector("#color-name");

// Camera stream
let cameraStream = null;

// Keeps track of whether a valid snapshot exists
let hasSnapshot = false;


// ============================================================
// BACK BUTTON
// ============================================================

document.getElementById("back").addEventListener("click", function () {

    stopCamera();

    window.location.href = "index.html";

});


// ============================================================
// START CAMERA
// ============================================================

async function startCamera() {

    try {

        console.log("Starting camera...");

        // Stop any existing camera stream
        stopCamera();

        // Reset video element
        video.pause();
        video.srcObject = null;

        // Get a NEW camera stream
        const stream = await navigator.mediaDevices.getUserMedia({

            video: {
                facingMode: {
                    ideal: "environment"
                }
            },

            audio: false

        });

        // Store stream
        cameraStream = stream;

        // Attach stream to video
        video.srcObject = cameraStream;

        // Make video visible
        video.style.display = "block";

        // Hide snapshot
        resultImage.style.display = "none";
        resultImage.src = "";

        // Wait for video metadata
        await new Promise((resolve) => {

            if (video.readyState >= 2) {

                resolve();

            } else {

                video.onloadedmetadata = function () {
                    resolve();
                };

            }

        });

        // Explicitly start video
        await video.play();

        // Reset snapshot state
        hasSnapshot = false;

        console.log("Camera started successfully.");

    }

    catch (error) {

        console.error(
            "Could not start camera:",
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

        cameraStream.getTracks().forEach(track => {

            track.stop();

        });

        cameraStream = null;

    }

    video.pause();

    video.srcObject = null;

}


// ============================================================
// START CAMERA WHEN PAGE LOADS
// ============================================================

startCamera();


// ============================================================
// TAMIYA COLOR DATABASE
// ============================================================

const tamiyaColors = {

    "X-1": "Black",
    "X-2": "White",
    "X-3": "Royal Blue",
    "X-4": "Blue",
    "X-5": "Green",
    "X-6": "Orange",
    "X-7": "Red",
    "X-8": "Lemon Yellow",
    "X-9": "Brown",
    "X-10": "Gun Metal",
    "X-11": "Chrome Silver",
    "X-12": "Gold Leaf",
    "X-13": "Metallic Blue",
    "X-14": "Sky Blue",
    "X-15": "Light Green",
    "X-16": "Purple",
    "X-17": "Pink",
    "X-18": "Semi Gloss Black",
    "X-19": "Smoke",
    "X-20": "Thinner",
    "X-21": "Flat Base",
    "X-22": "Clear",
    "X-23": "Clear Blue",
    "X-24": "Clear Yellow",
    "X-25": "Clear Green",
    "X-26": "Clear Orange",
    "X-27": "Clear Red",
    "X-28": "Park Green",
    "X-31": "Titanium Gold",
    "X-32": "Titanium Silver",
    "X-33": "Bronze",
    "X-34": "Metallic Brown",
    "X-35": "Semi Gloss Clear",
    "X-36": "Semi Gloss Red",
    "X-37": "Lavender",
    "X-38": "Gun Metal",
    "X-39": "Clear Orange",
    "X-40": "Metal Brown",
    "X-41": "Red Brown",
    "X-42": "Metal Blue",
    "X-43": "Royal Blue",
    "X-44": "Tan",
    "X-45": "Pearl White",
    "X-46": "Red",
    "X-47": "Chrome Yellow",
    "X-48": "Metallic Blue",
    "X-49": "Khaki",
    "X-50": "Sky Blue",
    "X-51": "Khaki Drab",
    "X-52": "Flat Earth",
    "X-53": "Neutral Grey",
    "X-54": "Dark Sea Grey",
    "X-55": "Deck Tan",
    "X-56": "Metallic Grey",
    "X-57": "Buff",
    "X-58": "Olive Green",
    "X-59": "Desert Yellow",
    "X-60": "Dark Yellow",
    "X-61": "Dark Green",
    "X-62": "Olive Drab",
    "X-63": "German Grey",
    "X-64": "Red Brown",
    "X-65": "Field Grey",
    "X-66": "Light Grey",
    "X-67": "NATO Green",
    "X-68": "NATO Brown",
    "X-69": "NATO Black",
    "X-70": "Dark Green 2 (JGSDF)",
    "X-71": "Cockpit Green (IJN)",
    "X-72": "Cockpit Green (IJN)",
    "X-73": "Dark Green (JGSDF)",
    "X-74": "Olive Drab (JGSDF)",
    "X-75": "IJN Gray (Kure Arsenal)",
    "X-76": "IJN Gray (Yokosuka Arsenal)",
    "X-77": "IJN Gray (Maizuru Arsenal)",
    "X-78": "Wooden Deck Tan",
    "X-79": "Linoleum Deck Brown",
    "X-80": "Light Gun Metal",
    "X-81": "Dark Green 2 (JGSDF)",
    "X-82": "Olive Drab 2",
    "X-83": "Metal Black",
    "X-84": "Dark Iron",
    "X-85": "Semi Gloss Black",
    "X-86": "Flat Clear",
    "X-87": "Flat White",
    "X-88": "Flat Blue",
    "X-89": "Flat Green",
    "X-90": "Flat Red",
    "X-91": "Flat Yellow",
    "X-92": "Flat Orange",
    "X-93": "Flat Purple",
    "X-94": "Flat Brown",
    "X-95": "Flat Black",
    "X-96": "Flat White",
    "X-97": "Flat Blue",
    "X-98": "Flat Green",
    "X-99": "Flat Red",
    "X-100": "Flat Yellow",

    "XF-1": "Flat Black",
    "XF-2": "Flat White",
    "XF-3": "Flat Yellow",
    "XF-4": "Yellow Green",
    "XF-5": "Flat Green",
    "XF-6": "Copper",
    "XF-7": "Flat Red",
    "XF-8": "Flat Blue",
    "XF-9": "Hull Red",
    "XF-10": "Flat Brown",
    "XF-11": "J.N. Green",
    "XF-12": "J.N. Grey",
    "XF-13": "J.A. Green",
    "XF-14": "J.A. Grey",
    "XF-15": "Flat Flesh",
    "XF-16": "Flat Aluminum",
    "XF-17": "Sea Blue",
    "XF-18": "Medium Blue",
    "XF-19": "Sky Grey",
    "XF-20": "Medium Grey",
    "XF-21": "Sky",
    "XF-22": "RLM Grey",
    "XF-23": "Light Blue",
    "XF-24": "Dark Grey",
    "XF-25": "Light Sea Grey",
    "XF-26": "Deep Green",
    "XF-27": "Black Green",
    "XF-28": "Dark Copper",

    "XF-49": "Khaki",
    "XF-50": "Field Blue",
    "XF-51": "Khaki Drab",
    "XF-52": "Flat Earth",
    "XF-53": "Neutral Grey",
    "XF-54": "Dark Sea Grey",
    "XF-55": "Deck Tan",
    "XF-56": "Metallic Grey",
    "XF-57": "Buff",
    "XF-58": "Olive Green",
    "XF-59": "Desert Yellow",
    "XF-60": "Dark Yellow",
    "XF-61": "Dark Green",
    "XF-62": "Olive Drab",
    "XF-63": "German Grey",
    "XF-64": "Red Brown",
    "XF-65": "Field Grey",
    "XF-66": "Light Grey",
    "XF-67": "NATO Green",
    "XF-68": "NATO Brown",
    "XF-69": "NATO Black",
    "XF-70": "Dark Green 2 (JGSDF)",
    "XF-71": "Cockpit Green (IJN)",
    "XF-72": "Dark Green (JGSDF)",
    "XF-73": "Dark Green (JGSDF)",
    "XF-74": "Olive Drab (JGSDF)",
    "XF-75": "IJN Gray (Kure Arsenal)",
    "XF-76": "IJN Gray (Yokosuka Arsenal)",
    "XF-77": "IJN Gray (Maizuru Arsenal)",
    "XF-78": "Wooden Deck Tan",
    "XF-79": "Linoleum Deck Brown",
    "XF-80": "Light Gun Metal",
    "XF-81": "Dark Green 2",
    "XF-82": "Olive Drab 2",
    "XF-83": "Metal Black",
    "XF-84": "Dark Iron",
    "XF-85": "Rubber Black",
    "XF-86": "Flat Clear",
    "XF-87": "Flat White",
    "XF-88": "Flat Blue",
    "XF-89": "Flat Green",
    "XF-90": "Flat Red",
    "XF-91": "Flat Yellow",
    "XF-92": "Yellow-Brown (DAK 1941)",
    "XF-93": "Light Brown (DAK 1942)",
    "XF-94": "Flat Brown",
    "XF-95": "Flat Black",
    "XF-96": "Flat White",
    "XF-97": "Flat Blue",
    "XF-98": "Flat Green",
    "XF-99": "Flat Red",
    "XF-100": "Flat Yellow"

};


// ============================================================
// TAKE SNAPSHOT + OCR
// ============================================================

captureBtn.addEventListener("click", async () => {

    // Prevent another scan while OCR is already running
    if (captureBtn.dataset.scanning === "true") {
        return;
    }

    // Make sure camera is actually ready
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


    // Mark scanner as busy
    captureBtn.dataset.scanning = "true";


    // ========================================================
    // CAPTURE CURRENT FRAME
    // ========================================================

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Convert frame to image
    const imageDataUrl =
        canvas.toDataURL(
            "image/jpeg",
            0.9
        );


    // ========================================================
    // DO NOT FREEZE CAMERA YET
    // ========================================================
    //
    // The camera remains live while Tesseract processes
    // the captured frame.
    //
    // Only if OCR succeeds will we show the snapshot
    // and stop the camera.
    // ========================================================


    try {

        console.log("Scanning image...");


        const result =
            await Tesseract.recognize(
                imageDataUrl,
                "eng"
            );


        const recognizedText =
            result.data.text;


        console.log(
            "OCR Result:"
        );

        console.log(
            recognizedText
        );


        // ====================================================
        // DEFAULT BRAND
        // ====================================================

        brandInput.value = "Tamiya";


        // ====================================================
        // TRY TO FIND TAMIYA CODE
        // ====================================================

        const codePattern =
            /\b[A-Z]{1,2}-\d{1,3}\b/;


        const codeMatch =
            recognizedText.match(
                codePattern
            );


        let recognizedSuccessfully = false;


        // ====================================================
        // CODE FOUND
        // ====================================================

        if (
            codeMatch &&
            tamiyaColors[codeMatch[0]]
        ) {

            const detectedCode =
                codeMatch[0];


            colorCodeInput.value =
                detectedCode;


            colorNameInput.value =
                tamiyaColors[detectedCode];


            recognizedSuccessfully = true;


            console.log(
                "Tamiya code recognized:",
                detectedCode
            );

        }


        // ====================================================
        // CODE NOT FOUND
        // SEARCH FOR COLOR NAME
        // ====================================================

        else {

            const codes =
                Object.keys(tamiyaColors);


            // Sort by longest color name first
            const sortedCodes =
                codes.sort(function (a, b) {

                    return (
                        tamiyaColors[b].length -
                        tamiyaColors[a].length
                    );

                });


            // Find matching color name
            const matchedCode =
                sortedCodes.find(function (code) {

                    const colorName =
                        tamiyaColors[code]
                            .toLowerCase();


                    // Escape special regex characters
                    const escapedColorName =
                        colorName.replace(
                            /[.*+?^${}()|[\]\\]/g,
                            "\\$&"
                        );


                    // Whole-word search
                    const wholeWordPattern =
                        new RegExp(
                            "\\b" +
                            escapedColorName +
                            "\\b",
                            "i"
                        );


                    return wholeWordPattern.test(
                        recognizedText
                    );

                });


            // =================================================
            // COLOR NAME FOUND
            // =================================================

            if (matchedCode) {

                colorCodeInput.value =
                    matchedCode;


                colorNameInput.value =
                    tamiyaColors[matchedCode];


                recognizedSuccessfully = true;


                console.log(
                    "Tamiya color recognized:",
                    matchedCode,
                    tamiyaColors[matchedCode]
                );

            }

        }


        // ====================================================
        // OCR SUCCESS
        // ====================================================

        if (recognizedSuccessfully) {

            console.log(
                "Paint successfully recognized."
            );


            // ------------------------------------------------
            // NOW freeze the successful snapshot
            // ------------------------------------------------

            resultImage.src =
                imageDataUrl;


            video.style.display =
                "none";


            resultImage.style.display =
                "block";


            // Mark snapshot as valid
            hasSnapshot = true;


            // Stop camera
            stopCamera();


            console.log(
                "Snapshot frozen."
            );

        }


        // ====================================================
        // OCR FAILED
        // ====================================================

        else {

            console.log(
                "No valid Tamiya paint information recognized."
            );


            // ------------------------------------------------
            // IMPORTANT:
            // Do NOT show the image.
            // Do NOT stop the camera.
            // Do NOT freeze the screen.
            // ------------------------------------------------

            hasSnapshot = false;


            console.log(
                "Camera remains live. Try again."
            );

        }

    }

    catch (error) {

        console.error(
            "OCR error:",
            error
        );


        // OCR failed, so keep camera live
        hasSnapshot = false;

    }


    // Scanner is ready for another attempt
    captureBtn.dataset.scanning = "false";

});


// ============================================================
// UPLOAD PAINT TO INVENTORY
// ============================================================

saveBtn.addEventListener(
    "click",
    async function () {


        // ====================================================
        // MAKE SURE A SUCCESSFUL SNAPSHOT EXISTS
        // ====================================================

        if (
            !hasSnapshot ||
            !resultImage.src
        ) {

            console.warn(
                "No successfully scanned paint."
            );

            return;

        }


        // ====================================================
        // GET FORM DATA
        // ====================================================

        const brandName =
            brandInput.value;


        const colorCode =
            colorCodeInput.value;


        const colorName =
            colorNameInput.value;


        // ====================================================
        // CREATE PAINT OBJECT
        // ====================================================

        const savedData = {

            id: Date.now(),

            brand: brandName,

            code: colorCode,

            name: colorName,

            image: resultImage.src,

            fullness: "Full"

        };


        console.log(
            "Saving paint:",
            savedData
        );


        // ====================================================
        // GET EXISTING PAINTS
        // ====================================================

        let existingPaints =
            JSON.parse(
                localStorage.getItem(
                    "savedPaints"
                )
            ) || [];


        // Add new paint
        existingPaints.push(
            savedData
        );


        // Save to localStorage
        localStorage.setItem(
            "savedPaints",
            JSON.stringify(
                existingPaints
            )
        );


        console.log(
            "Paint successfully saved."
        );


        // ====================================================
        // CLEAR FORM
        // ====================================================

        colorNameInput.value = "";

        colorCodeInput.value = "";

        brandInput.value = "Tamiya";


        // ====================================================
        // RESET SNAPSHOT
        // ====================================================

        resultImage.src = "";

        resultImage.style.display =
            "none";


        // ====================================================
        // SHOW LIVE CAMERA
        // ====================================================

        video.style.display =
            "block";


        // Reset snapshot state
        hasSnapshot = false;


        // ====================================================
        // RESTART CAMERA
        // ====================================================

        console.log(
            "Restarting camera..."
        );


        await startCamera();


        console.log(
            "Ready for next paint."
        );

    }
);