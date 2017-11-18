const mysql = require("mysql");
const http = require("http");
const nodemailer = require("nodemailer");
const con = mysql.createConnection({
    host: "mysql6.gear.host",
    user: "test7711",
    password: "Yb8Tz12_2!94",
    database: "test7711"
});

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'taajermail@gmail.com',
        pass: 'Abdualelah1'
    }
});


module.exports.Signup = http.createServer(function (req, res) {
    
    var body = "";
    req.on("data", function (chunk) {
        body += chunk;
        
    });

    req.on("end", function () {
        console.log(body);
        var json = JSON.parse(body);
        var fullName = json.fullName;
        var email = json.email;
        var password = json.password;
        var phone = json.phone;

        con.connect(function (error) {
            if (error) throw error;
            console.log("Connected");

            var sql = "INSERT INTO Users SET ?";
            var values = { FullName: fullName, Email: email, Password: password, Phone_Number: phone, isAgreePolicy: true }
            console.log(sql);
            con.query("SELECT * FROM Users WHERE Email = '" + email + "'", function (err, result, fields) {
                console.log("results: ", result);
                console.log("values", fields);
                console.log("error: ", err);

                // if (err) throw err;
                if (result == null) {
                    con.query(sql, values, function (error, result) {
                        if (error) throw error;
                        console.log("uploaded");
                        var mailOptions = {
                            from: '"Taajer" <taajermail@gmail.com>', // sender address (who sends)
                            to: email, // list of receivers (who receives)
                            subject: 'Hello', // Subject line // plaintext body
                            html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });
                    });
                } else {
                    res.write("Email Already Used");
                    res.statusCode(200);
                    res.end();
                    
                }

            });
        });
    });
}).listen(process.env.PORT || 5000);


module.exports.Signin = http.createServer(function (req, res) {

    var body = "";
    req.on("data", function (chunk) {
        body += chunk;
    });

    req.on("end", function () {
        var json = JSON.parse(body);
        var email = json.email;
        var password = json.password;

        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected");

            con.query("SELECT * FROM Users WHERE Email LIKE " + email, function (err, result) {

                if (result == null) {
                    res.write("Email or Password Incorrect");
                    res.statusCode(400);
                    res.end();
                } else {
                    if (result.Password != password) {
                        res.write("Email or Password Incorrect");
                        res.statusCode(400);
                        res.end();
                    } else {
                        res.write(result.UserID);
                        res.statusCode(200);
                        res.end();
                    }
                }

            })


        })

    });
}).listen(process.env.PORT || 5000);

module.exports.ResetPassword = http.createServer(function (req, res) {

    var body = "";

    req.on("data", function (chunk) {
        body += chunk;
    });

    req.on("end", function () {
        var json = JSON.parse(body);
        var email = json.email;
        const sql = "SELECT Name FROM Users WHERE Email = '" + email +"'";
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected");

            con.query(sql, function (err, result) {
                if (err) throw err;
                const mailOptions = {
            from: '"Taajer" <taajermail@gmail.com>',
            to: '"' + result +'"' + '<' + email +'>',
            subject: 'Reset Taajer Account Password',
            html: ''
        }
            })

        });
        
        transpoter.sendMail(mailOptions, function (err, info) {
            if (err) throw err;

        });
    })
}).listen(process.env.PORT || 5000);

module.exports.ChangePassword = http.createServer(function (req, res) {

    var body = "";

    req.on("data", function (chunk) {
        body += chunk;
    });

    req.on("end", function () {
        var json = JSON.parse(body);
        var UserID = json.userID;
        var newPassword = json.newPassword;

        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected");
            const sql = "UPDATE Users SET Password = '" + newPassword + "' WHERE UserID = '" + UserID + "'";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Password Updated");
                res.write("Password Updated");
                res.statusCode(200);
                res.end();
            })
        });

    });
}).listen(process.env.PORT || 5000);

module.exports.ChangeEmail = http.createServer(function (req ,res) {
    var body = "";

    req.on("data", function (chunk) {
        body += chunk;
    });

    req.on("end", function () {
        var json = JSON.parse(body);
        var newEmail = json.email;
        var UserID = json.userID;

        const sql = "UPDATE Users SET Email = '" + newEmail + "' WHERE UserID = '" + UserID + "'";
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connedted");
            con.query(sql, function(err, result) {
                if (err) throw err;
                console.log("Email Updated");
                res.write("Email Updated");
                res.statusCode(200);
                res.end();
            })
        })
    })
}).listen(process.env.PORT || 5000);



 