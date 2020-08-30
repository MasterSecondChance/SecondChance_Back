const assert = require('assert');
const {userSchema} = require('../schemas/users');

describe('Schemas - Users', function(){
    describe('validate schema about users', function(){
        it('Should back true', function(){
            let user = {};
            user.userName = "fernanda";
            user.email = "fernanda@example.com";
            user.phone = "3007654321";
            user.password = "Hola12312";
            user.urlPhoto = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7";
            
            const result = userSchema.validate(user);
            const expect = user;
            assert.deepEqual(result.value, expect);
        })
    });
})