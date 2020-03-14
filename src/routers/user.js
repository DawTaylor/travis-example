const express = require('express')
const router = express.Router()

const {
  createUser,
  deleteUser,
  getAllUsers,
  getByIdUser,
  getOneUser,
  updateUser
} = require('../controllers/user')

router.route('/users')
  .post(createUser)
  .get(getAllUsers);

router.route('/users/:userId')
  .get(getOneUser)
  .put(updateUser)
  .delete(deleteUser);

router.param('userId', getByIdUser);

module.exports = {
  router
}