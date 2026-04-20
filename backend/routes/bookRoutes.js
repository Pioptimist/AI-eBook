const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const handleUpload = require('../middlewares/uploadMiddleware');
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  updateBookCover,
} = require('../controllers/bookController');

router.route('/').post(protect, createBook).get(protect, getBooks);

router
  .route('/:id')
  .get(protect, getBookById)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

router.route('/:id/cover').put(protect, handleUpload, updateBookCover);
// could have done router.put(protct,upload,uploadbookcover) but kyuki baaki routes router use kr rhe toh isme bhi krwa diya

module.exports = router;




// router.route() tb use kro jb multiple routes honge ek path pr alag-alag methoda ke saath

// jb bs ek hi ho toh simply do this router.get("/:id/doc", protect, exportAsDocument); 