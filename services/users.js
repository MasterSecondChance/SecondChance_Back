const MongoLib = require('../lib/mongo')
const bcrypt = require('bcrypt')

class UsersService {
  constructor() {
    this.collection = 'users'
    this.mongoDB = new MongoLib()
  }
  
  async getUsers({ phone }) {
    typeof(phone) == 'string' ? phone = [phone] : phone;
    const query = phone && { phone: { $in: phone } }
    const users = await this.mongoDB.getAll(this.collection, query)
    return users || []
  }

  async getUser({ userId }) {
    const user = await this.mongoDB.get(this.collection, userId)
    return user || {}
  }
  
  async getUserExist(phone) {
    const userExist = await this.mongoDB.getByPhone(this.collection, phone);
    return userExist || '';
  }
  

  async createUser({ user }) {
    await this.createPhoneIndex()

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
    await this.createPhoneIndex()

    const passdw = user.password
    const hashPass = await bcrypt.hash(passdw, 10)
    user.password = hashPass

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

  async createPhoneIndex() {
    await this.mongoDB.createIndex(this.collection, { "phone": 1 })
  }
  
}

module.exports = UsersService