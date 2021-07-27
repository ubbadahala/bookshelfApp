const STORAGE_KEY = "BOOKSHELF_APPS"

let books = [];

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null)
        books = data;

    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if (isStorageExist())
        saveData();
}

function composeBookObject(title, author, year, page, isCompleted) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        page,
        isCompleted
    };
}

function findBook(bookId) {
    for (book of books) {
        if (book.id === bookId)
            return book;
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0
    for (book of books) {
        if (book.id === bookId)
            return index;

        index++;
    }

    return -1;
}

function findBookTitle(bookId) {

    for (book of books) {
        if (book.id === bookId)
            return book.title;
    }
    return null;

}

function findBookAuthor(bookId) {

    for (book of books) {
        const hapusKataPenulis = book.author.replace("Penulis: ", "");
        if (book.id === bookId)
            return hapusKataPenulis;
    }
    return null;

}

function findBookYear(bookId) {

    for (book of books) {
        const hapusKataTahun = book.year.replace("Tahun: ", "");
        if (book.id === bookId)
            return hapusKataTahun;
    }
    return null;
}

function findBookPage(bookId) {

    for (book of books) {
        const hapusKataHalaman = book.page.replace("Halaman: ", "");
        if (book.id === bookId)
            return hapusKataHalaman;
    }
    return null;
}

function findBookStatus(bookId) {

    for (book of books) {
        if (book.id === bookId)
            return book.isCompleted;
    }
    return null;

}

function refreshDataFromBooks() {
    const incompleteBookshelfList = document.getElementById(INCOMPLETE_BOOK_SHELF_LIST);
    const completeBookshelfList = document.getElementById(COMPLETED_BOOK_SHELF_LIST);

    for (book of books) {
        const newBook = makeShelf(book.title, book.author, book.year, book.page, book.isCompleted);
        newBook[BOOK_BOOKID] = book.id;

        if (book.isCompleted) {
            completeBookshelfList.append(newBook);
        } else {
            incompleteBookshelfList.append(newBook);
        }
    }
}

function searchBook() {
    const array2 = document.getElementById("searchBookTitle").value;
    const hapusKataHalaman = book.page.replace("Halaman: ", "");

    const benar = "telah selesai dibaca."
    const salah = "belum selesai dibaca. Terakhir kali, kamu membaca halaman "

    function cekstatus() {
        if (book.isCompleted == true)
            return benar;
        return salah + hapusKataHalaman
    }

    function find() {
        for (book of books) {
            if (book.title == array2) {
                Swal.fire({
                    title: 'Buku Ditemukan',
                    text: 'Buku dengan judul "' + array2 + '" berhasil ditemukan dengan status ' + cekstatus(),
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#288FB4',
                    confirmButtonText: 'OK',
                })
                return book;
            }
        }
        Swal.fire({
            title: 'Buku Tidak Ditemukan',
            text: 'Buku dengan judul "' + array2 + '" tidak ditemukan.',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#288FB4',
            confirmButtonText: 'OK'
        })
        return null;
    }

    function findIndex() {
        let index = 0
        for (book of books) {
            if (book.title === array2)
                return "Indeks Buku: " + index;

            index++;
        }

        return -1;
    }

    console.log(find())
    console.log(findIndex())
}