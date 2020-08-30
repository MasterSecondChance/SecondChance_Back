const assert = require('assert');
const proxyquire = require('proxyquire');

const { MongoLibMock, deleteAllStub, createStub, getAllStub } = require('../utils/mocks/mongoLib');

const { reactionsMock } = require('../utils/mocks/reactions');

describe('services - reactions', function() {
  const ReactionsServices = proxyquire('../services/reactions', {
    '../lib/mongo': MongoLibMock
  });

  const reactionsServices = new ReactionsServices();

  describe('when getReactions method is called', async function() {
    
    it('should call the getall MongoLib method', async function() {
      await reactionsServices.getReactions({});
      assert.strictEqual(getAllStub.called, true);
    });

    it('should call the get MongoLib method', async function() {
      await reactionsServices.getReaction("5f44bee92974740008ca0d28");
      assert.strict(deleteAllStub, true);
    });

    it('should call the getLikesByArticle MongoLib method', async function() {
        await reactionsServices.getLikesByArticle("5f44bee92974740008ca0d28");
        assert.strict(deleteAllStub, true);
    });
    
    it('should call the getSuperLikesByArticle MongoLib method', async function() {
        await reactionsServices.getSuperLikesByArticle("5f44bee92974740008ca0d28");
        assert.strict(deleteAllStub, true);
    });

    it('should call the getDisLikesByArticle MongoLib method', async function() {
        await reactionsServices.getDisLikesByArticle("5f44bee92974740008ca0d28");
        assert.strict(deleteAllStub, true);
    });

    it('should call the delete MongoLib method', async function() {
      await reactionsServices.deleteReaction("5f44bee92974740008ca0d28");
      assert.strictEqual(deleteAllStub.called, true);
    });

    it('should call the create MongoLib method', async function() {
      let reaction = {};
      reaction.type= "Like";
      reaction.idArticle= "5f49f6dd534a8c00084d8c12";
      reaction.phoneUser= "3155280480";
      reaction.phoneOwner= "3155280480";
      await reactionsServices.createReaction({reaction});
      assert.strictEqual(createStub.called, true);
    });
  });
});