const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
  async getAllThoughts(req, res) {
    await Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single thought
  async getAThought(req, res) {
    await Thought.findOne({ _id: req.params.thoughtId })
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }
        res.json(thought);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new thought
  async createThought(req, res) {
    await Thought.create(req.body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        .then(thought => {
            if (!thought) {
                res.status(404).json({ message: 'No user with that id' });
                return;
            }
            res.json(thought);
        })
        .catch(err => res.json(err));
},
  // Update a thought
  async updateThought(req, res) {
    await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId }, 
      { $set: req.body }, 
      { runValidators: true, new: true })
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought with that ID" });
          return;
        }
        res.json(thought);
      })
      .catch((err) => res.json(err));
  },
  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }
        res.json({ message: 'Thought has been successfully deleted!'})
      })
      .catch((err) => res.status(500).json(err));
  },
  // Add a reaction to a thought
  async addReaction(req, res) {
    await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
    .then((thought) => {
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with that ID :(' });
      }
      res.json(thought);
    })
    .catch((err) => res.status(500).json(err));
  },
  // Remove reaction from a thought
  async removeReaction(req, res) {
    await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { new: true }
    )
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with that ID :('});
        }
       res.json(thought);
      })
      .catch(err => res.json(err));
  }
};
