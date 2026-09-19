document.getElementById('back').addEventListener("click", function () {
    window.location.href = "index.html";
});

let buildList = document.querySelector("#build-list");
let currentEditId = null;

function renderBuildList() {
    buildList.innerHTML = "";

    let savedBuilds = JSON.parse(localStorage.getItem("savedBuilds")) || [];

    savedBuilds.forEach(function (build) {
        let buildItem = document.createElement("div");
        buildItem.classList.add("build-item");
        buildItem.setAttribute("data-id", build.id);
        buildItem.innerHTML = `
            <h3>${build.name}</h3>
            ${build.image ? `<img src="${build.image}" alt="${build.name}">` : ""}
        `;
        buildList.appendChild(buildItem);

        buildItem.addEventListener("click", function () {
            openEditModal(build.id);
        });
    });
}

renderBuildList();

document.getElementById('close-edit').addEventListener("click", function () {
    document.getElementById('edit-modal').classList.add("hidden");
});

function openEditModal(id) {
    let savedBuilds = JSON.parse(localStorage.getItem("savedBuilds")) || [];

    let buildToEdit = savedBuilds.find(function (build) {
        return build.id === id;
    });

    currentEditId = id;

    document.getElementById("edit-build-name").value = buildToEdit.name;

    document.getElementById("edit-modal").classList.remove("hidden");
}

document.getElementById("save-edit").addEventListener("click", function () {
    let savedBuilds = JSON.parse(localStorage.getItem("savedBuilds")) || [];

    let buildToUpdate = savedBuilds.find(function (build) {
        return build.id === currentEditId;
    });

    buildToUpdate.name = document.getElementById("edit-build-name").value;

    localStorage.setItem("savedBuilds", JSON.stringify(savedBuilds));

    document.getElementById("edit-modal").classList.add("hidden");
    renderBuildList();
});

document.getElementById("delete-build").addEventListener("click", function () {
    let confirmed = confirm("Are you sure you want to delete this build?");

    if (!confirmed) {
        return;
    }

    let savedBuilds = JSON.parse(localStorage.getItem("savedBuilds")) || [];

    let updatedBuilds = savedBuilds.filter(function (build) {
        return build.id !== currentEditId;
    });

    localStorage.setItem("savedBuilds", JSON.stringify(updatedBuilds));
    renderBuildList();
    document.getElementById("edit-modal").classList.add("hidden");
});