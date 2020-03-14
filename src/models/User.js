const { Types: { ObjectId }} = require('mongoose')
const R = require('ramda')
const { db: DB } = require('../database/Database')

class User {
  static collection = 'users'
  constructor(data) {
    this.db = DB
    this.collection = 'users'
    const newId = new ObjectId().toString()
    this.user = R.pipe(
      R.pickAll(['email', 'firstName', 'lastName']),
      R.assocPath(['_id'], newId)
    )(data)
  }

  static findOne(query, fn) {
    const user = R.head(DB.getEntities(query, this.collection))
    if(!user || user.length < 1) return (fn('user not found'))
    return fn(null, user)
  }

  static findByIdAndUpdate(id, payload, _, fn) {
    const updatedUser = DB.updateEntity(id, payload, this.collection)

    return fn(null, updatedUser)
  }

  static find(fn) {
    const users = DB.getEntities(null, this.collection)
    return fn(null, users)
  }

  static remove(id, fn) {
    DB.deleteEntity(id, this.collection)

    return fn()
  }

  save(fn) {
    const existingUser = this.db.getEntities({ email: this.user.email }, this.collection)

    if(existingUser && existingUser.length > 0) {
      return fn('user.email should be unique')
    }

    this.db.saveEntity(this.user, this.collection)

    fn()
  }
}

module.exports = { 
  User
}