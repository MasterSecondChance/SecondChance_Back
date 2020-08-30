const assert = require('assert');
const proxyquire = require('proxyquire');

const { imagesMock, ImageServiceMock } = require('../utils/mocks/images');

const testServer = require('../utils/testServer');

describe('routes - images', function(){
     
    const route = proxyquire('../routes/images', {
        '../services/images': ImageServiceMock
    });

    const request = testServer(route);

    describe('GET /images', function(){
        it('Should response with status 200', function(done){
            request.get('/api/images').expect(200, done);
            done();
        });

        it('Should respond with the list of images', function(done){
            request.get('/api/images').end((err,res)=>{
                assert.deepEqual(res.body, {
                    data: imagesMock,
                    message: 'Images listed'
                });
                done();
            })
            done();
        })
    });

    describe('DELETE /images/:imageId', function(){
        it('Should response with status 200', function(done){
            request.delete('/api/images/:imageId').expect(200, done);
            done();
        });
    });
});