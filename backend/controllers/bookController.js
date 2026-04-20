const Book = require('../models/Book');

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
exports.createBook = async (req, res) => {
  try {
      const { title, author, subtitle, chapters } = req.body;

      if (!title || !author) {
          return res.status(400).json({ message: 'Please provide a title and author' });
      }
    const book = await Book.create({
      userId: req.user._id,
      title,
      author,
      subtitle,
      chapters,
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all books for a user
// @route   GET /api/books
// @access  Private
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user._id }).sort({ createdAt: -1 }) ;
    // Sorts the result by createdAt field in descending order (-1 means newest first)
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single book by ID
// @route   GET /api/books/:id
// @access  Private
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if(!book){
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.userId.toString() === req.user._id.toString()) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: 'Not authorized to access this book' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
exports.updateBook = async (req, res) => { 
  try {
    const book = await Book.findById(req.params.id);
    
    if(!book){
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      res.status(404).json({ message: 'Not authorized to update this book' });
    }
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if(!book){
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      res.status(404).json({ message: 'Not authorized to update this book' });
    }
    await book.deleteOne();
    res.status(200).json({ message: 'Book removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a book's cover image
// @route   PUT /api/books/:id/cover
// @access  Private
// exports.updateBookCover = async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id);
//     if(!book){
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     if (book.userId.toString() !== req.user._id.toString()) {
//       res.status(404).json({ message: 'Not authorized to update this book' });
//     }
//     // if (req.file) {
//     //   book.coverImage = `/uploads/${req.file.filename.replace(/\\/g, '/')}`;
//     // //   the above line is used to replace the backslash with forward slash  we were using this when we were only getting one file that is coverpage

// // for multiple file, fields becomes an array and files a object like before so no change there
//     const coverFileArray = req.files && req.files['coverImage'];

//     if (coverFileArray && coverFileArray.length > 0) {
//       // 2. Access the file object at index [0]
//       const coverFile = coverFileArray[0];
// // here it will have just a single file bcz user is uploading ony a single pic
//       book.coverImage = `/uploads/${coverFile.filename.replace(/\\/g, '/')}`;
//     } else {
//       res.status(400).json({ message: 'No image file provided' });
//     }

//     const updatedBook = await book.save();
//     res.status(200).json(updatedBook);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// the above commented was the logic when the files were stored on the laptop now the below is when the logic is updated in cloudinary

exports.updateBookCover = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if Cloudinary upload worked
   if (req.uploadedFiles && req.uploadedFiles.coverImage) {
      book.coverImage = req.uploadedFiles.coverImage;
    } 
    else {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



