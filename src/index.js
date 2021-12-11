    // urls
const baseURL = 'http://localhost:3000'
const quotesURL = `${baseURL}/quotes`
const likesURL = `${baseURL}/likes`

    // helpers
const create = el => document.createElement(el)
const select = el => document.querySelector(el)

    // grab stuff
const allQuotesContainer = select('#quote-list')
const newQuoteForm = select('#new-quote-form')
const newQuoteContentInput = select('#new-quote')
const newQuoteAuthorInput = select('#author')

    // event listener on form
newQuoteForm.addEventListener('submit', e => handleNewQuoteSubmit(e))

    // callbacks
function renderQuote(quote) {
        // create
    const quoteCard = create('li')
    const blockQuote = create('blockquote')
    const quoteContent = create('p')
    const quoteAuthor = create('footer')
    const lineBreak = create('br')
    const likeBtn = create('button')
    const likesNum = create('span')
    const deleteBtn = create('button')
        // assign
    quoteCard.className = 'quote-card'
    blockQuote.className = 'blockquote'
    quoteContent.className = 'mb-0'
    quoteContent.textContent = quote.quote
    quoteAuthor.className = 'blockquote-footer'
    quoteAuthor.textContent = quote.author
    likeBtn.className = 'btn-success'
    likeBtn.textContent = 'Likes: '
    if(quote.likes) {
        likesNum.textContent = quote.likes.length
    } else {
        likesNum.textContent = 0
    }
    deleteBtn.className = 'btn-danger'
    deleteBtn.textContent = 'Delete'
        // event listener
    likeBtn.addEventListener('click', () => {
        likesNum.textContent = ''
        updateLikes(quote)
        likesNum.textContent = quote.likes.length
    })
    deleteBtn.addEventListener('click', () => {
        quoteCard.remove()
        deleteQuote(quote.id)
    })
        // append
    likeBtn.append(likesNum)
    blockQuote.append(quoteContent, quoteAuthor, lineBreak, likeBtn, deleteBtn)
    quoteCard.append(blockQuote)
    allQuotesContainer.append(quoteCard)
}

function handleNewQuoteSubmit(e) {
    e.preventDefault()
    let newQuote = {
        quote: e.target[0].value,
        author: e.target[1].value
    }
    createNewQuote(newQuote)
    renderQuote(newQuote)
    newQuoteForm.reset()
}

    // CRUD
        // Create
function createNewQuote(newQuote) {
    fetch(quotesURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
    })
    .then(r => r.json())
    .then(quote => quote)
} 
        // Read
function getQuotesWithLikes() {
    fetch(`${quotesURL}?_embed=likes`)
    .then(r => r.json())
    .then(quotes => quotes.forEach(quote => renderQuote(quote)))
}
        // Update
function updateLikes(quote) {
    fetch(likesURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteId: quote.id,
            createdAt: Math.ceil(Date.now() / 1000)
        })
    })
    .then(r => r.json())
    .then(quote => quote)
    allQuotesContainer.textContent = ''
    fetch(`${quotesURL}?_embed=likes`)
    getQuotesWithLikes();
}

        // Destroy
function deleteQuote(id){
    fetch(`${quotesURL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(r => r.json())
    .then(quote => quote)
}

    //initialize
getQuotesWithLikes();