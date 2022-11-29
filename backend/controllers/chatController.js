const Chat = require('../models/chatModel');
const User = require('../models/users');

const accesschat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400);

    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } }
      ]
    })
      .populate('users', '-password')
      .populate('latestMessage');

    isChat = await User.populate(isChat, {
      path: 'latestMessage.sender',
      select: 'name pic email'
    });

    if (isChat.length > 0) {
      res.status(200).send(isChat[0]);
    } else {
      const userName = await User.findOne({ _id: userId });
      var chatData = {
        chatName: userName?.name,
        isGroupChat: false,
        users: [req.user._id, userId]
      };

      const createdChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );

      res.status(200).send(FullChat);
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

const fetchchats = async (req, res) => {
  try {
    const chatList = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } }
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'name pic email'
        });

        return results;
      });

    res.status(200).send(chatList);
  } catch (e) {
    res.status(500).send(e);
  }
};

const createGroupChat = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name)
      return res.status(400).send({ message: 'Please fill all the fields' });

    const { users, name } = req.body;

    if (users.length < 2) {
      res.status(400).send({
        message: 'More than 2 users are required to make a group chat'
      });
    }

    users.push(req.user);

    const chatData = {
      chatName: name,
      users,
      isGroupChat: true,
      groupAdmin: req.user
    };

    const groupChat = Chat.create(chatData);

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).send(fullGroupChat);
  } catch (e) {
    res.status(500).send(e);
  }
};

const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const chat = await Chat.findByIdAndUpdate(chatId, { chatName });
    const updatedChat = await Chat.findById(chatId)
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage');

    res.status(200).send(updatedChat);
  } catch (e) {
    res.status(500).send(e);
  }
};

const fetchIndividualChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).send(chat);
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = {
  accesschat,
  fetchchats,
  createGroupChat,
  renameGroup,
  fetchIndividualChat
};
