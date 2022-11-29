const { response } = require('express');
const { default: mongoose } = require('mongoose');
const Chat = require('../models/chatModel');
const Message = require('../models/messages');
const User = require('../models/users');
const grid = require('gridfs-stream');

const baseURL = 'https://mern-chatter-webapp21.herokuapp.com';

const getAllMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messageList = await Message.find({ chat: chatId })
      .populate('sender', '-password')
      .populate('chat');

    res.status(200).send(messageList);
  } catch (e) {
    res.status(500).send(e);
  }
};

const sendMessage = async (req, res) => {
  try {
    let message = await Message.create(req.body);
    message = await message.populate('sender', 'name userpic email');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name userpic email'
    });

    await Chat.findByIdAndUpdate(
      { _id: req.body.chat },
      { latestMessage: message }
    );

    res.status(201).send(message);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const uploadFile = async (req, res) => {
  console.log(req.file.mimetype);

  try {
    const payload = {
      sender: req.user._id,
      content: `${baseURL}/api/message/file/${req.file.filename}`,
      chat: req.body.chatId,
      isAttachMent: req.file.mimetype
    };
    let message = await Message.create(payload);
    message = await message.populate('sender', 'name userpic email');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name userpic email'
    });

    res.status(200).send(message);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'fs'
  });
  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection('fs');
});
const getFile = async (request, response) => {
  try {
    const file = await gfs.files.findOne({ filename: request.params.fileName });
    // const readStream = gfs.createReadStream(file.filename);
    // readStream.pipe(response);

    const readStream = gridfsBucket.openDownloadStream(file._id);
    readStream.pipe(response);
  } catch (error) {
    response.status(500).json({ msg: error.message });
  }
};

module.exports = {
  sendMessage,
  getAllMessages,
  uploadFile,
  getFile
};
