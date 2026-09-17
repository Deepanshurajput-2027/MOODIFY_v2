import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    posterUrl: {
      type: String,
    },
    mood: {
      type: String,
      enum: ['happy', 'sad', 'surprised', 'neutral', 'angry'],
      required: true,
    },
    subGenre: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ['local', 'spotify'],
      default: 'local',
    },
    spotifyId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model('Song', songSchema);

export default Song;
