let swRegistration = null;

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(function (registration) {
        swRegistration = registration;

        registration.addEventListener("updatefound", function () {
            let newWorker = registration.installing;

            newWorker.addEventListener("statechange", function () {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    promptUserToUpdate(newWorker);
                }
            });
        });
    }).catch(function (err) {
        console.error("Service worker registration failed:", err);
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
    });
}

function promptUserToUpdate(worker) {
    let confirmed = confirm("A new version of the app is available. Update now?");
    if (confirmed) {
        worker.postMessage({ type: "SKIP_WAITING" });
    }
}

function checkForUpdates() {
    if (!swRegistration) {
        alert("App isn't ready yet — try again in a moment.");
        return;
    }
    swRegistration.update().then(function () {
        alert("Checked for updates.");
    });
}

let updateBtn = document.getElementById("check-update");
if (updateBtn) {
    updateBtn.addEventListener("click", checkForUpdates);
}