const { Schema, Types, model } = require('mongoose');

const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      maxlength: 280,
      minlength: 1,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    username: {
      type: String,
      required: true,
      ref: 'user'
    }
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    username: {
      type: String,
      required: true,
      ref: 'user'
    },
    reactions: [ReactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

ThoughtSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reactions.length;
  });

const Reaction = model('Reaction', ReactionSchema);
module.exports = Reaction;

const Thought = model('Thought', ThoughtSchema);
module.exports = Thought;
