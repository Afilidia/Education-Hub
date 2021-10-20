const express = require('express')
, router = express.Router()

, framework = require('../framework')

, dotenv = require("dotenv")
, mysql = require("mysql")
, fs = require("fs");

dotenv.config();

const CryptoJS = require("crypto-js")
, secretKey = process.env.ENCRYPT_KEY
, encrypt = (pass) => {return CryptoJS.AES.encrypt(pass, secretKey).toString();}

, connection = mysql.createConnection({
  host     : process.env.HOST,
  user     : process.env.USERNAME,
  password : process.env.PASSWORD,
  database : process.env.DATABASE
});

try {
  connection.connect();
} catch (err) {
  framework.log(0, err);
  process.exit();
}


let tokens = {}

, save = () => {
  fs.writeFileSync('./cookies-lastsave-backup.json', JSON.stringify(require("../cookies.json")));
  fs.writeFileSync('./cookies.json', JSON.stringify(tokens));
}

, loadSave = () => {
  try {
    tokens = require("../cookies.json");
  } catch (error) {
    framework.log(0, "$(fg-red)Error in JSON file! Trying to restore last working version...");
    fs.mkdir("./recovery/",
    { recursive: true }, (err) => {
      if (!err) {
        fs.readFile('./cookies.json', 'utf8', function (err1, data1) {
          fs.readFile('./cookies-lastsave-backup.json', 'utf8', function (err2, data2) {
            fs.readFile('./cookies-start-backup.json', 'utf8', function (err3, data3) {
              if(!err1) fs.writeFileSync('./recovery/cookies.json', data1);
              if(!err2) fs.writeFileSync('./recovery/cookies-lastsave-backup.json', data2);
              if(!err3) fs.writeFileSync('./recovery/cookies-start-backup.json', data3);
            })
          })
        })
      }
    });
    fs.readFile('./cookies-lastsave-backup.json', 'utf8', function (err, data) {
      framework.log(0, "$(fg-cyan)Checking last save backup");
      let parsingFail = false;
      try {
        if(!err) JSON.parse(data);
      } catch (error) {
        parsingFail = true;
      }
      if (err||parsingFail) {
        framework.log(0, "$(fg-red)This save is incorrect");
        fs.readFile('./cookies-start-backup.json', 'utf8', function (err, data) {
          framework.log(0, "$(fg-cyan)Checking last start backup"); 
          let parsingFail = false;
          try {
            if(!err) JSON.parse(data);
          } catch (error) {
            parsingFail = true;
          }
          if (err||parsingFail) {
            framework.log(0, "$(bg-red)System backup saves are incorrect, starting with clear saves.");
            fs.writeFileSync('./cookies.json', JSON.stringify({}));
          } else {
            framework.log(0, "$(fg-green)Restoring data from last start backup");
            fs.writeFileSync('./cookies.json', JSON.stringify(require("../cookies-start-backup.json")));
            tokens = require("../cookies.json");
            framework.log(0, "$(fg-green)$(gb-bright)Success, starting!");
          }
        })
      } else {
        framework.log(0, "$(fg-green)Restoring data from last save backup");
        fs.writeFileSync('./cookies.json', JSON.stringify(require("../cookies-lastsave-backup.json")));
        tokens = require("../cookies.json");
        framework.log(0, "$(fg-green)$(gb-bright)Success, starting!");
      }
    })
  }
}

, query = (query) => {
  return new Promise((resolve, reject) => {
      connection.query(query, (error, results, fields) => {
          if (error) {
              reject(error);
          }
          resolve(results);
      });
  });
}

, apiLoggedOnly = (req, res) => {
  if(!req.cookies.token||!tokens[req.cookies.token]) {
      res.json({});
      return false;
  }
}

, activity = (req, res) => {
  if(req.cookies.token&&tokens[req.cookies.token]) {
    tokens[req.cookies.token].lastActivity = new Date().getTime();
    res.cookie("activity", tokens[req.cookies.token].lastActivity + 60000*60*2 + 10000);
  }
}


, getRandomString = (length) => {
  var result = "";
  var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

loadSave();

router.post('/login', async (req, res, next) => {
  activity(req, res);
  let login = req.body.login||false;
  if(!login) return res.redirect('/');
  let password = req.body.password||false;
  if(!password) return res.redirect('/');

  password = encrypt(password);

  let q = await query(`SELECT * FROM users WHERE login=${mysql.escape(login)} AND password=${mysql.escape(password)}`);
  if(q) {
      let r;
      do {
          r = getRandomString(40);
      } while(tokens[r]);
      tokens[r] = {user: q.id, created: new Date().getTime(), lastActivity: new Date().getTime(), ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress};
      res.cookie('token', r);
      res.redirect("/app");
  } else {
      res.redirect("/login?error=1");
  }
});

router.post('/register', async (req, res, next) => {
  activity(req, res);
  let login = req.body.login||false;
  if(!login) return res.redirect('/');
  let password = req.body.password||false;
  if(!password) return res.redirect('/');

  if(login.length < 3 || password.length < 8) return res.redirect('/register?error=1');
  
  let q = await query(`SELECT * FROM users WHERE login=${mysql.escape(login)}`);
  if (q && q.length > 0) {
    console.log(0,q);
    return res.redirect('/register?error=1');
  }
  password = encrypt(password);

  let q2 = await query(`INSERT INTO users (login, password) VALUES (${mysql.escape(login)}, ${mysql.escape(password)})`);
  if(q2) {
      let r;
      do {
          r = getRandomString(40);
      } while(tokens[r]);
      tokens[r] = {user: q2.id, created: new Date().getTime(), lastActivity: new Date().getTime(), ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress};
      res.cookie('token', r);
      res.redirect("/app");
  } else {
    console.log(1,q2);
    res.redirect('/register?error=1');
  }
});

setInterval(() => {
  Object.keys(tokens).forEach(tokenid => {
    if(!tokens[tokenid].lastActivity||tokens[tokenid].lastActivity+60000*60*24<new Date().getTime()) tokens[tokenid].mod = false;
    if(!tokens[tokenid].created||tokens[tokenid].created+60000*60*24*30*6<new Date().getTime()) delete tokens[tokenid];
  });
  save();
}, 10000);

module.exports = router;
