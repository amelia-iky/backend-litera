const mongoose = require('mongoose');

const bookFavoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: String, required: true },
    title: String,
    author: String,
    tags: [String],
    coverImage: String,
  },
  { timestamps: true }
);

bookFavoriteSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  return { id: _id, ...object };
});

module.exports = mongoose.model('BookFavorite', bookFavoriteSchema);
