import History from './history.model.js';

export const getUserHistory = async (req, res) => {
  try {
    const { type, limit } = req.query;
    
    const query = { userId: req.user._id };
    if (type) {
      query.type = type;
    }

    let historyQuery = History.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        historyQuery = historyQuery.limit(parsedLimit);
      }
    }

    const history = await historyQuery;
    res.status(200).json(history);
  } catch (error) {
    console.error('Error in getUserHistory controller: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
