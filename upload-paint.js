const video = document.querySelector("#video-feed");
const captureBtn = document.querySelector("#snap-image");
const resultImage = document.querySelector("#snapshot-result");
const canvas = document.querySelector("#capture-canvas");

const uploadBtn = document.querySelector("#upload-image");
const fileInput = document.createElement("input");

const saveBtn = document.querySelector("#save-paint");
const brandInput = document.querySelector("#brand-name");
const colorCodeInput = document.querySelector("#color-code");
const colorNameInput = document.querySelector("#color-name");
const fullnessInput = document.querySelector("#paint-fullness");

let cameraStream = null;
let hasSnapshot = false;


// ============================================================
// CAMERA
// ============================================================

async function startCamera() {
    try {
        stopCamera();

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: {
                    ideal: "environment"
                }
            },
            audio: false
        });

        video.srcObject = cameraStream;
        video.style.display = "block";
        resultImage.style.display = "none";

        hasSnapshot = false;

        await new Promise((resolve) => {
            if (video.readyState >= 1) {
                resolve();
            } else {
                video.onloadedmetadata = resolve;
            }
        });

        await video.play();

    } catch (error) {
        console.error("Camera error:", error);
        alert("Could not access the camera.");
    }
}


function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    video.srcObject = null;
}


// ============================================================
// TAMIYA PAINT DATABASE
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
    "X-20": "Acrylic Thinner",
    "X-21": "Flat Base",
    "X-22": "Clear",
    "X-23": "Clear Blue",
    "X-24": "Clear Yellow",
    "X-25": "Clear Green",
    "X-26": "Clear Orange",
    "X-27": "Clear Red",
    "X-28": "Park Green",
    "X-29": "Dark Brown",
    "X-30": "Park Green",
    "X-31": "Titanium Gold",
    "X-32": "Titanium Silver",
    "X-33": "Bronze",
    "X-34": "Metallic Brown",
    "X-35": "Violet",
    "X-36": "Fluorescent Red",
    "X-37": "Fluorescent Red",
    "X-38": "Fluorescent Red",
    "X-39": "Hull Red",
    "X-40": "Flat Brown",
    "X-41": "Red Brown",
    "X-42": "Mahogany",
    "X-43": "Red Brown",
    "X-44": "Dark Green",
    "X-45": "Light Blue",
    "X-46": "Clear Red",
    "X-47": "Clear Yellow",
    "X-48": "Clear Green",
    "X-49": "Park Green",
    "X-50": "Transparent Blue",
    "X-51": "Tamiya Lacquer Thinner",
    "X-52": "Flat Earth",
    "X-53": "Neutral Gray",
    "X-54": "Dark Sea Gray",
    "X-55": "Deck Tan",
    "X-56": "Metallic Gray",
    "X-57": "Buff",
    "X-58": "Olive Green",
    "X-59": "Desert Yellow",
    "X-60": "Dark Yellow",
    "X-61": "Dark Green",
    "X-62": "Olive Drab",
    "X-63": "German Gray",
    "X-64": "Red Brown",
    "X-65": "Field Gray",
    "X-66": "Light Gray",
    "X-67": "Nato Black",
    "X-68": "Nato Brown",
    "X-69": "Nato Black",
    "X-70": "Dark Green",
    "X-71": "Cockpit Green",
    "X-72": "Brown",
    "X-73": "Dark Green",
    "X-74": "Dark Green",
    "X-75": "Brown",
    "X-76": "Light Gray",
    "X-77": "Flat Flesh",
    "X-78": "Wooden Deck Tan",
    "X-79": "Linoleum Deck Brown",
    "X-80": "Royal Light Gray",
    "X-81": "Royal Light Gray",
    "X-82": "Ocean Gray",
    "X-83": "Medium Sea Gray",
    "X-84": "Dark Iron",
    "X-85": "Rubber Black",
    "X-86": "Light Red",
    "X-87": "Titanium Yellow",
    "X-88": "Titanium Silver",
    "X-89": "Titanium Gold",
    "X-90": "Red Brown",
    "X-91": "Clear Red",
    "X-92": "Metallic Orange",
    "X-93": "Light Green",
    "X-94": "Metallic Gray",
    "X-95": "Pure Metallic Red",
    "X-96": "Semi Gloss Black",
    "X-97": "Light Gray",
    "X-98": "Pure Orange",
    "X-99": "Bright Red",
    "X-100": "Bright Orange",

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
    "XF-12": "J.N. Gray",
    "XF-13": "J.A. Green",
    "XF-14": "Olive Green",
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
    "XF-70": "Dark Green 2",
    "XF-71": "Cockpit Green",
    "XF-72": "Brown",
    "XF-73": "Dark Green",
    "XF-74": "Dark Green",
    "XF-75": "Flat Green",
    "XF-76": "Grey Green",
    "XF-77": "Flat Blue",
    "XF-78": "Wooden Deck Tan",
    "XF-79": "Linoleum Deck Brown",
    "XF-80": "Royal Light Grey",
    "XF-81": "Dark Green 2",
    "XF-82": "Ocean Grey",
    "XF-83": "Medium Sea Grey",
    "XF-84": "Dark Iron",
    "XF-85": "Rubber Black",
    "XF-86": "Flat Clear"
};


