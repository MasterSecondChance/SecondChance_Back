const MongoLib = require('../lib/mongo')
const { ObjectId } = require('mongodb');
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

  async getArticleswithReaction(idArticles, phoneUser) {
    let list= [];
    idArticles.forEach(element => {
      list.push(new ObjectId(element.idArticle));
    });
    const query = { _id: { $nin: list } , phoneOwner: { $ne : phoneUser } }
    const articles = await this.mongoDB.getAll(this.collection, query);
    return articles || []
  }


  async getArticle( {articleId} ){
    const article = await this.mongoDB.get(this.collection, articleId);
    return article || {}
  }

  async getArticlesByCategory({category}, idArticles, phoneUser){
    let list= [];
    idArticles.forEach(element => {
      list.push(new ObjectId(element.idArticle));
    });
    const query = { _id: { $nin: list } , phoneOwner: { $ne : phoneUser }, type: category}
    const articles = await this.mongoDB.getByCategory(this.collection, query);
    return articles || [];
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