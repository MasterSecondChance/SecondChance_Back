const MongoLib = require('../lib/mongo')
const bcrypt = require('bcrypt')

class UsersService {
  constructor() {
    this.collection = 'users'
    this.mongoDB = new MongoLib()
  }
  
  async getUsers({ tags }) {
    const query = tags && { tags: { $in: tags } }
    const users = await this.mongoDB.getAll(this.collection, query)
    return users || []
  }

  async getUser({ userId }) {
    const user = await this.mongoDB.get(this.collection, userId)
    return user || {}
  }

  async createUser({ user }) {
    await this.createEmailIndex()

    try {
      const passdw = user.password
      const hashPass = await bcrypt.hash(passdw, 10)
      user.password = hashPass
      
      const createUserId = await this.mongoDB.create(this.collection, user)
      return createUserId
    } catch (error) {
      return false
    }
  }

  async updateUser({ userId, user } = {}) {
    await this.createEmailIndex()

    const updatedUserId = await this.mongoDB.update(
      this.collection,
      userId,
      user
    );
    return updatedUserId
  }

  async deleteUser({ userId }) {
    const deletedUserId = await this.mongoDB.delete(this.collection, userId)
    return deletedUserId
  }

  async createEmailIndex() {
    await this.mongoDB.createIndex(this.collection, { "email": 1 })
  }
  
}

module.exports = UsersService