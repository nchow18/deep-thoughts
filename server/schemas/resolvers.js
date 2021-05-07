const { User, Thought, Reaction } = require('../models');

const resolvers = {
    Query: {
      thoughts: async (parent, { username }) => {
          // ? is the ternary to check of username exists, if it does, it returns username, if it doesn't it returns an empty object {}
          const params = username ? { username } : {};
          // after the object is returned, it will .find() params and sort in a descending order
          return Thought.find(params).sort({ createdAt: -1 })
      },
      // finds ONE thought
      thought: async (parent, { _id }) => {
          return Thought.findOne({ _id });
      },
      // get all users
      users: async () => {
          return User.find()
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
      },
      // get ONE user by username
      user: async (parent, { username }) => {
          return User.findOne({ username })
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
      },
    }
};

module.exports = resolvers;