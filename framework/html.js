let JavaScriptObfuscator = require('javascript-obfuscator'),
data = require('../data'),
obfuscator = JavaScriptObfuscator,
html = {
    /**
     * ### Compile objected HTML code
     * @param {object} objectedHTML Objected HTML code
     * @returns {string} Stringified HTML code ready to be sended to client or include in other objected HTML code
     */
    compile: (objectedHTML) => {
        let compute = (id, from) => {
            if(!id&&typeof from == "object") {
                let generated = "";
                Object.keys(from).forEach(element => {
                    generated += compute(element, from[element]);
                });
                return generated
            } 
            if(typeof from == "string") return from;
            let content = [];
            Object.keys(from.content||{}).forEach(element => {
                content.push(compute(element, from.content[element]))
            });
            let inline = "";
            Object.keys(from.inline||{}).forEach(element => {
                inline+=` ${element}="${from.inline[element]}"`;
            });
            return `<${from.tag||"div"}${from.style?` style="${from.style}"`:""}${id&&!id.startsWith("acn")?` id="${id}"`:""}${from.class&&from.class.length>0?` class="${from.class.join(" ")}"`:""}${inline.length>0?inline:""}>${content.join("")}</${from.tag||"div"}>`;
        }
        return compute(false, objectedHTML);
    },
    /**
     * ### External script element
     * @param {string} script JavaScript URL
     * @param {string?} integrity (Optional) Script integrity key
     * @returns {string} Compiled HTML script element
     */
    script: (script, integrity) => {
        return html.compile({"acn":{tag:"script",inline:integrity?{src: script, integrity, crossorigin: "anonymous"}:{src: script, crossorigin: "anonymous"}}});
    },
    /**
     * ### External script loader
     * @param {[script: string,integrity: string][]} scriptList List of JavaScript sources URLs
     * @param {string?} path Default path to script (ex. if path is "http://example.com" then script "/index.js" will be "http://example.com/index.js")
     * @returns {string} Compiled HTML script elements for the scriptList
     */
    scriptLoader: (scriptList, path) => {
        let code = "";
        scriptList.forEach(script => {
            scriptname = Array.isArray(script)?script[0]:script;
            code += html.script((path||"")+scriptname+scriptname.endsWith(".js")?scriptname:scriptname+".js", Array.isArray(script)?script[1]||false:false)
        });
        return code;
    },
    /**
     * ### Script element
     * @param {string} script JavaScript code
     * @returns {string} InHTML script element with code
     */
    scriptElement: (script) => {
        return `<script>${script?script:""}</script>`;
    },
    /**
     * ### Link element
     * @param {string} rel Link element rel property value
     * @param {string} href Link element href property value
     * @param {string} type Link element type property value
     * @param {string} title Link element title property value
     * @returns {string} Generated link element
     */
    link: (rel, href, type, title) => {
        let inline = {rel: rel?rel:"", href: href?href:""};
        if(type) inline.type = type;
        if(title) inline.title = title;
        return html.void({tag: "link", inline});
    },
    /**
     * ### External style element
     * @param {string} href URL with stylesheet file
     * @returns {string} Link to stylesheet
     */
    style: (href) => {
        return html.link("stylesheet", href?href:"");
    },
    /**
     * ### Style element
     * @param {string} style InHTML stylesheet code
     * @returns {string} Stylesheet HTML element
     */
    styleElement: (style) => {
        return `<style>${style?style:""}</style>`;
    },
    /**
     * ### Void element generator
     * @param {object} voidObjected Objected HTML void element data
     * @returns {string} Compiled HTML void type element
     */
    void: (voidObjected) => {
        let inline = "";
        Object.keys(voidObjected.inline||{}).forEach(element => {
            inline+=` ${element}="${voidObjected.inline[element]}"`;
        });
        return `<${voidObjected.tag||"br"}${voidObjected.style?` style="${voidObjected.style}"`:""}${voidObjected.class&&voidObjected.class.length>0?` class="${voidObjected.class.join(" ")}"`:""}${inline.length>0?inline:""}/>`;
    },
    /**
     * # Interactives Core
     * @returns {string} Script element with Interactives Core
     */
    interactivesCore: () => {
        return html.scriptElement(
            // obfuscator.obfuscate(
            html.jsCode(()=>{
            let interactives = {};
            let interactivesCore = {
                /**
                 * # Queue Manager
                 * Creates Promise callbacks queue
                 * @class QueueManager
                 */
                QueueManager: class QueueManager {
                    /**
                     * ### Queue Manager
                     * ##### constructor
                     * @param {function[]} queue functions queue
                     * @memberof QueueManager
                     */
                    constructor(queue) {
                        this.queue = queue;
                    };
                    /**
                     * ### Queue Manager
                     * ##### Wait then callback
                     *
                     * @param {number} time waiting time
                     * @param {function} next callback function
                     * @memberof QueueManager
                     */
                    wait = (time,next) => {
                        setTimeout(() =>{next()},time)
                    };
                    next = () => {
                        if(this.queue[++this.iterator]) this.queue[this.iterator](this.next, this.wait);
                    };
                    /**
                     * ### Queue Manager
                     * ##### Worker starter
                     *
                     * @memberof QueueManager
                     */
                    run = () => {
                        this.iterator = -1;
                        this.next();
                    };
                    /**
                     * ### Queue Manager
                     * ##### Promise worker starter
                     *
                     * @memberof QueueManager
                     */
                    promiseRun = async () => {
                        return await new Promise((resolve,reject) =>{
                            this.iterator = -1;
                            let next = () => {
                                if(this.queue[++this.iterator]) this.queue[this.iterator](next, this.wait, resolve);
                            };
                            next();
                        });
                    }
                },
                /**
                 * # Thread
                 * ### Asynchronous thread creator
                 * @class Thread
                 */
                Thread: class Thread {
                    /**
                     * ### Thread
                     * ##### Thread worker initialization
                     * @param {function} worker thread worker
                     * @memberof Thread
                     */
                    constructor(worker) {
                        setTimeout(worker, 0);
                    }
                },
                /**
                 * # Combination
                 * Combinations generator
                 * @class Combination
                 */
                Combination: class Combination {
                    /**
                     * ### Combination
                     * ##### All range combination generator
                     * @param {string} from start value / **(In development)** combination config
                     * @param {string} to end value (must be the same length as from)
                     * @memberof Combination
                     */
                    constructor(from, to) {
                        if(to){
                            if(from.length!=to.length) throw new Error("From and to must be the same length");
                            let combinationString = "";
                            for (let i = 0; i < from.length; i++) combinationString += `${from[i]}${to[i]},`;
                            combinationString = combinationString.slice(0, -1);
                            this.combinations = interactivesCore.generateCombinations(combinationString);
                        } else if (from) {
                            this.combinations = [];
                            let temp = [];
                            let i = 0;
                            from.split('||').forEach(t=>{
                                if(i%2==1) t = t.split('-');
                                else temp.push(t);
                                i++;
                            });
                            for (let i = parseInt(t[1][0].slice(1)); (parseInt(t[1][0].slice(1))>parseInt(t[1][1])&&i>parseInt(t[1][1]))||(parseInt(t[1][0].slice(1))<parseInt(t[1][1])&&i<parseInt(t[1][1])); i+=parseInt(t[1][0].slice(1))>parseInt(t[1][1])?-1:1) {
                                this.combinations.push(temp[0]+t[1][0].slice(0,1).toLowerCase()=="h"?i.toString(16):i+temp[1]);
                            }
                        }
                        return this.combinations;
                    }
                    /**
                     * ### Combination
                     * ##### Range hexadecimal generator
                     *
                     * @param {string} before Text before number
                     * @param {number} from Range start
                     * @param {number} to Range end
                     * @param {number} width Length of hex (ex. if you want #fff you must set this to 3)
                     * @param {string} after Text after number
                     * @return {string[]} All hex combinations in range
                     * @memberof Combination
                     */
                    hex(before, from, to, width, after) {
                        width = width || 6;
                        let base = "";
                        for(let i = 0; i < width; i++) base += "0";
                        let res = [];
                        if(from<to) for(let i = from; i <= to; i++) res.push((before||"")+(base+(Number(i).toString(16))).slice(-width).toUpperCase()+(after||""));
                        else for(let i = from; i >= to; i--) res.push((before||"")+(base+(Number(i).toString(16))).slice(-width).toUpperCase()+(after||""));
                        return res;
                    }
                    /**
                     * ### Combination
                     * ##### Range decimal numbers generator
                     *
                     * @param {string} before Text before number
                     * @param {number} from Range start
                     * @param {number} to Range end
                     * @param {number} accuracy How many floating point numbers should be incremented by one step (ex. 1 -> 0.1,0.2,0.3,0.4,0.5; 0 -> 1,2,3,4,5)
                     * @param {string} after Text after number
                     * @return {string[]} All dec combinations in range
                     * @memberof Combination
                     */
                    number(before, from, to, accuracy, after) {
                        accuracy = accuracy || 0;
                        let accuracynumber = accuracy>0?Math.pow(10, accuracy):1;
                        let res = [];
                        if(from<to) for(let i = from * accuracynumber; i <= to * accuracynumber; i++) res.push((before||"")+i/accuracynumber+(after||""));
                        else for(let i = from * accuracynumber; i >= to * accuracynumber; i--) res.push((before||"")+i/accuracynumber+(after||""));
                        return res;
                    }
                },
                animate: (component, property, sequences, wait, callback) => {
                    wait = wait || 10;
                    for (let i = 0; i < sequences.length; i++) {
                        setTimeout(() => {
                            component.style[property] = sequences[i];
                            if(i==sequences.length-1&&callback) callback();
                        }, i*wait);
                    }
                    return sequences.length*wait;
                },
                generateCombinations: (combinationConfig, nonAI) => {
                    nonAI = nonAI || false;
                    let charmap = [
                        "","_","=","`","~","!","@","#","$","%","^","&","*","(",")","[","]","{","}","\\","|",";",":","'","\"",",",".","<",">","/","?","+","-"," ",
                        "0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
                        "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
                    ];
                    let result = [""];
                    let resultid = 0;
                    combinationConfig = combinationConfig.split(',');
                    let chars = (charnumcopy) => {
                        let charnum = (charnumcopy==null) ? -1 : charnumcopy;
                        ++charnum;
                        let range = [charmap.indexOf(combinationConfig[charnum][0]), charmap.indexOf(combinationConfig[charnum][1])];
                        for (let charmapid = range[0]; (range[0]>range[1]&&charmapid>=range[1])||(range[0]<=range[1]&&charmapid<=range[1]);) {
                            result[resultid] = result[resultid].slice(0,charnum) + charmap[charmapid];
                            if(charnum==combinationConfig.length-1) result[++resultid] = result[resultid-1];
                            else chars(charnum);
                            if(range[0]>range[1]) --charmapid; else ++charmapid;
                        }
                        result[resultid+1] = null;
                        result = result.filter(res=>res!=null);
                        return result;
                    }
                    return chars();
                }
            };
        })
        // , {
        //     compact: true,
        //     controlFlowFlattening: false,
        //     controlFlowFlatteningThreshold: 0.75,
        //     deadCodeInjection: true,
        //     deadCodeInjectionThreshold: 0.4,
        //     debugProtection: true,
        //     debugProtectionInterval: true,
        //     disableConsoleOutput: false,
        //     domainLock: data.config().server.qualifiedURLs,
        //     domainLockRedirectUrl: 'about:blank',//`data:text/html,<head><link rel="preconnect" href="https://fonts.googleapis.com"> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&display=swap" rel="stylesheet"></head><body style="background: rgb(138,144,0); background: linear-gradient(90deg, rgba(138,144,0,1) 17%, rgba(0,140,14,1) 59%, rgba(0,114,142,1) 100%); text-align: center; color: white; font-size: 15vw; text-shadow: 1vh 1vh black; font-family: 'Open Sans', sans-serif;"><div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100vw;">Don't steal</div></body>`,
        //     forceTransformStrings: [],
        //     identifierNamesCache: null,
        //     identifierNamesGenerator: 'hexadecimal',
        //     identifiersDictionary: [],
        //     identifiersPrefix: '',
        //     ignoreRequireImports: false,
        //     log: true,
        //     numbersToExpressions: true,
        //     optionsPreset: 'medium-obfuscation',
        //     renameGlobals: false,
        //     renameProperties: false,
        //     renamePropertiesMode: 'safe',
        //     reservedNames: ["^i","^interactives","^interactivesCore","^QueueManager","^Thread","^Combination","^animate","^generateCombinations"],
        //     reservedStrings: [],
        //     rotateStringArray: true,
        //     selfDefending: true,
        //     shuffleStringArray: true,
        //     simplify: true,
        //     sourceMap: false,
        //     sourceMapBaseUrl: '',
        //     sourceMapFileName: '',
        //     sourceMapMode: 'separate',
        //     splitStrings: true,
        //     splitStringsChunkLength: 20,
        //     stringArray: true,
        //     stringArrayIndexesType: [
        //         'hexadecimal-number'
        //     ],
        //     stringArrayEncoding: ["base64","rc4"],
        //     stringArrayIndexShift: true,
        //     stringArrayWrappersCount: 1,
        //     stringArrayWrappersChainedCalls: true,
        //     stringArrayWrappersParametersMaxCount: 2,
        //     stringArrayWrappersType: 'variable',
        //     stringArrayThreshold: 0.75,
        //     target: 'browser',
        //     transformObjectKeys: true,
        //     unicodeEscapeSequence: true
        // })
        );
    },
    /**
     * # InteractiveComponent  
     *   
     * Generates interactive component to include into **Raptor** HTML compiler.  
     * 
     * @class InteractiveComponent
     */
    InteractiveComponent: class InteractiveComponent {
        /**
         * ### InteractiveComponent  
         * #### constructor
         * @param {object} component Objected HTML component
         * @memberof InteractiveComponent
         */
        constructor(component) {
            if(typeof component != 'object') throw new Error("Component must be an object");
            component.interactive = html.scriptElement(html.jsCode(()=>{
                interactives["%%component.id%%"] = {
                    component: document.getElementById("%%component.id%%"),
                    addAnimation: (property, sequences, wait, callback) => {return interactivesCore.animate(interactives["%%component.id%%"].component, property, sequences, wait, callback)}
                };
            }, {
                // component: {id: Object.keys(component)[0]}
            })).replace(/"%%component.id%%"/g, `"${Object.keys(component)[0]}"`);
            this.code =  html.compile(component);
        }
        /**
         * ### InteractiveComponent  
         * #### get  
         *   
         * @return {string} Stringified HTML interactive component 
         * @memberof InteractiveComponent
         */
        get() {
            return this.code;
        }
    },
    jsCode: (codeInFunction, variables) => {
        let variablesString = "";
        Object.keys(variables||{}).forEach(variable => {
            variablesString += `let ${variable} = ${JSON.stringify(variables[variable])};\n`;
        });
        return `${variablesString}${codeInFunction.toString().split("\n").slice(1,-1).join("\n")}`;
    }
};

module.exports = html;