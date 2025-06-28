const router = require('express').Router();
const book = require('../controllers/book.controller');
const { authentication } = require('../middleware/authentication.middleware');

// Favorite
router.post('/favorite', authentication(), book.addFavorite);
router.get('/favorite', authentication(), book.getFavorites);
router.delete('/favorite/:id', authentication(), book.deleteFavorite);

module.exports = router;
