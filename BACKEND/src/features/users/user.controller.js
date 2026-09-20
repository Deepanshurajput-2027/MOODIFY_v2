import User from './user.model.js';

export const updateProfile = async (req, res) => {
  try {
    const { displayName, avatarUrl } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 'profile.displayName': displayName, 'profile.avatarUrl': avatarUrl },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updateProfile controller: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
