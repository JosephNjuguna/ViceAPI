const {
    envSetup
} = require('../db/db');

class usersModel {

    constructor(userid, username, email, password, signedup_on) {
        this.user_id= userid;
        this.username = username;
        this.email = email;
        this.password = password;
        this,signedup_on = signedup_on;
        this.dbConn = new envSetup()
    }

    createUser() {
        this.dbConn.saveData('SELECT email FROM users WHERE email = ($1)', [this.email], (error, dbRes) => {
            if (error) {
                return res.status(500).json({
                    "message": "Internal server error"
                });
            } else {
                if (dbRes.rows[0] == undefined) {
                    this.dbConn.saveData('INSERT INTO users(userid, username, email, password,  created_date) values($1, $2, $3, $4, $5)',
                        [this.user_id, this.username, this.email, this.password, this.signedup_on], (errorRes) => {

                            if (errorRes) {
                                const replyServer = {
                                    status: '500',
                                    success: false,
                                    message: 'Sign Up failed. Try again',
                                    description: 'Could not create user'
                                };
                                console.log(replyServer);
                                return res.status(500).json({
                                    "message": replyServer
                                });
                            } else {
                                return res.status(201).json({
                                    status: '201',
                                    success: true,
                                    message: 'User created',
                                    description: 'sign up successful',
                                    signedup_on: user.signedup_on
                                });
                            }
                        });
                } else {
                    return res.status(409).json({
                        "message": `this email :${user.email} already exist`
                    });
                }
            }
        });
    }
}

module.exports = usersModel