// ============================================================
// OCR HELPERS
// ============================================================

function normalizeText(text) {
    return text
        .toUpperCase()
        .replace(/[–—−]/g, "-")
        .replace(/\s+/g, " ")
        .trim();
}


function findTamiyaCode(text) {

    const normalized = normalizeText(text);

    const match = normalized.match(/\b(XF?|X)-?\s*(\d{1,3})\b/i);

    if (!match) {
        return null;
    }

    const prefix = match[1].toUpperCase();

    let number = match[2];

    const code = `${prefix}-${number}`;

    if (tamiyaColors[code]) {
        return code;
    }

    return null;
}


function findTamiyaColorName(text) {

    const normalized = normalizeText(text);

    for (const [code, name] of Object.entries(tamiyaColors)) {

        const normalizedName = normalizeText(name);

        if (
            normalized.includes(normalizedName) &&
            normalizedName.length >= 4
        ) {
            return {
                code,
                name
            };
        }
    }

    return null;
}


// ============================================================
// SNAPSHOT / OCR
// ============================================================

captureBtn.addEventListener("click", async () => {

    if (captureBtn.dataset.scanning === "true") {
        return;
    }

    if (!video.videoWidth || !video.videoHeight) {
        alert("Camera is not ready yet.");
        return;
    }

    captureBtn.dataset.scanning = "true";
    captureBtn.disabled = true;

    try {

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

        const imageData = canvas.toDataURL("image/jpeg", 0.9);

        console.log("Starting OCR...");

        const result = await Tesseract.recognize(
            imageData,
            "eng",
            {
                logger: info => {
                    console.log(info);
                }
            }
        );

        const text = result.data.text;

        console.log("OCR TEXT:", text);

        let detectedCode = findTamiyaCode(text);
        let detectedName = null;

        if (detectedCode) {

            detectedName = tamiyaColors[detectedCode];

            console.log(
                "Detected Tamiya code:",
                detectedCode,
                detectedName
            );

        } else {

            const detectedColor = findTamiyaColorName(text);

            if (detectedColor) {

                detectedCode = detectedColor.code;
                detectedName = detectedColor.name;

                console.log(
                    "Detected Tamiya colour:",
                    detectedCode,
                    detectedName
                );
            }
        }


        // ----------------------------------------------------
        // SUCCESS
        // ----------------------------------------------------

        if (detectedCode) {

            brandInput.value = "Tamiya";
            colorCodeInput.value = detectedCode;
            colorNameInput.value = detectedName || "";

            resultImage.src = imageData;

            video.style.display = "none";
            resultImage.style.display = "block";

            hasSnapshot = true;

            stopCamera();

            console.log("Paint successfully recognized.");

        } else {

            // ------------------------------------------------
            // OCR FAILED
            // Keep camera running so user can try again.
            // ------------------------------------------------

            console.log("No valid Tamiya paint detected.");

            alert(
                "I couldn't recognize a valid Tamiya paint code or colour name. Try again with the label closer to the camera."
            );
        }

    } catch (error) {

        console.error("OCR error:", error);

        alert(
            "Something went wrong while scanning. Please try again."
        );

    } finally {

        captureBtn.dataset.scanning = "false";
        captureBtn.disabled = false;
    }
});


