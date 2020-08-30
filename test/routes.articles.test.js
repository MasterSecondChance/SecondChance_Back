const assert = require('assert');
const proxyquire = require('proxyquire');

const { articlesMock, ArticlesServiceMock } = require('../utils/mocks/articles');

const testServer = require('../utils/testServer');

describe('routes - articles', function(){
     
    const route = proxyquire.load('../routes/articles', {
        '../services/articles': ArticlesServiceMock
    });

    const request = testServer(route);

    describe('GET /articles', function(){
        it('Should response with status 200', function(done){
            request.get('/api/articles').expect(200, done);
            done();
        });

        it('Should respond with the list of articles', function(done){
            request.get('/api/articles').end((err,res)=>{
                assert.deepEqual(res.body, {
                    data: articlesMock,
                    message: 'articles listed'
                });
                done();
            })
            done();
        })
    });

    describe('DELETE /articles', function(){
        it('Should response with status 200', function(done){
            request.delete('/api/articles/:articleId').expect(200, done);
            done();
        });
    });
});