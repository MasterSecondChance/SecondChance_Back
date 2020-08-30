const assert = require('assert');
const proxyquire = require('proxyquire');

const { MongoLibMock, deleteAllStub, createStub, getAllStub } = require('../utils/mocks/mongoLib');

const { matchesMock } = require('../utils/mocks/matches');

describe('services - matches', function() {
  const MatchesServices = proxyquire('../services/matches', {
    '../lib/mongo': MongoLibMock
  });

  const matchesServices = new MatchesServices();

  describe('when matches method is called', async function() {
    
    it('should call the getall MongoLib method', async function() {
      await matchesServices.getMatches({});
      assert.strictEqual(getAllStub.called, true);
    });

    it('should call the get MongoLib method', async function() {
      await matchesServices.getMatches("5f44bee92974740008ca0d28");
      assert.strict(deleteAllStub, true);
    });

    it('should call the delete MongoLib method', async function() {
      await matchesServices.deleteMatch( "3007654321", "3007777777");
      assert.strictEqual(deleteAllStub.called, true);
    });

    it('should call the create MongoLib method', async function() {
      let match = {};
      match.nameFirst= "Alexander";
        match.phoneFirst= "3203889058";
        match.urlPhotoArticleFirst= "https://trode-s3.s3.amazonaws.com/prendas-1598416395915.jpg";
        match.firstArticleName= "My little skirt2";
        match.nameSecond= "fernanda";
        match.phoneSecond= "3007654321";
        match.urlPhotoArticleSecond= "https://trode-s3.s3.amazonaws.com/prendas-1598416395915.jpg";
        match.secondArticleName= "My little skirt1";
        match.urlChat= "https://api.whatsapp.com/send?phone=3007654321";
        match.date= "27/08/2020 11:50pm";
      await matchesServices.createMatch({match});
      assert.strictEqual(createStub.called, true);
    });
  });
});