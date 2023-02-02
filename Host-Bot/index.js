const client = {};
client.express = require('express');
client.app = client.express()
client.app.use(client.express.urlencoded({  extended: true }))
client.mysql = require("mysql");
client._ = require("./config.json");

var db = client.mysql.createConnection({
  host     : client._.License_System.mysql_host,
  user     : client._.License_System.mysql_user,
  password : client._.License_System.mysql_password,
  database : client._.License_System.mysql_database,
  timezone : client._.License_System.mysql_timezone
});

db.connect(function(err) {
  if (err) 
  {
    console.log('Error connecting to database');
    return setTimeout(() => { process.exit(0); }, 2500);
  } else console.log('Connected successfully from database');
  setInterval(function () { db.query('SELECT 1'); }, 5000);
});

setInterval(function(){ db.query("UPDATE list SET `valid` = 'false' WHERE `total_time` <= DATE_SUB(NOW(), INTERVAL 5 MINUTE)"); }, 60000); // set expired licenses

client.app.post('/license', (req, res) => {
    /*
    * authenticated = valid license (passed all checks
    * ip = ip registered on the database different from the requesting one
    * expired = license expired (valid = false)
    * invalid = license not registered in database or generic error
    * 
    * (return of a table to add any customs values)
    */
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.replace("::ffff:",""); 
    db.query(`SELECT * FROM list WHERE license = '${req.headers.license}'`, function (err, result, fields) {
        if(result.length > 0)
        {
            if(result)
            {
                if(!result[0].ip)
                    if(result[0].valid === "true")
                    {
                        db.query(`UPDATE list SET ip = '${ip}' WHERE license = '${req.headers.license}'`); // if it is the first request, it sets the ip automatically
                        return res.send({ status: "authenticated" });
                    }
                    else
                        return res.send({ status: "expired" });
                else
                    if(result[0].ip === ip)
                        if(result[0].valid === "true")
                            return res.send({ status: "authenticated" });
                        else
                            return res.send({ status: "expired" });
                    else
                        return res.send({ status: "ip" });
            }
            else
                return res.send({ status: "invalid" });
        }
        else
            return res.send({ status: "invalid" });
    });
}).listen(client._.License_System.express_port);