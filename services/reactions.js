const MongoLib = require('../lib/mongo')

class ReactionsService {
  constructor() {
    this.collection = 'reactions'
    this.mongoDB = new MongoLib()
  }
  
  async getReactions({ tags }) {
    const query = tags && { tags: { $in: tags } }
    const reactions = await this.mongoDB.getAll(this.collection, query)
    return reactions || []
  }

  async getReaction( {reactionId} ){
    const reaction = await this.mongoDB.get(this.collection, reactionId);
    return reaction || {}
  }

  async getLikesByArticle({articleId}){
      const likes = await this.mongoDB.getLikesByArticle(this.collection, articleId);
      return likes || {}
  }
  
  async getSuperLikesByArticle({articleId}){
      const superLikes = await this.mongoDB.getSuperLikesByArticle(this.collection, articleId);
      return superLikes || {}
  }

  async getDisLikesByArticle({articleId}){
    const DisLikes = await this.mongoDB.getDisLikesByArticle(this.collection, articleId);
    return DisLikes || {}
  }

  async getReactionsMatch({reaction}){
    const match = await this.mongoDB.getReactionsMatch(this.collection, reaction);
    return match || 0;
  }

  async createReaction({ reaction }) {

    try {      
      const createReactionId = await this.mongoDB.create(this.collection, reaction)
      return createReactionId;
    } catch (error) {
      return false
    }
  }


  async updateReaction({ reactionId, reaction } = {}) {
    
    const updatedReactionId = await this.mongoDB.update(
      this.collection,
      reactionId,
      reaction
    );
    return updatedReactionId;
  }

  async deleteReaction({ reactionId }) {
    const deletedReactionId = await this.mongoDB.delete(this.collection, reactionId)
    return deletedReactionId;
  }
  
}

module.exports = ReactionsService