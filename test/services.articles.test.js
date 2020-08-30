const assert = require('assert');
const proxyquire = require('proxyquire');

const { MongoLibMock, getAllArticlesStub, deleteAllStub, createStub } = require('../utils/mocks/mongoLib');

const { articlesMock } = require('../utils/mocks/articles');

describe('services - articles', function() {
  const ArticlesServices = proxyquire('../services/articles', {
    '../lib/mongo': MongoLibMock
  });

  const articlesService = new ArticlesServices();

  describe('when getArticles method is called', async function() {
    
    it('should call the getall MongoLib method', async function() {
      await articlesService.getArticles({});
      assert.strictEqual(getAllArticlesStub.called, true);
    });

    it('should call the get MongoLib method', async function() {
      await articlesService.getArticle("5f44bee92974740008ca0d28");
      assert.strict(deleteAllStub, true);
    });

    it('should call the delete MongoLib method', async function() {
      await articlesService.deleteArticle("5f44bee92974740008ca0d28");
      assert.strictEqual(deleteAllStub.called, true);
    });

    it('should call the create MongoLib method', async function() {
      let article = {};
      await articlesService.createArticle({article});
      assert.strictEqual(createStub.called, true);
    });

    it('should return an array of articles', async function() {
      const result = await articlesService.getArticles({});
      const expected = articlesMock;
      assert.deepEqual(result, expected);
    });

    it('should return an array of articles without Reactions', async function(){
        const result = await articlesService.getArticleswithReaction(["5f449d36b9d90e0007e06454"],'3203889058');
        const expected = articlesMock;
        assert.deepEqual(result, expected);
    })

  });
});