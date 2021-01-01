const User = require("../Models/user");
const Conversation = require("../Models/conversation");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found!",
      });
    }
    req.userInfo = user;
    next();
  });
};

exports.getUser = (req, res) => {
  return res.json(req.userInfo);
};

exports.getParticularContactByUsername = (req, res, next) => {
  const { petName } = req.body;
  const contactList = req.userInfo.contactList;

  contactList.forEach((object) => {
    if (object.petName === petName) {
      res.locals = object;
      next();
    }
  });
};

exports.getUserContacts = (req, res) => {
  return res.json(req.userInfo.contactList);
};

exports.getPetnameByActualUser = (req, res) => {
  const { actualUser } = req.body;
  const contactList = req.userInfo.contactList;

  console.log("Here");
  contactList.forEach((object) => {
    if (object.actualUser.equals(actualUser)) {
      return res.json(object.petName);
    }
  });
  return res.json("No such contact exists");
};

exports.createContact = (req, res) => {
  let temp = JSON.parse(req.body);

  let contacts = [];
  const { petName, actualUsername } = temp;

  User.findOne({ username: actualUsername }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "This user does not exist",
      });
    }

    if (user._id.equals(req.userInfo._id)) {
      return res.json({
        error: "You cannot add yourself as your contact",
      });
    }

    let checkContactList = req.userInfo.contactList;
    let checker = 0;

    checkContactList.forEach((element) => {
      if (user._id.equals(element.actualUser) || petName === element.petName) {
        checker++;
      }
    });

    if (checker !== 0) {
      return res.json({
        error:
          "Either this contact already exists in your contact list or this petName is already used by you!",
      });
    }

    let contactInfo = {
      petName: petName,
      actualUser: user,
    };

    contacts.push(contactInfo);

    User.findOneAndUpdate(
      { _id: req.userInfo._id },
      { $push: { contactList: contacts } },
      { new: true, useFindAndModify: false },
      (err, contacts) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            error: "Unable to save this contact to contact List",
          });
        }

        return res.json({
          message: `${user.username} is added to your contact list as ${petName} successfully!`,
        });
      }
    );
  });
};

// TODO: Updating contacts is to be implemented!
// exports.updateContact = (req, res) => {
//   const { petNameInitial, petNameFinal } = req.body;

//   User.findOneAndUpdate(
//     { "contactList.petName": petNameInitial },
//     { $set: { petName: petNameFinal } },
//     // { safe: true, upsert: true },
//     { new: true, useFindAndModify: false },
//     (err, user) => {
//       if (err) {
//         return res.status(400).json({
//           error: "No updation done!",
//         });
//       }

//       return res.json(req.userInfo.contactList);
//     }
//   );
// };

exports.deleteContact = (req, res) => {
  const petName = req.body;

  User.findByIdAndUpdate(
    req.userInfo._id,
    { $pull: { contactList: { petName: petName } } },
    { safe: true, upsert: true, useFindAndModify: false, new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "No deletion done!",
        });
      }

      return res.json("Contact deleted successfully");
    }
  );
};

exports.updateMe = (req, res) => {
  User.findByIdAndUpdate(
    req.userInfo._id,
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "User info updation failed",
        });
      }

      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      return res.json(user);
    }
  );
};

exports.deleteMe = (req, res) => {
  User.findByIdAndRemove(req.userInfo._id, { useFindAndModify: false }).exec(
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to delete your ChatArc account",
        });
      }

      return res.json({
        message: `Thaks for using ChatArc ${user.username}`,
      });
    }
  );
};
