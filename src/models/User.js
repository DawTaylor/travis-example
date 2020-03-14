const { Types: { ObjectId }} = require('mongoose')
const R = require('ramda')
const { db: DB } = require('../database/Database')

const COLLECTION = 'users'

class User {
  #db
  constructor(data) {
    this.#db = DB
    const newId = new ObjectId().toString()
    this.user = R.pipe(
      R.pickAll(['email', 'firstName', 'lastName']),
      R.assocPath(['_id'], newId)
    )(data)
  }

  static findOne(query, fn) {
    const user = R.head(DB.getEntities(query, COLLECTION))
    if(!user || user.length < 1) return (fn('user not found'))
    return fn(null, user)
  }

  static findByIdAndUpdate(id, payload, _, fn) {
    const updatedUser = DB.updateEntity(id, payload, COLLECTION)

    return fn(null, updatedUser)
  }

  static find(fn) {
    const users = DB.getEntities(null, COLLECTION)
    return fn(null, users)
  }

  static remove(id, fn) {
    DB.deleteEntity(id, COLLECTION)

    return fn()
  }

  save(fn) {
    const existingUser = this.#db.getEntities({ email: this.user.email }, COLLECTION)

    if(existingUser && existingUser.length > 0) {
      return fn('user.email should be unique')
    }

    this.#db.saveEntity(this.user, COLLECTION)

    fn()
  }
}

module.exports = { 
  User
}