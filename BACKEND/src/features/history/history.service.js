import History from './history.model.js';

export const logUserActivity = async (userId, type, data = {}) => {
  try {
    const { mood, subGenre, details } = data;
    
    const newHistory = new History({
      userId,
      type,
      mood,
      subGenre,
      details,
    });
    
    await newHistory.save();
  } catch (error) {
    console.error('Error in logUserActivity service: ', error.message);
  }
};
