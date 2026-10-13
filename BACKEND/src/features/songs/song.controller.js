import Song from './song.model.js';
import imagekit from '../../config/imagekit.js';
import { logUserActivity } from '../history/history.service.js';

// === IMAGEKIT CLOUD BROWSER ===
const SONGS_FOLDER = '/cohort-2-moodify-songs/songs/songs';
const POSTERS_FOLDER = '/cohort-2-moodify-posters';

export const listCloudSongs = async (req, res) => {
  try {
    // Fetch all audio files from the songs folder
    const songFiles = await imagekit.listFiles({
      path: SONGS_FOLDER,
      sort: 'ASC_NAME',
    });

    // Fetch all poster files from the posters folder
    const posterFiles = await imagekit.listFiles({
      path: POSTERS_FOLDER,
      sort: 'ASC_NAME',
    });

    // Filter to only audio files
    const audioFiles = songFiles.filter(f => 
      f.name.endsWith('.mp3') || f.name.endsWith('.wav') || f.name.endsWith('.ogg') || f.name.endsWith('.m4a')
    );

    // Filter to only image files for posters
    const imageFiles = posterFiles.filter(f =>
      f.name.endsWith('.jpg') || f.name.endsWith('.jpeg') || f.name.endsWith('.png') || f.name.endsWith('.webp')
    );

    // Map each audio file to a track object, pairing with a poster by index
    const tracks = audioFiles.map((file, idx) => {
      // Clean up filename to use as title (remove extension and replace separators)
      const rawName = file.name.replace(/\.[^/.]+$/, ''); // remove extension
      const title = rawName
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()) // Title Case
        .substring(0, 60); // Truncate very long hashed names

      // Pair with a poster cyclically
      const poster = imageFiles.length > 0 
        ? imageFiles[idx % imageFiles.length] 
        : null;

      return {
        id: file.fileId,
        title: title,
        artist: 'Moodify Cloud',
        audioUrl: file.url,
        cover: poster ? poster.url : '',
        duration: file.size, // raw size, frontend can format
        fileName: file.name,
      };
    });

    res.status(200).json({ success: true, tracks, count: tracks.length });
  } catch (error) {
    console.error('Error listing cloud songs:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch cloud songs', error: error.message });
  }
};

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
    logUserActivity(req.user._id, 'scan', { mood: req.query.mood });
    res.status(200).json(songs);
  } catch (error) {
    console.log('Error in getSongsByMood controller: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
