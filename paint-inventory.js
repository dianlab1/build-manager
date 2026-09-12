document.getElementById('back').addEventListener("click", function () {
    window.location.href = "index.html";
});

let paintList = document.querySelector("#paint-list");
let currentEditId = null;

function renderPaintList() {
    paintList.innerHTML = "";

    let savedPaints = JSON.parse(localStorage.getItem("savedPaints")) || [];

    savedPaints.forEach(function (paint) {
        let paintItem = document.createElement("div");
        paintItem.classList.add("paint-item");
        paintItem.setAttribute("data-id", paint.id);
        paintItem.innerHTML = `
            <h3>${paint.brand}</h3>
            <p><strong>Code:</strong> ${paint.code}</p>
            <p><strong>Name:</strong> ${paint.name}</p>
            <p><strong>Fullness:</strong> ${paint.fullness}</p>
        `;
        paintList.appendChild(paintItem);

        paintItem.addEventListener("click", function () {
            openEditModal(paint.id);
        });
    });
}

renderPaintList();

document.getElementById('close-edit').addEventListener("click", function () {
    document.getElementById('edit-modal').classList.add("hidden");
});

function openEditModal(id) {
    let savedPaints = JSON.parse(localStorage.getItem("savedPaints")) || [];

    // your task: find the paint object in savedPaints whose .id matches the id parameter
    let paintToEdit = savedPaints.find(function (paint) {
        return paint.id === id;
    });

    currentEditId = id;

    // your task: set each modal input's .value to that paint's corresponding property
    document.getElementById("edit-brand").value = paintToEdit.brand;
    document.getElementById("edit-code").value = paintToEdit.code;
    document.getElementById("edit-name").value = paintToEdit.name;
    document.getElementById("edit-fullness").value = paintToEdit.fullness;

    document.getElementById("edit-modal").classList.remove("hidden");
}

document.getElementById("save-edit").addEventListener("click", function () {
    let savedPaints = JSON.parse(localStorage.getItem("savedPaints")) || [];

    let paintToUpdate = savedPaints.find(function (paint) {
        return paint.id === currentEditId;
    });

    paintToUpdate.brand = document.getElementById("edit-brand").value;
    paintToUpdate.code = document.getElementById("edit-code").value;
    paintToUpdate.name = document.getElementById("edit-name").value;
    paintToUpdate.fullness = document.getElementById("edit-fullness").value;

    localStorage.setItem("savedPaints", JSON.stringify(savedPaints));

    document.getElementById("edit-modal").classList.add("hidden");
    renderPaintList();
});

document.getElementById("delete-paint").addEventListener("click", function () {
    let confirmed = confirm("Are you sure you want to delete this paint?");

    if (!confirmed) {
        return;
    }

    let savedPaints = JSON.parse(localStorage.getItem("savedPaints")) || [];

    let updatedPaints = savedPaints.filter(function (paint) {
        return paint.id !== currentEditId;
    });

    localStorage.setItem("savedPaints", JSON.stringify(updatedPaints));
    renderPaintList();
    document.getElementById("edit-modal").classList.add("hidden");
});