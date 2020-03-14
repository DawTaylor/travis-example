const { User } = require('../models/User')

const createUser = function (req, res, next) {
  const user = new User(req.body);

  user.save(function (err) {
    if (err) {
      next(err);
    } else {
      res.json(user);
    }
  });
};

const updateUser = function (req, res, next) {
  User.findByIdAndUpdate(req.user._id, req.body, {new: true}, function (err, user) {
    if (err) {
      next(err);
    } else {
      res.json(user);
    }
  });
};

const deleteUser = function (req, res, next) {
  User.remove(req.user._id, function (err) {
    if (err) {
      next(err);
    } else {
      res.json(req.user);
    }
  });
};

const getAllUsers = function (req, res, next) {
  User.find(function (err, users) {
    if (err) {
      next(err);
    } else {
      res.json(users);
    }
  });
};

const getOneUser = function (req, res) {
  res.json(req.user);
};

const getByIdUser = function (req, res, next, id) {
  User.findOne({_id: id}, function (err, user) {
    if (err) {
      return next(err);
    }

    req.user = user;
    return next();
  });
};

module.exports = {
  getAllUsers,
  getByIdUser,
  getOneUser,
  deleteUser,
  updateUser,
  createUser,
}