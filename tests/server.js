let
framework = require('../framework'),
config = framework.config(),
assert = require('assert'),
supertest = require('supertest'),

server = supertest(`${config.server.protocol}://${config.server.url}:${config.server.port}`);

module.exports = () => {
    describe('Server', ()=>{
        it('Index response status should be 200', (done)=>{
            server.get('/').expect(200, done);
        });
    });
}