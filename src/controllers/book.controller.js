const Favorite = require('../models/bookFavorite.model');

exports.addFavorite = async (req, res) => {
  const { bookId, title, author, coverImage } = req.body;

  try {
    if (!bookId || !title) {
      return res.status(400).json({ message: 'bookId and title are required' });
    }

    const existing = await Favorite.findOne({ user: req.user.id, bookId });
    if (existing) {
      return res.status(400).json({ message: 'Book already in favorites' });
    }

    const favorite = new Favorite({
      user: req.user.id,
      bookId,
      title,
      author,
      coverImage,
    });

    await favorite.save();
    res.status(201).json({ favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate(
      'user'
    );
    res.status(200).json({ favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
