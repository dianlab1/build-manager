document.getElementById('back').addEventListener("click", function () {
    window.location.href = "index.html";
});

let paintList = document.querySelector("#paint-list");
let savedPaints = JSON.parse(localStorage.getItem("savedPaints")) || [];

savedPaints.forEach(function (paint) {
    let paintItem = document.createElement("div");
    paintItem.classList.add("paint-item");
    paintItem.innerHTML = `
        <h3>${paint.brand}</h3>
        <p><strong>Code:</strong> ${paint.code}</p>
        <p><strong>Name:</strong> ${paint.name}</p>
    `;
    paintList.appendChild(paintItem);
});