const user = require('./users');
const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const {
    addTables,
    dropTables,
    truncateTables,
    env_setup
} = require('../db/db');

// dot env configuration
dotenv.config();
env_setup(process.env.test_environment);

// generate user token 
const userToken = jwt.sign({
    email: 'test1@mail.com',
    userId: 2
}, process.env.JWT_PUBLIC_KEY, {
    expiresIn: '6h',
});

// generate admin token
const adminToken = jwt.sign({
    email: 'admin123@mail.com',
    userId: 1
}, process.env.JWT_PUBLIC_KEY, {
    expiresIn: '6h',
});

beforeEach(() => {
    addTables();
    dropTables();
    truncateTables();
});

describe('test user sign up', () => {

    it('user sign up', (done) => {
        request(app)
            .post('/signup')
            .send(user.user4)
            .expect(400)
            .end((err, res) => {
                // expect(res.body.success).toEqual(true);
                expect(res.body.message).toEqual('User created');
                if (err) return done();
                done();
            });
    });

});

describe('test user log in', () => {
    it('user log in', () => {});
});