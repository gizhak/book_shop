'use strict'

var gCurrentBookId = null


function onInit() {
    renderBooks()
}


function renderBooks() {

    const books = getBooks()
    console.log('books', books)

    const elBookList = document.querySelector('.books_list')
    console.log(elBookList)

    var strHtmls = books.map(books => `
        <tr>
        <td class= "title">${books.title}</td>
        <td class= "price">${books.price}</td>
        <td class= "rating">${books.rating}</td>
        <td>
            <button onclick = "onRead('${books.id}')">Read</button>
            <button onclick = "onUpdateBook('${books.id}')">Update</button>
            <button onclick = "onRemoveBook('${books.id}')">Delete</button>
        </td>
        </tr>`)

    elBookList.innerHTML = strHtmls.join('')

    renderStats()
    renderFilter()
    renderRatingFilter()
    renderPagination()
}

function onClearFilter() {
    clearFilter()

    document.querySelector('.filter-book-name').value = ''
    document.querySelector('.rating-book').value = '0'
    document.querySelector('input[type="range"]').value = '0'
    document.querySelector('.price-display').innerText = '0'

    renderBooks()
}

function renderFilter() {

    const books = getAllBooks()

    const elBookFilter = document.querySelector('.filter-book-name')

    console.log(elBookFilter)

    const currentValue = elBookFilter.value
    console.log('Book Filter', elBookFilter.value)
    const uniqueTitles = [...new Set(books.map(book => book.title))]

    var strHtmls = `<option value="">All Books</option>`
    uniqueTitles.forEach(title => {
        strHtmls += `<option value="${title}">${title}</option>`
    })

    elBookFilter.innerHTML = strHtmls

    elBookFilter.value = currentValue

}

function renderRatingFilter() {
    const books = getAllBooks()

    const elRatingFilter = document.querySelector('.rating-book')

    console.log(elRatingFilter)

    const currentRatingValue = elRatingFilter.value
    console.log('rating value', currentRatingValue)
    const uniqueRatings = [...new Set(books.map(book => book.rating))]

    var strHtmls = `<option value="">Choose Rating</option>`
    uniqueRatings.forEach(rating => {
        strHtmls += `<option value="${rating}">${rating}</option>`
    })

    elRatingFilter.innerHTML = strHtmls
    elRatingFilter.value = currentRatingValue
    console.log('rating value', currentRatingValue)
}

function renderPagination() {
    const elPageInfo = document.querySelector('.page-info')
    const currentPage = gPageBy.pageIdx + 1
    const totalPages = getTotalPages()

    elPageInfo.innerText = `Page ${currentPage} of ${totalPages}`
}

function onNextPage() {
    nextPage()
    renderBooks()
    renderPagination()
}

function onPrevPage() {
    prevPage()
    renderBooks()
    renderPagination()
}


function onSetSortBy(by) {
    setSortBy(by)
    renderBooks()
}

function onSetSortDir(dir) {
    setSortDir(dir)
    renderBooks()
}

function onClearFilter() {
    clearFilter()
    renderBooks()

    document.querySelector('.filter-book-name').value = ''
    document.querySelector('.rating-book').value = ''
    // document.querySelector('.range').value = 0
}


function renderStats() {

    const elTotalBooks = document.querySelector('.total-todos')

    const total = getTotalBooks()

    elTotalBooks.innerText = total
}

function onRemoveBook(booksId) {
    console.log('remove book', booksId)
    removeBook(booksId)
    flashMsg('Book Deleted')

    renderBooks()
}

function onUpdateBook(booksId) {
    // updatePrice()
    console.log('update book', booksId)
    gCurrentBookId = booksId

    const book = getBookById(booksId)

    const elBookModal = document.querySelector('.update-book-modal')
    elBookModal.classList.add('open')
    elBookModal.querySelector('.title').value = book.title
    elBookModal.querySelector('.price').value = book.price
    elBookModal.querySelector('.rating').value = book.rating


    // const newPrice = +prompt('The Price is: ', book.price)
    // updateBook(booksId, newPrice)

    // flashMsg(book.title + ' Price Updated : ' + newPrice)

    // renderBooks()
}


function onUpdateModal() {

    const elBookModal = document.querySelector('.update-book-modal')

    const bookName = elBookModal.querySelector('.title').value
    const newPrice = +elBookModal.querySelector('.price').value
    const newRating = +elBookModal.querySelector('.rating').value

    updateBook(gCurrentBookId, bookName, newPrice, newRating)
    elBookModal.classList.remove('open')
    flashMsg('Book Updated!')
    renderBooks()
}


function onAddBook() {

    // const book = getBookById(booksId)
    // console.log(book)
    const elBookModal = document.querySelector('.adding-book-modal')
    elBookModal.classList.add('open')

    elBookModal.querySelector('.title').value = ''
    elBookModal.querySelector('.price').value = ''
    elBookModal.querySelector('.rating').value = ''

    // console.log('Add Book')
    // const bookName = prompt('Add Book Name: ')
    // if (!bookName) {
    //     alert('Book Name is required')
    //     return
    // }

    // const addPrice = +prompt('Add Book Price: ')
    // if (!addPrice || addPrice < 0) {
    //     alert('Missing price')
    //     return
    // }

    // const addRating = +prompt('Add rating between 0 to 5')
    // if (!addRating) {
    //     alert('Please add correct rating')
    //     if (addRating > 5) {
    //         alert('Rating should be between 5 to 0 ')
    //     }
    //     return
    // }

    // addBook(bookName, addPrice, addRating)
    // addBook(bookName)
    // flashMsg('Book Added')
    // renderBooks()
}

function onSaveModal() {

    const elBookModal = document.querySelector('.adding-book-modal')

    const bookName = elBookModal.querySelector('.title').value
    const addPrice = +elBookModal.querySelector('.price').value
    const addRating = +elBookModal.querySelector('.rating').value

    addBook(bookName, addPrice, addRating)
    elBookModal.classList.remove('open')
    renderBooks()
}



function onRead(booksId) {
    console.log('Read')
    const book = getBookById(booksId)
    const el = document.querySelector('.modal')
    console.log(el)
    el.querySelector('h3').innerText = book.title
    el.querySelector('h5 span').innerText = book.rating
    el.querySelector('h4 span').innerText = book.price
    el.querySelector('p').innerText = book.desc + '!!'
    el.classList.add('open')
}

function onCloseModal() {
    console.log('close')
    document.querySelector('.modal').classList.remove('open')
    document.querySelector('.adding-book-modal').classList.remove('open')
    document.querySelector('.update-book-modal').classList.remove('open')
}

function onSetFilterBy(filterBy) {
    setFilterBy(filterBy)
    renderBooks()
}

function onPriceChange(value) {
    document.querySelector('.price-display').innerText = value
    onSetFilterBy({ minPrice: value })
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

