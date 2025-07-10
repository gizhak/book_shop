'use strict'

var gBooks

console.log(gBooks)

_createBooks()

var gFilterBy = {
    title: '',
    minPrice: 0,
    minRating: 0,
}

var gSortBy = {
    by: 'title',
    dir: 1
}

var gPageBy = {
    pageIdx: 0,
    pageSize: 5
}

function setSortBy(by) {
    gSortBy.by = by
}

function setSortDir(dir) {
    gSortBy.dir = dir
}

function setFilterBy(filterBy) {
    if (filterBy.title !== undefined) gFilterBy.title = filterBy.title
    if (filterBy.minPrice !== undefined) gFilterBy.minPrice = filterBy.minPrice
    if (filterBy.rating !== undefined) gFilterBy.minRating = filterBy.rating

}

function getBooks() {
    const books = gBooks.filter(book => book.title.includes(gFilterBy.title) &&
        (book.price >= gFilterBy.minPrice) && (book.rating >= gFilterBy.minRating))

    const sortedBooks = sortBooks(books)

    const startIdx = gPageBy.pageIdx * gPageBy.pageSize
    const endIdx = startIdx + gPageBy.pageSize

    return sortedBooks.slice(startIdx, endIdx)
}

function sortBooks(books) {
    return books.sort((a, b) => {
        let valueA = a[gSortBy.by]
        let valueB = b[gSortBy.by]

        return (valueA > valueB ? 1 : -1) * gSortBy.dir
    })
}

function clearFilter() {
    gFilterBy.title = ''
    gFilterBy.minRating = 0
    gFilterBy.minPrice = 0
}

function getAllBooks() {
    return gBooks
}


function getBookById(booksId) {
    const book = gBooks.find(book => book.id === booksId)
    return book
}


function updateBook(booksId, newTitle, newPrice, newRating) {
    const book = gBooks.find(book => book.id === booksId)
    book.title = newTitle
    book.price = newPrice
    book.rating = newRating
    saveToStorage('bookDB', gBooks)
    return book
}

function removeBook(booksId) {
    const idx = gBooks.findIndex(book => book.id === booksId)
    gBooks.splice(idx, 1)

    saveToStorage('bookDB', gBooks)
}

function addBook(bookName, addPrice, addRating) {
    const book = _createBook(bookName, addPrice, addRating)
    gBooks.unshift(book)
    saveToStorage('bookDB', gBooks)
    return book
}

function getTotalBooks() {
    return gBooks.length
}

function _createBooks() {

    var books = loadFromStorage('bookDB')

    if (!books) {

        books = [
            _createBook('World', 25, 3),
            _createBook('Zorba', 35, 1),
        ]
        saveToStorage('bookDB', books)
    }

    gBooks = books
}


function _createBook(bookName, addPrice, addRating) {
    return {
        id: makeid(),
        title: bookName,
        price: addPrice,
        rating: addRating,
        desc: makeLorem(),
    }

}


function nextPage() {
    const totalPages = getTotalPages()
    if (gPageBy.pageIdx < totalPages - 1) {
        gPageBy.pageIdx++
    } else {
        gPageBy.pageIdx--
    }
}

function prevPage() {
    if (gPageBy.pageIdx > 0) {
        gPageBy.pageIdx--
    } else {
        gPageBy.pageIdx++
    }
}

function getTotalPages() {
    const filteredBooks = getFilteredBooks()
    return Math.ceil(filteredBooks.length / gPageBy.pageSize)
}

function getFilteredBooks() {
    return gBooks.filter(book => book.title.includes(gFilterBy.title) &&
        (book.price >= gFilterBy.minPrice) && (book.rating >= gFilterBy.minRating))
}
