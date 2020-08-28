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

  async getMatchesByPhone({phoneFirst}){
    const match = await this.mongoDB.getMatchesByPhone(this.collection, phoneFirst);
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

  async deleteMatch({ phoneFirst, phoneSecond }) {
    try{
      const deletedMatchId = await this.mongoDB.deleteMatchByPhone(this.collection, phoneFirst, phoneSecond);
      return deletedMatchId;
    }catch(error){
      return false
    }
  }
  
}

module.exports = MatchesService