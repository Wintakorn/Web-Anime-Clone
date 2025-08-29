  import mongoose from "mongoose"

const mangaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  synopsis: {
    type: String,
    trim: true,
    default: ""
  },
  genre: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    trim: true
  },
  episodes: {
    type: Number,
    default: 0,
    min: 0
  },
  releaseDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    trim: true
  },
  createdBy: {
    type: String,
    trim: true
  },
  premiered: String,
  aired: String,
  broadcast: String,
  producers: {
    type: [String],
    default: []
  },
  licensors: {
    type: [String],
    default: []
  },
  studios: {
    type: [String],
    default: []
  },
  source: String,
  demographic: String,
  duration: String,
  rating: String,
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  ranked: String,
  popularity: {
    type: Number,
    default: 0
  },
  members: {
    type: Number,
    default: 0
  },
  favorite: {
    type: Number,
    default: 0
  },
  animeSimpleUrl: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    default: 0
  },
  discountPercent: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      return ret
    }
  },
  toObject: {
    virtuals: true
  }
})
const Manga = mongoose.model("Manga", mangaSchema)

export default Manga
