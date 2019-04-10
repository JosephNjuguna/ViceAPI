const user = require('./mockData');
const app = require('../../app');
const jwt = require('jsonwebtoken');

const {
    addTables,
    createAdmin,
    dropTables,
    pool
} = require('../db/db');

addTables();
createAdmin();

const chai = require('chai');
const chaiHttp = require('chai-http');
var assert = chai.assert;
var expect = chai.expect; 
var should = chai.should();
chai.use(chaiHttp);

const normalUser = {
    userid: "id-egg0o7qf5p",
    name: "joe",
    email: "test1@mail.com",
    password: 'qwerQ@qwerre123',
    signup_on: "2019/04/03 13:15:44"
};
const usertoken = jwt.sign({
        email: "test1@mail.com",
        id: 2
    },
    process.env.JWT_PUBLIC_KEY, {
        expiresIn: '1h',
    }
);

const admintoken = jwt.sign({
        email: "admin123@mail.com",
        id: 1
    },
    process.env.JWT_PUBLIC_KEY, {
        expiresIn: '1h',
    }
);

describe('/USERS auth', function () {

    before("add table", (done) => {
        addTables();
        done();
    });

    beforeEach("add user",(done) => {
        // add normal user
        pool.query("INSERT INTO users (userid, username, email, password, created_date) VALUES ($1, $2, $3, $4, $5) RETURNING *", [
            normalUser.userid, normalUser.name, normalUser.email, normalUser.password, normalUser.signup_on
        ]);
        done();
    });

    after(async () => {
        pool.query('DELETE FROM users');
    });
    //test cases
    describe('/POST AUTHENTIACTION ', (done) => {
        it('should fail with empty username field', (done) => {
            chai.request(app)
                .get('/api/v1/')
                .end((err, res) => {
                    res.should.have.status(200);
                    // expect(res.body.message).to.equal('welcome to the api');
                    if (err) return done();
                    done();
                });
        });

        it('should fail with empty username field', (done) => {
            chai.request(app)
                .post('/api/v1/signup')
                .send(user.user1)
                .end((err, res) => {
                    res.should.have.status(400);
                    if (err) return done();
                    done();
                });
        });

        it('should fail with empty email field', (done) => {
            chai.request(app)
                .post('/api/v1/signup')
                .send(user.user2)
                .end((err, res) => {
                    res.should.have.status(400);
                    if (err) return done();
                    done();
                });
        });

        it('should fail with empty password field', (done) => {
            chai.request(app)
                .post('/api/v1/signup')
                .send(user.user3)
                .end((err, res) => {
                    res.should.have.status(400);
                    if (err) return done();
                    done();
                });
        });

        it('should check user sign up', (done) => {
            chai.request(app)
                .post('/api/v1/signup')
                .send(user.user4)
                .end((err, res) => {
                    res.should.have.status(201);
                    if (err) return done();
                    done();
                });
        });

        it('should check user email already exist', (done) => {
            chai.request(app)
                .post('/api/v1/signup')
                .send(normalUser)
                .end((err, res) => {
                    res.should.have.status(409);
                    if (err) return done();
                    done();
                });
        });
    });

    describe('/GET USER DETAILS', (done) => {
        const userid = 150;
        it('should not return a user when ID is invalid', (done) => {
            chai.request(app)
                .get(`/api/v1/user/${userid}`)
                .set('authorization', `Bearer ${usertoken}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    if (err) return done();
                    done();
                });
        });

        it('should return one user detail', (done) => {
            const user_id= "id-egg0o7qf5p";
            chai.request(app)
                .get(`/api/v1/user/${user_id}`)
                .set('authorization', `Bearer ${usertoken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    if (err) return done();
                    done();
                });
        });
    });

    describe('/GET all users', (done) => {

        it('should not  return all users if not admin', (done) => {
            chai.request(app)
                .get('/api/v1/users')
                .set('Authorization', `Bearer ${usertoken}`)
                .end((err, res) => {
                    if (err) return done();
                    res.should.have.status(401);
                    done();
                });
        });

        it('should return all users', (done) => {
            chai.request(app)
                .get('/api/v1/users')
                .set('Authorization', `Bearer ${admintoken}`)
                .end((err, res) => {
                    if (err) return done();
                    res.should.have.status(200);
                    done();
                });
        });

    });

});