// ============================================================
// UPLOAD IMAGE
// ============================================================

uploadBtn.addEventListener("click", () => {

    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.capture = "environment";

    fileInput.click();
});


fileInput.addEventListener("change", async () => {

    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    try {

        const imageData = await new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;

            reader.readAsDataURL(file);
        });


        console.log("Starting OCR on uploaded image...");

        const result = await Tesseract.recognize(
            imageData,
            "eng",
            {
                logger: info => {
                    console.log(info);
                }
            }
        );

        const text = result.data.text;

        console.log("OCR TEXT:", text);

        let detectedCode = findTamiyaCode(text);
        let detectedName = null;

        if (detectedCode) {

            detectedName = tamiyaColors[detectedCode];

        } else {

            const detectedColor = findTamiyaColorName(text);

            if (detectedColor) {

                detectedCode = detectedColor.code;
                detectedName = detectedColor.name;
            }
        }


        if (detectedCode) {

            brandInput.value = "Tamiya";
            colorCodeInput.value = detectedCode;
            colorNameInput.value = detectedName || "";

            resultImage.src = imageData;

            video.style.display = "none";
            resultImage.style.display = "block";

            hasSnapshot = true;

            stopCamera();

        } else {

            alert(
                "I couldn't recognize a valid Tamiya paint code or colour name."
            );
        }

    } catch (error) {

        console.error("Upload OCR error:", error);

        alert(
            "Something went wrong while scanning the image."
        );
    }
});


// ============================================================
// SAVE PAINT
// ============================================================

saveBtn.addEventListener("click", () => {

    if (!hasSnapshot) {

        alert(
            "Please scan or upload a paint image successfully before saving."
        );

        return;
    }


    const brand = brandInput.value.trim();
    const code = colorCodeInput.value.trim();
    const name = colorNameInput.value.trim();


    if (!brand || !code || !name) {

        alert(
            "Please make sure the brand, colour code and colour name are filled in."
        );

        return;
    }


    const savedData = {

        id: Date.now(),

        brand: brand,

        code: code,

        name: name,

        image: resultImage.src,

        // -----------------------------------------------
        // NEW:
        // Save the selected Fullness value.
        // -----------------------------------------------
        fullness: fullnessInput.value
    };


    const savedPaints =
        JSON.parse(
            localStorage.getItem("savedPaints")
        ) || [];


    savedPaints.push(savedData);


    localStorage.setItem(
        "savedPaints",
        JSON.stringify(savedPaints)
    );


    alert("Paint saved successfully!");


    // ========================================================
    // RESET FORM
    // ========================================================

    brandInput.value = "";
    colorCodeInput.value = "";
    colorNameInput.value = "";

    // Reset Fullness back to Full for the next paint
    fullnessInput.value = "Full";

    resultImage.src = "";
    resultImage.style.display = "none";

    hasSnapshot = false;


    // Start camera again for the next paint
    startCamera();
});


// ============================================================
// BACK BUTTON
// ============================================================

const backButton = document.querySelector("#back");

if (backButton) {

    backButton.addEventListener("click", () => {

        stopCamera();

        window.location.href = "index.html";
    });
}


// ============================================================
// START CAMERA WHEN PAGE LOADS
// ============================================================

window.addEventListener("load", () => {

    // Default Fullness
    if (fullnessInput) {
        fullnessInput.value = "Full";
    }

    startCamera();
});