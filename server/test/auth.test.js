import chai from 'chai';
import chaiHttp from 'chai-http';
import userData from '../MockData/usermockData';
import app from '../../app';
import Db from '../db/db';
import userId from '../helpers/Uid';
import Token from '../helpers/Token';
import userDate from '../helpers/Date';
import EncryptData from '../helpers/Encrypt';

chai.should();
chai.use(chaiHttp);
const hashedPassword = EncryptData.generateHash('qwerQ@qwerre123');
const userIdtest = userId.uniqueId();

const user = {
  userid: userIdtest,
  email: 'test1@mail.com',
  firstname: 'test',
  lastname: 'test',
  password: hashedPassword,
  address: 'kenya',
  status: 'unverified',
  isAdmin: false,
  signedupDate: userDate.date(),
};

const usertoken = new Token.genToken(user.email, user.userid, user.firstname, user.lastname, user.address);
const admintoken = new Token.genToken('admin123@mail.com', '123admin', 'admin', 'main', 'database');
const userid = 150;

describe('/USERS auth', () => {
  before('add user', (done) => {
    Db.query('INSERT INTO users (userid, email, firstname, lastname, userpassword, address, status, isAdmin, signedupDate) values($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9)',
      [user.userid, user.email, user.firstname, user.lastname, user.password, user.address, user.status, user.isAdmin, user.signedupDate]);
    done();
  });

  after('after all test', (done) => {
    Db.query('DELETE FROM users');
    done();
  });

  describe('/POST AUTHENTIACTION ', () => {
    it('should fail with empty firstname field', (done) => {
      chai.request(app)
        .post('/api/v2/signup')
        .send(userData.user1)
        .end((err, res) => {
          res.should.have.status(400);
          if (err) return done();
          done();
        });
    });

    it('should fail with empty lastname field', (done) => {
      chai.request(app)
        .post('/api/v2/signup')
        .send(userData.user2)
        .end((err, res) => {
          res.should.have.status(400);
          if (err) return done();
          done();
        });
    });

    it('should fail with empty email field', (done) => {
      chai.request(app)
        .post('/api/v2/signup')
        .send(userData.user3)
        .end((err, res) => {
          res.should.have.status(400);
          if (err) return done();
          done();
        });
    });

    it('should fail with empty password field', (done) => {
      chai.request(app)
        .post('/api/v2/signup')
        .send(userData.user4)
        .end((err, res) => {
          res.should.have.status(400);
          if (err) return done();
          done();
        });
    });

    it('should successfully sign up user', (done) => {
      chai.request(app)
        .post('/api/v2/signup')
        .send(userData.user5)
        .end((err, res) => {
          res.should.have.status(201);
          if (err) return done();
          done();
        });
    });

    it('should check user email already exist', (done) => {
      chai.request(app)
        .post('/api/v2/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(409);
          if (err) return done();
          done();
        });
    });
  });

  describe('/POST login', () => {

    it('should have user email', (done) => {
      chai.request(app)
        .post('/api/v2/login')
        .send({
          email: '',
          password: 'qwerQ@qwerre123',
        })
        .end((err, res) => {
          res.should.have.status(400);
          if (err) return done();
          done();
        });
    });

    it('should have user password ', (done) => {
      chai.request(app)
        .post('/api/v2/login')
        .send({
          email: 'test1@mail.com',
          password: '',
        })
        .end((err, res) => {
          res.should.have.status(400);
          if (err) return done();
          done();
        });
    });

    it('should successfully log in user', (done) => {
      chai.request(app)
        .post('/api/v2/login')
        .send({
          email: 'test1@mail.com',
          password: 'qwerQ@qwerre123',
        }).end((err, res) => {
          res.should.have.status(200);
          if (err) return done();
          done();
        });
    });

    it('should check user password mismatch', (done) => {
      chai.request(app)
        .post('/api/v2/login')
        .send({
          email: 'test1@mail.com',
          password: 'qwerQ@qwerre13',
        }).end((err, res) => {
          res.should.have.status(401);
          if (err) return done();
          done();
        });
    });
    

  });
});
