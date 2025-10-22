const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
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

router.route('/:id/cover').put(protect, upload, updateBookCover);

module.exports = router;