const R = require('ramda')

class DataBase {
  constructor() {
    this.db = {}
  }

  saveEntity(entity, collection) {
    const newEntityCollection = R.pipe(
      R.propOr([],collection),
      R.concat([entity])
    )(this.db)

    this.db = R.assocPath([collection], newEntityCollection, this.db)
  }

  updateEntity(id, payload, collection) {
    const entity = R.pipe(
      R.propOr([], collection),
      R.find(R.propEq('_id', id))
    )(this.db)

    if(!entity || entity.length < 1) return null

    
    const updatedEntity = R.mergeRight(entity, payload)

    const updatedCollection = R.pipe(
      R.propOr([], collection),
      R.reject(R.whereEq({ _id: updatedEntity._id })),
      R.concat([updatedEntity])
    )(this.db)

    this.db = R.assocPath([collection], updatedCollection, this.db)

    return updatedEntity
  }

  deleteEntity(id, collection) {
    this.db = R.pipe(
      R.propOr([], collection),
      R.reject(R.whereEq({ _id: id }))
    )(this.db)

    return true
  }

  getEntities(query = null, collection) {
    if(!query) return R.propOr([], collection)(this.db)
    return R.pipe (
      R.propOr([], collection),
      R.filter(R.whereEq(query))
    )(this.db)
  }

  getEntityById(_id, collection) {
    return R.find(R.propEq('_id', _id), this.db[collection])
  }
}

const db = new DataBase()

module.exports = {
  DataBase,
  db,
}