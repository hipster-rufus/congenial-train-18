const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async getAllUsers(req, res) {
    await User.find({})
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .then((users) => {
        const userData = {
          users
        };
        return res.json(userData);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single users
  async getAUser(req, res) {
    await User.findOne({ _id: req.params.userId })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Create a new user
  async createUser(req, res) {
    await User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Update a user
  async updateUser(req, res) {
    await User.findOneAndUpdate(
      { _id: req.params.userId }, 
      { $set: req.body }, 
      { runValidators: true, new: true }
    )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "No user found with this id!" });
      }
      res.json(user);
    })
    .catch((err) => res.json(err));
  },
  // Delete a user
  async deleteUser(req, res) {
    await User.findOneAndRemove({ _id: req.params.userId })
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'User does not exist' })
        : Thought.deleteMany({ 
          _id: {
            $in: user.thoughts 
          }
        })
      )
    .then(() => res.json({ message: 'User successfully deleted' }))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },
  // Add a friend to a user
  async addFriend(req, res) {
    await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID :(' });
      }
      res.json(user);
    })
    .catch((err) => res.status(500).json(err));
  },
  // Remove friend from a user
  async removeFriend(req, res) {
    await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with that ID :(' })
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },
};