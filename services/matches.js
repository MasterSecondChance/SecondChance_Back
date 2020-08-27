const MongoLib = require('../lib/mongo')

class MatchesService {
  constructor() {
    this.collection = 'matches'
    this.mongoDB = new MongoLib()
  }
  
  async getMatches({ tags }) {
    const query = tags && { tags: { $in: tags } }
    const matches = await this.mongoDB.getAll(this.collection, query)
    return matches || []
  }

  async getMatch( {matchId} ){
    const match = await this.mongoDB.get(this.collection, matchId);
    return match || {}
  }

  async createMatch( match ) {
    try {

      const createMatchId = await this.mongoDB.create(this.collection, match)
      return createMatchId;
    } catch (error) {
      return false
    }
  }

  async deleteMatch({ matchId }) {
    const deletedMatchId = await this.mongoDB.delete(this.collection, matchId)
    return deletedMatchId;
  }
  
}

module.exports = MatchesService