const assert = require('assert');
const proxyquire = require('proxyquire');

const { MongoLibMock, getAllStub, createStub, deleteAllStub} = require('../utils/mocks/mongoLib');

const { usersMock } = require('../utils/mocks/users');

describe('services - users', function() {
  const UsersServices = proxyquire('../services/users', {
    '../lib/mongo': MongoLibMock
  });

  const usersService = new UsersServices();

  describe('when Users method is called', async function() {
    
    it('should call the getall MongoLib method', async function() {
      await usersService.getUsers({})
      assert.strictEqual(getAllStub.called, true);
    });

    it('should call the create MongoLib method', async function() {
      let user = {};
      user._id = "5f45dd19671cc027f482fe1c";
      user.userName = "fernanda";
      user.email = "fernanda@example.com";
      user.phone = "3007654321";
      user.password = "Hola";
      user.urlPhoto = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7";
      
      await usersService.createPhoneIndex();
      await usersService.createUser({ user});
      assert.strictEqual(createStub.called, true);
    });

    it('should call the delete MongoLib method', async function() {
      await usersService.deleteUser('5f45dd19671cc027f482fe1c');
      assert.strictEqual(deleteAllStub.called, true);
    });

    it('should return an array of users', async function() {
      const result = await usersService.getUsers({});
      const expected = usersMock;
      assert.deepEqual(result, expected);
    });

    it('should return a user', async function(){
      let expected = [];
      const result = await usersService.getUserExist("3007654321");
      expected.push(usersMock[3]);
      assert.deepEqual(result, expected);
    } )

  });
});