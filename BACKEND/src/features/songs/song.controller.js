import Song from './song.model.js';
import imagekit from '../../config/imagekit.js';

export const uploadLocalSong = async (req, res) => {
  try {
    const { title, mood, subGenre } = req.body;
    
    if (!title || !mood) {
      return res.status(400).json({ message: 'Title and mood are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Convert buffer to base64
    const fileBase64 = req.file.buffer.toString('base64');

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: fileBase64, // base64 string
      fileName: req.file.originalname,
      folder: '/moodify_songs',
    });

    const newSong = new Song({
      title,
      mood,
      subGenre,
      source: 'local',
      url: uploadResponse.url,
    });

    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    console.log('Error in uploadLocalSong controller: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addSpotifySong = async (req, res) => {
  try {
    const { title, mood, subGenre, spotifyId } = req.body;

    if (!title || !mood || !spotifyId) {
      return res.status(400).json({ message: 'Title, mood, and spotifyId are required' });
    }

    const newSong = new Song({
      title,
      mood,
      subGenre,
      spotifyId,
      source: 'spotify',
      url: `https://open.spotify.com/track/${spotifyId}` // Placeholder URL for spotify tracks
    });

    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    console.log('Error in addSpotifySong controller: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSongs = async (req, res) => {
  try {
    const { mood, subGenre, source } = req.query;
    
    // Construct query dynamically
    const query = {};
    if (mood) query.mood = mood;
    if (subGenre) query.subGenre = subGenre;
    if (source) query.source = source;

    const songs = await Song.find(query).sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (error) {
    console.log('Error in getSongs controller: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSongsByMood = async (req, res) => {
  try {
    const { mood } = req.query;
    
    if (!mood) {
      return res.status(400).json({ message: 'Mood query parameter is required' });
    }

    const songs = await Song.find({ mood }).sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (error) {
    console.log('Error in getSongsByMood controller: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
