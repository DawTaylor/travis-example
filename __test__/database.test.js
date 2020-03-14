const { MockedDatabase } = require('../src/database/Database')
const { users } = require('./users.mock')

const USER_COLLECTION = 'users'
const EXISTING_USER_EMAIL = 'adalberto@livup.com.br'

const VALID_USER_ID = '5e6d49e2612a9b4be4d79590'
const INVALID_USER_ID = '5e6d49e2612a9b4be4d79590_INVALID'

describe('Unit => Database', () => {
  describe('getEntities', () => {
    test('should return no users for an empty db', () => {
      const db = new MockedDatabase({ users: [] })
  
      const userList = db.getEntities(null, USER_COLLECTION)
  
      expect(userList.length).toBe(0)
    })
  
    test('should return all users if no query is sent', () => {
      const db = new MockedDatabase({ users })
  
      const userList = db.getEntities(null, USER_COLLECTION)
  
      expect(userList.length).toBe(users.length)
    })
  
    test('should return only one user with provided email', () => {
      const db = new MockedDatabase({ users })
      const query = { email: EXISTING_USER_EMAIL }
  
      const userList = db.getEntities(query, USER_COLLECTION)
  
      expect(userList.length).toBe(1)
    })
  
    test('shoud return 2 users with provided name', () => {
      const db = new MockedDatabase({ users })
      const query = { firstName: 'daw' }

      const userList = db.getEntities(query, USER_COLLECTION)

      expect(userList.length).toBe(2)
    })
  })

  describe('getEntityById', () => {
    test('should return no entity for invalid id', () => {
      const db = new MockedDatabase({ users })
      const user = db.getEntityById(INVALID_USER_ID, USER_COLLECTION)

      expect(user).toBe(undefined)
    })

    test('shoudl return valid entity for valid id', () => {
      const db = new MockedDatabase({ users })
      const user = db.getEntityById(VALID_USER_ID, USER_COLLECTION)

      expect(user).toEqual({
        "email": "adalberto@livup.us",
        "firstName": "adalberto",
        "lastName": "taylor",
        "_id": "5e6d49e2612a9b4be4d79590"
      })
    })
  })

  describe('saveEntity', () => {
    test('should add user to empty database', () => {
      const db = new MockedDatabase({ users: [] })
      const userToSave = {
        "email": "adalberto@codenation.dev",
        "firstName": "adalberto",
        "lastName": "taylor",
        "_id": "5e6d49e2612a9b4be4d79710"
      }
  
      db.saveEntity(userToSave, USER_COLLECTION)
  
      const userList = db.getEntities(null, USER_COLLECTION)
  
      expect(userList).toEqual([userToSave])
    })

    test('should add user to populated database', () => {
      const db = new MockedDatabase({ users })
      const userToSave = {
        "email": "adalberto@codenation.dev",
        "firstName": "adalberto",
        "lastName": "taylor",
        "_id": "5e6d49e2612a9b4be4d79710"
      }

      db.saveEntity(userToSave, USER_COLLECTION)
      const userList = db.getEntities(null, USER_COLLECTION)

      expect(userList.length).toBe(users.length + 1)
    })
  })

  describe('updateEntity', () => {
    const payloadToUpdate = {
      email: 'novoemail@exemplo.com'
    }
    test('should update an existing entity email', () => {
      const db = new MockedDatabase({ users })

      const previousUser = db.getEntityById(VALID_USER_ID, USER_COLLECTION)
      const updatedUser = db.updateEntity(VALID_USER_ID, payloadToUpdate, USER_COLLECTION)

      expect(updatedUser.email).not.toBe(previousUser.email)
      expect(updatedUser.email).toBe(payloadToUpdate.email)
    })

    test('should return null if entity does not exist', () => {
      const db = new MockedDatabase({ users })
      const updatedUser = db.updateEntity(INVALID_USER_ID, payloadToUpdate, USER_COLLECTION)

      expect(updatedUser).toBe(null)
    })
  })

  describe('deleteEntity', () => {
    test('should delete a valid user from db', () => {
      const db = new MockedDatabase({ users })
      db.deleteEntity(VALID_USER_ID, USER_COLLECTION)

      const userList = db.getEntities(null, USER_COLLECTION)

      expect(userList.length).toBe(users.length - 1)
    })

    test('should not touch db for invalid user', () => {
      const db = new MockedDatabase({ users })
      db.deleteEntity(INVALID_USER_ID, USER_COLLECTION)
      
      const userList = db.getEntities(null, USER_COLLECTION)

      expect(userList.length).toBe(users.length)
    })
  })
})