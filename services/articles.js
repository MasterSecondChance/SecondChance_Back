const MongoLib = require('../lib/mongo')

class ArticlesService {
  constructor() {
    this.collection = 'articles'
    this.mongoDB = new MongoLib()
  }
  
  async getArticles({ phoneOwner }) {
    typeof(phoneOwner) == 'string' ? phoneOwner = [phoneOwner] : phoneOwner;
    const query = phoneOwner && { phoneOwner: { $in: phoneOwner } }
    const articles = await this.mongoDB.getAll(this.collection, query)
    return articles || []
  }

  async getArticle( {articleId} ){
    const article = await this.mongoDB.get(this.collection, articleId);
    return article || {}
  }

  async createArticle({ article }) {

    try {      
      const createArticleId = await this.mongoDB.create(this.collection, article)
      return createArticleId;
    } catch (error) {
      return false
    }
  }

  async updateArticle({ articleId, article } = {}) {
    
    const updatedArticleId = await this.mongoDB.update(
      this.collection,
      articleId,
      article
    );
    return updatedArticleId;
  }

  async deleteArticle({ articleId }) {
    const deletedArticleId = await this.mongoDB.delete(this.collection, articleId)
    return deletedArticleId;
  }
  
}

module.exports = ArticlesService