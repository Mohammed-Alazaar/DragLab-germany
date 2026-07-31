// addcategory.js

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("deleteModal");
    const span = document.querySelector(".close-button");
    const cancelButton = document.querySelector(".cancel-delete");

    window.openModal = function (categoryId) {
        modal.style.display = "block";
        document.getElementById("deleteProductId").value = categoryId;
    };

    span.onclick = function () {
        modal.style.display = "none";
    };

    cancelButton.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
});
