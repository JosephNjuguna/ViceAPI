import jwt from 'jsonwebtoken';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import Db from '../db/db';
import userId from '../helpers/Uid';
import userDate from '../helpers/Date';

require('dotenv').config();

chai.should();
const { expect } = chai;
chai.use(chaiHttp);
const userIdtest = userId.uniqueId();
const user = {
  userid: userIdtest,
  email: 'test1@mail.com',
  firstname: 'test',
  lastname: 'test',
  password: 'qwerQ@qwerre123',
  address: 'kenya',
  status: 'unverified',
  isAdmin: false,
  signedupDate: userDate.date(),
};

let userToken; let wrongIdToken; let
  adminToken;
const wrongId = 134243;

describe('/USER DATA', () => {
  before('add user', (done) => {
    adminToken = jwt.sign({
      email: 'admin123@gmail.com',
      userid: '123admin',
      firstname: 'main',
      lastname: 'admin',
      address: 'database',
    },
    process.env.JWT_KEY, {
      expiresIn: '1h',
    });
    userToken = jwt.sign({
      email: 'test1@mail.com',
      userid: user.userid,
      firstname: 'Joseph',
      lastname: 'Njuguna',
      address: 'Kenya',
    },
    process.env.JWT_KEY, {
      expiresIn: '1h',
    });
    wrongIdToken = jwt.sign({
      email: 'test1@mail.com',
      userid: 'ds2323dse23',
      firstname: 'Joseph',
      lastname: 'Njuguna',
      address: 'Kenya',
    },
    process.env.JWT_KEY, {
      expiresIn: '1h',
    });
    Db.query('INSERT INTO users (userid, email, firstname, lastname, userpassword, address, status, isAdmin, signedupDate) values($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9)',
      [user.userid, user.email, user.firstname, user.lastname, user.password, user.address, user.status, user.isAdmin, user.signedupDate]);
    done();
  });

  after('after all test', (done) => {
    Db.query('DELETE FROM users');
    done();
  });

  describe('/GET user datail', () => {
    it('should not return a user when ID is invalid', (done) => {
      chai.request(app)
        .get('/api/v2/profile')
        .set('authorization', `Bearer ${wrongIdToken}`)
        .end((err, res) => {
          res.should.have.status(404);
          if (err) return done();
          done();
        });
    });

    it('should return one user detail', (done) => {
      chai.request(app)
        .get('/api/v2/profile')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          if (err) return done();
          done();
        });
    });
  });

  describe('/GET all users', () => {
    it('should not  return all users if not admin', (done) => {
      chai.request(app)
        .get('/api/v2/users')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          if (err) return done();
          res.should.have.status(403);
          done();
        });
    });

    it('should return all users', (done) => {
      chai.request(app)
        .get('/api/v2/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return done();
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/PATCH admin verify user', () => {
    it('should check user email is not available', (done) => {
      chai.request(app)
        .patch('/api/v2/user/test2@mail.com/verify')
        .set('authorization', `Bearer ${adminToken}`)
        .send({
          status: 'verified',
        })
        .end((err, res) => {
          expect(res.status).equals(404);
          if (err) return done();
          done();
        });
    });

    it('should check user email is available', (done) => {
      chai.request(app)
        .patch('/api/v2/user/test1@mail.com/verify')
        .set('authorization', `Bearer ${adminToken}`)
        .send({
          status: 'verified',
        })
        .end((err, res) => {
          res.should.have.status(200);
          if (err) return done();
          done();
        });
    });
  });
});
