let
framework = require('../framework'),
config = framework.config(),
chai = require('chai'),
assert = require('assert');

module.exports = () => {
    describe('Framework', ()=>{
        it('Testing css parser', (done)=>{
            assert.strictEqual(JSON.stringify(framework.css.parse("#id { width: 10px; } .class { background-color: #000; border: 2px solid #000; }")), JSON.stringify({'#id':{width:"10px"},'.class':{backgroundColor:"#000",border:"2px solid #000"}}));
            done();
        });
        it('Testing css stringifier', (done)=>{
            assert.strictEqual(framework.css.stringify({"#id":{width:"10px"},".class":{"backgroundColor":"#000","border":"2px solid #000"}}), "#id { width: 10px; } .class { background-color: #000; border: 2px solid #000; }");
            done();
        });
        it('Testing html compiler', (done)=>{
            assert.strictEqual(framework.html.compile({test:{content:{test2:{class:["test","test2"],content:"test"}}}}), '<div id="test"><div id="test2" class="test test2">test</div></div>');
            done();
        });
        it('Testing language manager', (done)=>{
            assert.strictEqual(framework.languages.get("english", "test"), "test passed");
            done();
        });
    })
}