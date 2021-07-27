const INCOMPLETE_BOOK_SHELF_LIST = "incompleteBookshelfList";
const COMPLETED_BOOK_SHELF_LIST = "completeBookshelfList";
const BOOK_BOOKID = "bookId";

function addBook() {
    const incompleteBookshelfList = document.getElementById(INCOMPLETE_BOOK_SHELF_LIST);
    const completeBookshelfList = document.getElementById(COMPLETED_BOOK_SHELF_LIST);

    const textTitle = document.getElementById("inputBookTitle").value;
    const author = "Penulis: " + document.getElementById("inputBookAuthor").value;
    const year = "Tahun: " + document.getElementById("inputBookYear").value;
    const page = "Halaman: " + document.getElementById("inputBookPage").value;
    const cekStatus = document.getElementById("inputBookIsComplete").checked;

    if (cekStatus == true) {
        const book = makeShelf(textTitle, author, year, page, true);
        const bookObject = composeBookObject(textTitle, author, year, page, true);

        book[BOOK_BOOKID] = bookObject.id;
        books.push(bookObject);

        completeBookshelfList.append(book);
        updateDataToStorage();

    } else {
        const book = makeShelf(textTitle, author, year, page, false);
        const bookObject = composeBookObject(textTitle, author, year, page, false);

        book[BOOK_BOOKID] = bookObject.id;
        books.push(bookObject);

        incompleteBookshelfList.append(book);
        updateDataToStorage();
    }

}

function makeShelf(title, author, year, page, isCompleted) {

    const textTitle = document.createElement("h3");
    textTitle.innerText = title;

    const textAuthor = document.createElement("p");
    textAuthor.classList.add("author")
    textAuthor.innerText = author;

    const textYear = document.createElement("p");
    textYear.classList.add("year")
    textYear.innerText = year;

    const textPage = document.createElement("p");
    textPage.classList.add("page")
    textPage.innerText = page;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action")

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textAuthor, textYear, textPage, buttonContainer);

    const container = document.createElement("div");
    container.classList.add("book_item", "card")

    if (isCompleted) {
        const undoButton = createUndoButton();
        const editButton = createEditButton();
        const delButton = createDeleteButton();

        buttonContainer.append(undoButton, editButton, delButton)

        container.append(textContainer);
    } else {
        const doneButton = createDoneButton();
        const editButton = createEditButton();
        const delButton = createDeleteButton();

        buttonContainer.append(doneButton, editButton, delButton)

        container.append(textContainer);
    }
    return container
}

function addBookToCompleted(bookElement) {
    const listCompleted = document.getElementById(COMPLETED_BOOK_SHELF_LIST);

    const bookTitle = bookElement.querySelector(".inner > h3").innerText;
    const bookAuthor = bookElement.querySelector("p.author").innerText;
    const bookYear = bookElement.querySelector("p.year").innerText;
    const bookPage = bookElement.querySelector("p.page").innerText;

    const newBook = makeShelf(bookTitle, bookAuthor, bookYear, bookPage, true);
    const book = findBook(bookElement[BOOK_BOOKID]);
    book.isCompleted = true;
    newBook[BOOK_BOOKID] = book.id;

    listCompleted.append(newBook);
    bookElement.remove();
    updateDataToStorage();
}

function removeBookFromCompleted(bookElement) {

    const bookPosition = findBookIndex(bookElement[BOOK_BOOKID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    updateDataToStorage();
}

function undoBookFromCompleted(bookElement) {
    const listUncompleted = document.getElementById(INCOMPLETE_BOOK_SHELF_LIST)

    const bookTitle = bookElement.querySelector(".inner > h3").innerText;
    const bookAuthor = bookElement.querySelector("p.author").innerText;
    const bookYear = bookElement.querySelector("p.year").innerText;
    const bookPage = bookElement.querySelector("p.page").innerText;


    const newBook = makeShelf(bookTitle, bookAuthor, bookYear, bookPage, false);
    const book = findBook(bookElement[BOOK_BOOKID]);
    book.isCompleted = false;
    newBook[BOOK_BOOKID] = book.id;

    listUncompleted.append(newBook);
    bookElement.remove();
    updateDataToStorage();
}

function createButton(buttonTypeClass, innerText, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = innerText
    button.addEventListener("click", function(event) {
        eventListener(event);
    });
    return button;
}

function createDoneButton() {
    return createButton("green", "Selesai dibaca", function(event) {
        addBookToCompleted(event.target.parentNode.parentNode.parentNode);
    });
}

function createEditButton() {
    return createButton("blue", "Edit buku", function(event) {
        Swal.fire({
            title: 'Edit Buku?',
            text: "Apakah kamu yakin untuk mengedit buku ini?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#288FB4',
            cancelButtonColor: '#f44336',
            confirmButtonText: 'Edit Buku',
            cancelButtonText: 'Batalkan'
        }).then((result) => {
            if (result.isConfirmed) {
                editYear(event.target.parentNode.parentNode.parentNode);
                removeBookFromCompleted(event.target.parentNode.parentNode.parentNode);
            }
        })
    });
}

function createDeleteButton() {
    return createButton("red", "Hapus buku", function(event) {
        Swal.fire({
            title: 'Apakah kamu yakin?',
            text: "Buku yang telah dihapus tidak akan bisa kembali.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#288FB4',
            cancelButtonColor: '#f44336',
            confirmButtonText: 'Hapus Buku',
            cancelButtonText: 'Batalkan'
        }).then((result) => {
            if (result.isConfirmed) {
                removeBookFromCompleted(event.target.parentNode.parentNode.parentNode);
                Swal.fire({
                    title: 'Buku Dihapus',
                    text: "Buku kamu telah dihapus dari bookshelf.",
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#288FB4',
                    confirmButtonText: 'OK'
                })
            }
        })
    });
}

function createUndoButton() {
    return createButton("orange", "Belum selesai dibaca", function(event) {
        undoBookFromCompleted(event.target.parentNode.parentNode.parentNode);
    });
}

function editYear(bookElement) {
    const title = document.getElementById("inputBookTitle");
    const author = document.getElementById("inputBookAuthor");
    const year = document.getElementById("inputBookYear");
    const page = document.getElementById("inputBookPage");
    const cekStatus = document.getElementById("inputBookIsComplete");

    const judul = findBookTitle(bookElement[BOOK_BOOKID]);
    const penulis = findBookAuthor(bookElement[BOOK_BOOKID]);
    const tahun = findBookYear(bookElement[BOOK_BOOKID]);
    const halaman = findBookPage(bookElement[BOOK_BOOKID]);
    const status = findBookStatus(bookElement[BOOK_BOOKID]);

    title.value = judul;
    author.value = penulis;
    year.value = tahun;
    page.value = halaman;
    cekStatus.checked = status;
}