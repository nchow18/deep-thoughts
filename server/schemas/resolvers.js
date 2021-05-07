const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            // checks user with context from server.js
            if (context.user) {
                //checks user._id with context if it has been authorized
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('thoughts')
                .populate('friends');
            
            return userData;
            }
            throw new AuthenticationError('Not Logged in');
        },
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
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect Credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect Credentials');
            }

            // returns the data with token(user) and user data
            //user data passes through signToken as JWT and displays new token encoded data
            const token = signToken(user);
            return { token, user };
        },
        addThought: async (parent, args, context) => {
            // context.user checkts if user is logged in through middleWare authentication
            if (context.user) {
                const thought = await Thought.create({ ...args, username: context.user.username })

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { thoughts: thought._id }},
                    { new: true }
                )
                return thought;
            }
            // gives an error if (context.user) fails authentication
            throw new AuthenticationError('You need to be logged in!');
        },
        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    { _id: thoughtId },
                    { $push: { reactions: { reactionBody, username: context.user.username }}},
                    { new: true, runValidators: true }
                );
                return updatedThought;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    //$addToSet is used instead of $push to prevent duplicate entries
                    { $addToSet: { friends: friendId }},
                    { new: true }
                ).populate('friends');
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!')
        }
    }
};

module.exports = resolvers;