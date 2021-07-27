document.addEventListener("DOMContentLoaded", function() {

    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addBook();
        document.getElementById("inputBook").reset();
    });

    const submitSearch = document.getElementById("searchBook");

    submitSearch.addEventListener("submit", function(event) {
        event.preventDefault();
        searchBook();
        document.getElementById("searchBook").reset();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }

});

document.addEventListener("ondatasaved", () => {
    console.log("Data saved.");
});
document.addEventListener("ondataloaded", () => {
    console.log("Data loaded.")
    refreshDataFromBooks();
});