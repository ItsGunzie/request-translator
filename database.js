var sqlite3 = require('sqlite3').verbose();
var randomize = require('randomatic');

//updates the DB. takes in JSON as data and saves to the sqlite table. if null values are being saved the code is null too.
var updateDB = function(data) {
    var db = new sqlite3.Database('./db/lockers.db');
        for (let i=0; i < data.Locks.length; i++) {
            db.serialize(function() {
                var random_code = randomize('0', 6);
                if(data.Locks[i].customerName == null) {
                    random_code = null;
                }

                //check if code matches a current one in the DB. randomize until it doesn't.
                db.all("SELECT code FROM locks", function(err, codes) {
                    for(let j=0; j < codes.length; j++) {
                        while(random_code == codes[j].code && random_code !== null) {
                            console.log(`matching code! ${random_code} == ${codes[j].code}`);
                            random_code = randomize('0', 6);
                            console.log("new code " + random_code);
                        }
                    }
                });
                // db.run("SELECT * FROM locks WHERE code = 123456", function(data) {
                //     console.log("codes!" + data);
                // });
                db.run("UPDATE locks SET customerNam = $customerNam, carDesc = $carDesc, phoneNum = $phoneNum, code = $code WHERE lockerNum = $lockerNum", {
                    $lockerNum: data.Locks[i].LockerID,
                    $customerNam: data.Locks[i].customerName,
                    $carDesc: data.Locks[i].carDescription,
                    $phoneNum: data.Locks[i].phoneNumber,
                    $code: random_code
                }, function() {
                    console.log("ran the save with code: " + random_code);
                });
            });

        }
    db.close();
    return 'DATBASE UPDATED!';
}

exports.data = updateDB;