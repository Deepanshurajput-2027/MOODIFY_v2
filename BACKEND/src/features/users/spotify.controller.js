import axios from 'axios';
import User from './user.model.js';

export const connectSpotify = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

    const authOptions = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      }).toString(),
      headers: {
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const tokenResponse = await axios(authOptions);
    const { access_token, refresh_token } = tokenResponse.data;

    const userProfileResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const spotifyId = userProfileResponse.data.id;

    await User.findByIdAndUpdate(req.user._id, {
      'integrations.spotifyAccessToken': access_token,
      'integrations.spotifyRefreshToken': refresh_token,
      'integrations.spotifyId': spotifyId
    });

    res.status(200).json({ message: 'Spotify connected successfully' });
  } catch (error) {
    console.error('Error in connectSpotify controller: ', error.message);
    res.status(500).json({ message: 'Failed to connect Spotify' });
  }
};
