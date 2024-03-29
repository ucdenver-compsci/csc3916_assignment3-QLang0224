var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const MONGO_URI = "mongodb+srv://qlang:test123@assignment3.sacwi5f.mongodb.net/moviesDB?retryWrites=true&w=majority&appName=Assignment3"
mongoose.connect(MONGO_URI);

// Movie schema
var MovieSchema = new Schema({
  title: { type: String, required: true, index: true },
  releaseDate: { type: Number, min: [1900, 'Must be greater than 1899'], max: [2100, 'Must be less than 2100']},
  genre: {
    type: String,
    enum: [
      'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction'
    ],
  },
  actors: [{
    actorName: String,
    characterName: String,
  }],
});

// return the model
module.exports = mongoose.model('Movie', MovieSchema);
