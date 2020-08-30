const sinon = require('sinon');

const { usersMock, filteredUsersMock, filteredUserByPhone, deleteUserMock} = require('./users');
const { articlesMock, filteredArticlesMock, 
                        filteredArticleswithReactionMock} = require('./articles');
const { reactionsMock, filteredReactionsMock } = require('./reactions');
const { matchesMock, filteredMatchesMock} = require('./matches');


const getAllStub = sinon.stub();
const deleteAllStub = sinon.stub();
const getByPhoneStub = sinon.stub(); 
const getAllArticlesStub = sinon.stub();
const phoneQuery = { phone: { $eq: "3007654321" }}
const phoneOwnerQuery = {phoneOwner: { $in: "3203889058" }};
const noReactionArticlesQuery =  { _id: { $nin: ["5f449d36b9d90e0007e06454","5f44bee92974740008ca0d28"] } ,
                                          phoneOwner: { $ne : "3203889058" } }                                          
const phone = "3007654321";
const phoneSecond = "300777777"
const id = "5f449d36b9d90e0007e06454";
getAllStub.withArgs('users').resolves(usersMock);
deleteAllStub.withArgs('users').resolves(usersMock);
getAllArticlesStub.withArgs('articles').resolves(articlesMock);

getAllStub.withArgs('users', phoneQuery).resolves(filteredUsersMock("3007654321"));
deleteAllStub.withArgs('users', id).resolves(deleteUserMock("5f449d36b9d90e0007e06454"));
deleteAllStub.withArgs('reactions', id).resolves(filteredReactionsMock("5f449d36b9d90e0007e06454"));
deleteAllStub.withArgs('matches', id).resolves(filteredMatchesMock("5f449d36b9d90e0007e06454"));
deleteAllStub.withArgs('matches', phone, phoneSecond).resolves(filteredMatchesMock("5f449d36b9d90e0007e06454"));

getAllArticlesStub.withArgs('articles', phoneOwnerQuery).resolves(filteredArticlesMock("3203889058"));
getAllArticlesStub.withArgs('articles', noReactionArticlesQuery).resolves(filteredArticleswithReactionMock("3203889058"))
getByPhoneStub.withArgs('users', phone).resolves(filteredUserByPhone("3007654321"));

const createStub = sinon.stub().resolves(usersMock[0].id);
createStub.withArgs('reactions').resolves(reactionsMock[0].id);
const createArticleStub = sinon.stub().resolves(articlesMock[0].id);

class MongoLibMock{
    getAll(collection, query){
        if(collection === 'articles'){
            return getAllArticlesStub(collection, query);
        }else{
            return getAllStub(collection, query);
        }
    }

    get(collection, id){
        return deleteAllStub(collection, id);
    }

    getLikesByArticle(collection, id){
        return deleteAllStub(collection, id);
    }

    getSuperLikesByArticle(collection, id){
        return deleteAllStub(collection, id);
    }

    getDisLikesByArticle(collection, id){
        return deleteAllStub(collection, id);
    }

    create(collection, data){
        return createStub(collection,data);
    }

    getByPhone(collection, phone){
        return getByPhoneStub(collection, phone);
    }

    createIndex({obj1},{obj2}){
        return true;
    }

    delete(collection, id){
        return deleteAllStub(collection, id);
    }

    deleteMatchByPhone(collection, phoneFirst, phoneSecond){
        return deleteAllStub(collection, phoneFirst, phoneSecond);
    }
}

module.exports = {
    getAllStub,
    getAllArticlesStub,
    createStub,
    deleteAllStub,
    MongoLibMock
}