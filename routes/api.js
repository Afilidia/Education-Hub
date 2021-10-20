const express = require('express');
const router = express.Router();

const crypto = require('crypto')
, algorithm = 'aes-256-ctr'
, secretKey = process.env.ENCRYPT_KEY
, cipher = crypto.createCipheriv(algorithm, secretKey, crypto.randomBytes(16))

, connection = mysql.createConnection({
  host     : process.env.HOST+":"+process.env.PORT,
  user     : process.env.USER,
  password : process.env.PASSWORD,
  database : process.env.DATABASE
});

try {
  connection.connect();
} catch (err) {
  console.log(err);
  process.exit();
}


let tokens = {}
, loadSave = () => {
  try {
    tokens = require("../cookies.json");
    main();
  } catch (error) {
    console.log("$(fg-red)Error in JSON file! Trying to restore last working version...");
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
      console.log("$(fg-cyan)Checking last save backup");
      let parsingFail = false;
      try {
        if(!err) JSON.parse(data);
      } catch (error) {
        parsingFail = true;
      }
      if (err||parsingFail) {
        console.log("$(fg-red)This save is incorrect");
        fs.readFile('./cookies-start-backup.json', 'utf8', function (err, data) {
          console.log("$(fg-cyan)Checking last start backup"); 
          let parsingFail = false;
          try {
            if(!err) JSON.parse(data);
          } catch (error) {
            parsingFail = true;
          }
          if (err||parsingFail) {
            console.log("$(bg-red)System backup saves are incorrect, starting with clear saves.");
            fs.writeFileSync('./cookies.json', JSON.stringify({}));
            main();
          } else {
            console.log("$(fg-green)Restoring data from last start backup");
            fs.writeFileSync('./cookies.json', JSON.stringify(require("../cookies-start-backup.json")));
            tokens = require("../cookies.json");
            console.log("$(fg-green)$(gb-bright)Success, starting!");
            main();
          }
        })
      } else {
        console.log("$(fg-green)Restoring data from last save backup");
        fs.writeFileSync('./cookies.json', JSON.stringify(require("../cookies-lastsave-backup.json")));
        tokens = require("../cookies.json");
        console.log("$(fg-green)$(gb-bright)Success, starting!");
        main();
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

router.get('/login', function(req, res, next) {
  activity(req, res);
  let login = req.body.login||false;
  if(!login) return res.redirect('/');
  let password = req.body.password||false;
  if(!password) return res.redirect('/');

  password = Buffer.concat([cipher.update(password), cipher.final()]);

  let q = await query(`SELECT * FROM users WHERE login=${mysql.escape(login)}`);
  if(q&&q.length == 1) {
      let r;
      do {
          r = getRandomString(40);
      } while(tokens[r]);
      tokens[r] = {user: q[0].id, created: new Date().getTime(), lastActivity: new Date().getTime(), ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress};
      res.cookie('token', r);
      res.redirect("/app");
  } else {
      res.cookie(`loginError`, true);
      res.redirect("/login");
  }
});

module.exports = router;
