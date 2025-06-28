const mongoose = require('mongoose');

const bookSaveSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: String, required: true },
    title: String,
    author: String,
    price: String,
    coverImage: String,
  },
  { timestamps: true }
);

bookSaveSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  return { id: _id, ...object };
});

module.exports = mongoose.model('BookSave', bookSaveSchema);
