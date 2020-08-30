const assert = require('assert');
const proxyquire = require('proxyquire');

const { matchesMock, MatchesServiceMock } = require('../utils/mocks/matches');

const testServer = require('../utils/testServer');

describe('routes - matches', function(){
     
    const route = proxyquire('../routes/matches', {
        '../services/matches': MatchesServiceMock
    });

    const request = testServer(route);

    describe('GET /matches', function(){
        it('Should response with status 200', function(done){
            request.get('/api/matches').expect(200, done);
            done();
        });

        it('Should respond with the list of matches', function(done){
            request.get('/api/matches').end((err,res)=>{
                assert.deepEqual(res.body, {
                    data: matchesMock,
                    message: 'Matches listed'
                });
                done();
            })
            done();
        })
    });

    describe('DELETE /matches/:phoneFirst/:phoneSecond', function(){
        it('Should response with status 200', function(done){
            request.delete('/api/matches/:phoneFirst/:phoneSecond').expect(200, done);
            done();
        });
    });
});