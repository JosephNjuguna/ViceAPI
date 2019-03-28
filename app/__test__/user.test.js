const user = require('./users');
const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const {
    addTables,
    dropTables,
    truncateTables,
    env_setup,
    pool
} = require('../db/db');

// dot env configuration
dotenv.config();
env_setup(process.env.test_environment);

let userAuth = {};
let adminAuth = {};

var m = new Date();
var datestring = m.getFullYear() + "/" +
    ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
    ("0" + m.getDate()).slice(-2) + " " +
    ("0" + m.getHours()).slice(-2) + ":" +
    ("0" + m.getMinutes()).slice(-2) + ":" +
    ("0" + m.getSeconds()).slice(-2);

const normalUser = {
    userid: '123user',
    username: "joe",
    email: "test1@mail.com",
    password: 'qwerQ@qwerre123',
    signup_on: datestring
};

const adminUser = {
    userid: '123admin',
    username: "admin",
    email: "admin123@mail.com",
    password: 'qwerQ@qwerre123',
    signup_on: datestring
};

// before each request, create a user and log them in
beforeAll(async () => {
    await addTables();
});

// before each request, create a user and log them in
beforeEach(async () => {
    // add normal user
    await pool.query("INSERT INTO users (userid, username, email, password, created_date) VALUES ($1, $2, $3, $4, $5)", [
        normalUser.userid, normalUser.username, normalUser.email, normalUser.password, normalUser.signup_on
    ]);

    //  add admin user
    await pool.query("INSERT INTO users (userid, username, email, password, created_date) VALUES ($1, $2, $3, $4, $5)", [
        adminUser.userid, adminUser.username, adminUser.email, adminUser.password, adminUser.signup_on
    ]);

    const userLogin = await request(app)
        .post("/login")
        .send({
            email: "test1@mail.com",
            password: 'qwerQ@qwerre123'
        });
    userAuth.token = userLogin.body.token;
    userAuth.userEmail = jwt.decode(userAuth.token).email;
    userAuth.userid = jwt.decode(userAuth.token).id;

    const adminLogin = await request(app)
        .post("/login")
        .send({
            email: "admin123@mail.com",
            password: 'qwerQ@qwerre123'
        });
    adminAuth.token = adminLogin.body.token;
    adminAuth.adminEmail = jwt.decode(adminAuth.token).email;
    adminAuth.adminid = jwt.decode(adminAuth.token).id;

});
//  delete from the users table
afterEach(async () => {
    await pool.query("DELETE FROM users");
});

// after all drop the tables for the next test
afterAll(async () => {
    await dropTables();
});

describe('/POST user sign up', () => {

    it('should fail with empty username field', (done) => {
        request(app)
            .post('/signup')
            .send(user.user1)
            .expect(400)
            .end((err, res) => {
                expect(res.body.message).toEqual("username field empty");
                if (err) return done();
                done();
            });
    });

    it('should fail with empty email field', (done) => {
        request(app)
            .post('/signup')
            .send(user.user2)
            .expect(400)
            .end((err, res) => {
                expect(res.body.message).toEqual("email field empty");
                if (err) return done();
                done();
            });
    });

    it('should fail with empty password field', (done) => {
        request(app)
            .post('/signup')
            .send(user.user3)
            .expect(400)
            .end((err, res) => {
                expect(res.body.message).toEqual("password field empty");
                if (err) return done();
                done();
            });
    });

    it('user sign up', (done) => {
        request(app)
            .post('/signup')
            .send(user.user4)
            .expect(201)
            .end((err, res) => {
                // expect(res.body.message).toEqual('undefined');
                expect(res.body.message).toEqual('User created');
                if (err) return done();
                done();
            });
    });

    it('user email already exist', (done) => {
        request(app)
            .post('/signup')
            .send(normalUser)
            .expect(409)
            .end((err, res) => {
                expect(res.body.message).toEqual(`this email :${normalUser.email} already exist`);
                if (err) return done();
                done();
            });
    });

});

describe('/GET one user', () => {

    const userid = 150;
    it('should not return a user when ID is invalid', (done) => {
        request(app)
            .get(`/user/${userid}`)
            .set('authorization', `Bearer ${userAuth.token}`)
            .expect(404)
            .end((err, res) => {
                expect(res.body.message).toEqual("ID not available");
                if (err) return done();
                done();
            });
    });

    it('should return one user detail', (done) => {
        request(app)
            .get(`/user/${userAuth.userid}`)
            .set('authorization', `Bearer ${userAuth.token}`)
            .expect(400)
            .end((err, res) => {
                expect(res.body.message).toEqual(`welcome`);
                if (err) return done();
                done();
            });
    });

});

describe('/GET all users', () => {

    it('should not  return all users if not admin', (done) => {
        request(app)
            .get('/users')
            .set('Authorization', `Bearer ${userAuth.token}`)
            .expect(401)
            .end((err, res) => {
                expect(res.body.message).toEqual("Access Denied! You are not allowed to access this route");
                if (err) return done();
                done();
            });
    });

    it('should retun all users', (done) => {
        request(app)
            .get('/users')
            .set('Authorization', `Bearer ${adminAuth.token}`)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).toEqual(true);
                if (err) return done();
                done();
            });
    });

});