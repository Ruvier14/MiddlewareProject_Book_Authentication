const Book = require('../models/bookModel');
const { log } = require('util');

// rendering a new book to send the HTML to the client browser
// so user can fetch the data

exports.addBook = async(req, res) => {
    try {
        res.render('./books/bookExchangeAddForm');
    } catch (err) {
        res.status(400).render('appError', {title: 'Addd new Book', user:req.user, errors: err.errors });
    }

};



// here we create a new book
exports.createBook = async (req,res) => {
    try {
        const book = new Book ({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            exchageType: req.body.exchageType,
            owner: req.user._id, // For this one, we just assume that it contains authenticated user
            status: req.body.status
        });
        const newBook = await book.save();
        res.redirect('/books'); // this is where you list all of the books in /books
    } catch (err) {
        res.status(400).render('appError', {title: 'Create Book', user: req.user, errors: err.errors});
    }j
};

// READ GET all books

exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.render('./books/bookListForm', {title: 'All Books', uiser: req.user, books});
    } catch (err) {
        res.status(500).render('error,' , {message: err.message});
    }
};


// GET a SINGLE Book by ID

exports.getBookByID = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).render('error', {message: 'Book not found'});
        }
        res.render('./books/bookExchangeDetails', {book});
    } catch (err) {
        res.status(500).render('error', {message: err.message});
    }
};



// UPDATE a book by ID 
// Render update from send the HTML from to the client (browser) so that user can fetch the data
exports.updateBookForm = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        console.log('Book ID from params:', req.params.id); // STEP 3
        

        if (!book) {
            console.log('Book not found'); // STEP 5
            return res.status(404).json({ message: 'Boook not found'});
        }

        console.log('Book Found', book); // step 4

        res.render('./books/booksExchangeDetails', {book:book});
        
    } catch (err) {
        res.status(400).render('appError', { title: 'Update Book', user: req.user, errors: err.errors});
    }
};

exports.updateBookById = async (req, res) => {
    try {
        const book = await Book.findByIdandUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!book) {
            return res.status(404).render("error", { message: "Book not found"});
        }

        const updatedBooks = await Book.find();
        res.render(`./books/bookListForm`, {books: updatedBooks}); // Redirect to book detail page
    } catch (err) {
        res.status(500).render('error', { message: err.message});
    }
};


// DELETE 

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdandRemove(req.params.id);
        if (!book) {
            return res.status(404).render('error', {message: 'Book not found'});
        }
        res.redirect('/books'); // Redirect to all books on the list available
    } catch (err) {
        res.status(500).render('error', {message: error.message});
    } 
};