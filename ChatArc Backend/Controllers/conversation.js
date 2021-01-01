const Conversation = require("../Models/conversation");
const User = require("../Models/user");

exports.initiateConversation = (req, res) => {
  const actualUser = req.body;

  const conversation = new Conversation();
  let conversationBetween = {};

  User.findById(req.userInfo._id).exec((err, userOne) => {
    if (err || !userOne) {
      return res.status(400).json({
        error: "You don't have account on ChatArc!",
      });
    }

    userOne.salt = undefined;
    userOne.encryptedPassword = undefined;
    userOne.createdAt = undefined;
    userOne.updatedAt = undefined;
    userOne.email = undefined;
    userOne.contactList = undefined;

    conversationBetween.user1 = userOne;

    User.findById(actualUser).exec((err, userTwo) => {
      if (err || !userTwo) {
        return res.status(400).json({
          error: "You don't have this account in your contacts!",
        });
      }

      userTwo.salt = undefined;
      userTwo.encryptedPassword = undefined;
      userTwo.createdAt = undefined;
      userTwo.updatedAt = undefined;
      userTwo.email = undefined;
      userTwo.contactList = undefined;

      conversationBetween.user2 = userTwo;

      conversation.between = conversationBetween;

      conversation.uniqueId = [userOne._id, userTwo._id]
        .sort()
        .join(process.env.IDCREATER);

      const tempConversation = [
        {
          from: userOne,
          date: Date.now(),
          messageBody:
            "New Conversation Initiated! Hope you'll enjoy chating on ChatArc",
        },
      ];

      conversation.conversation = tempConversation;

      conversation.save((err, initiatedConversation) => {
        if (err) {
          return userOne.petName === undefined || userTwo.petName === undefined
            ? res.status(400).json(err)
            : res.status(400).json({
                error: `Unable to initiate new conversation between ${userOne.petName} and ${userTwo.petName}`,
              });
        }

        return res.json(initiatedConversation);
      });
    });
  });
};

exports.getConversation = (req, res) => {
  const actualUser = req.body;

  const uniqueId = [req.userInfo._id, actualUser]
    .sort()
    .join(process.env.IDCREATER);

  Conversation.findOne({ uniqueId: uniqueId }).exec((err, chat) => {
    if (err || !chat) {
      return res.status(400).json({
        error: "No chats/conversations found with this uniqueId",
      });
    }

    return res.send(chat.conversation);
  });
};

exports.startChating = (req, res) => {
  let temp = JSON.parse(req.body);

  const { actualUser, messageBody } = temp;
  let newConversation = [];

  const uniqueId = [req.userInfo._id, actualUser]
    .sort()
    .join(process.env.IDCREATER);

  Conversation.findOne({ uniqueId: uniqueId }).exec((err, chat) => {
    if (err) {
      return res.status(400).json({
        error: "No chats/conversations found with this uniqueId",
      });
    }

    const newMessage = {
      from: req.userInfo,
      date: Date.now(),
      messageBody: messageBody,
    };

    newConversation.push(newMessage);

    Conversation.findOneAndUpdate(
      { uniqueId: uniqueId },
      { $push: { conversation: newConversation } },
      { new: true, useFindAndModify: false },
      (err, chat) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            error: "Unable to send the message and update the conversation!",
          });
        }

        return res.json("Added new message to conversation");
      }
    );
  });
};

exports.deleteChats = (req, res) => {
  const actualUser = req.body;
  let newConversation = [];

  const uniqueId = [req.userInfo._id, actualUser]
    .sort()
    .join(process.env.IDCREATER);

  Conversation.findOne({ uniqueId: uniqueId }).exec((err, chat) => {
    if (err) {
      return res.status(400).json({
        error: "No chats/conversations found with this uniqueId",
      });
    }

    Conversation.findOneAndUpdate(
      { uniqueId: uniqueId },
      { $set: { conversation: newConversation } },
      { new: true, useFindAndModify: false },
      (err, chat) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            error: "Unable to send the message and update the conversation!",
          });
        }

        return res.json("NO CHATS EXIST HERE NOW!");
      }
    );
  });
};
