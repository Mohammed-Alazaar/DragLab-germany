document.addEventListener("DOMContentLoaded", function () {
    const deleteForms = document.querySelectorAll("form[action^='/admin/articles/delete/']");

    deleteForms.forEach((form) => {
        form.addEventListener("submit", function (event) {
            const confirmed = confirm("Are you sure?");
            if (!confirmed) {
                event.preventDefault(); // Cancel the form submission
            }
        });
    });
});
