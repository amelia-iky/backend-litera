const BookFavorite = require('../models/bookFavorite.model');
const BookSave = require('../models/bookSave.model');

// Add favorite
exports.addFavorite = async (req, res) => {
  const { bookId, title, author, tags, coverImage } = req.body;

  try {
    if (!bookId || !title) {
      return res.status(400).json({ message: 'Data is required' });
    }

    const existing = await BookFavorite.findOne({ user: req.user.id, bookId });
    if (existing) {
      return res.status(400).json({ message: 'Data already in exists' });
    }

    const data = new BookFavorite({
      user: req.user.id,
      bookId,
      title,
      author,
      tags: tags || [],
      coverImage,
    });

    await data.save();
    res.status(201).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get favorites
exports.getFavorites = async (req, res) => {
  try {
    const data = await BookFavorite.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user');

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete favorite
exports.deleteFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: 'id is required' });
    }

    const data = await BookFavorite.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add favorite
exports.addSave = async (req, res) => {
  const { bookId, title, author, price, coverImage } = req.body;

  try {
    if (!bookId || !title) {
      return res.status(400).json({ message: 'Data is required' });
    }

    const existing = await BookSave.findOne({ user: req.user.id, bookId });
    if (existing) {
      return res.status(400).json({ message: 'Data already exists' });
    }

    const data = new BookSave({
      user: req.user.id,
      bookId,
      title,
      author,
      price: price,
      coverImage,
    });

    await data.save();
    res.status(201).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get favorites
exports.getSave = async (req, res) => {
  try {
    const data = await BookSave.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user');

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete favorite
exports.deleteSave = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: 'id is required' });
    }

    const data = await BookSave.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
