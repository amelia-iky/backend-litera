const router = require('express').Router();
const book = require('../controllers/book.controller');
const { authentication } = require('../middleware/authentication.middleware');

// Favorite Books
router.post('/favorite', authentication(), book.addFavorite);
router.get('/favorite', authentication(), book.getFavorites);
router.delete('/favorite/:id', authentication(), book.deleteFavorite);

// Saved Books
router.post('/save', authentication(), book.addSave);
router.get('/save', authentication(), book.getSave);
router.delete('/save/:id', authentication(), book.deleteSave);

module.exports = router;
