const assert = require('assert');
const proxyquire = require('proxyquire');

const { reactionsMock, ReactionServiceMock } = require('../utils/mocks/reactions');

const testServer = require('../utils/testServer');

describe('routes - reactions', function(){
     
    const route = proxyquire('../routes/reactions', {
        '../services/reactions': ReactionServiceMock
    });

    const request = testServer(route);

    describe('GET /reactions', function(){
        it('Should response with status 200', function(done){
            request.get('/api/reactions').expect(200);
            done();
        });

        it('Should respond with the list of reactions', function(done){
            request.get('/api/reactions').end((err,res)=>{
                assert.deepStrictEqual(res.body, {
                    data: reactionsMock,
                    message: 'reaction listed'
                });
            })
            done();
        })
    });

    describe('DELETE /reactions', function(){
        it('Should response with status 200', function(done){
            request.delete('/api/reactions/123456').expect(200, done);
            done();
        });
    });

    describe('Post /reactions', function(){
        it('Should response with status 201', function(done){
            request.post('/api/reactions')
                    .send({ "type": "Like",
                            "idArticle": "5f49f6dd534a8c00084d8c12",
                            "phoneUser": "3155280480",
                            "phoneOwner": "3155280480"
                            })
                    .expect(201)
                    .end((err, res) => {
                        if(err)
                            done(err);
                        res.body.should.have.property('data');
                    })
	        done();
        })
    })

});
