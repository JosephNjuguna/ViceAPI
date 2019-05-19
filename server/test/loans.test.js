import jwt from 'jsonwebtoken';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import LoanId from '../helpers/Uid';
import Db from '../db/db';

require('dotenv').config();

const {
  expect,
} = chai;
chai.should();
chai.use(chaiHttp);

let userToken, adminToken;
const loanId = LoanId.uniqueId();
const userid = LoanId.uniqueId();
const wrongId = 1232;

describe('/LOAN', () => {
  before('generate JWT', (done) => {
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
      userid,
      firstname: 'Joseph',
      lastname: 'Njuguna',
      address: 'Kenya',
    },
    process.env.JWT_KEY, {
      expiresIn: '1h',
    });
    done();
  });

  after('after all test', (done) => {
    Db.query('DELETE FROM loans');
    Db.query('DROP TABLE IF EXISTS loans');
    done();
  });

  describe('/POST user request loan', () => {
    it('should check user token not available', (done) => {
      chai.request(app)
        .post('/api/v2/requestloan')
        .set('authorization', '')
        .send({
          amount: 10000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          if (err) return done();
          done();
        });
    });

    it('should check loan field is not entered', (done) => {
      chai.request(app)
        .post('/api/v2/requestloan')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          '': 10000,
        })
        .end((err, res) => {
          res.should.have.status(400);
          if (err) return done();
          done();
        });
    });

    it('should check loan amount is not entered', (done) => {
      chai.request(app)
        .post('/api/v2/requestloan')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          amount: '',
        })
        .end((err, res) => {
          res.should.have.status(400);
          if (err) return done();
          done();
        });
    });

    it('should check successful loan request', (done) => {
      chai.request(app)
        .post('/api/v2/requestloan')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          amount: 2000
        })
        .end((err, res) => {
          res.should.have.status(200);
          if (err) return done();
          done();
        });
    });

    it('should check user has loan request available', (done) => {
      chai.request(app)
        .post('/api/v2/requestloan')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          amount: 10000,
        })
        .end((err, res) => {
          res.should.have.status(409);
          if (err) return done();
          done();
        });
    });
  });
  
  describe('/GET admin', () => {
    
		it('should get all loan applications', (done) => {
			chai.request(app)
				.get('/api/v2/loans')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});

		it('should check a loan id is not available', (done) => {
			chai.request(app)
				.get('/api/v2/loan/30000')
				.set('authorization', `Bearer ${adminToken}`)
				.send({ status: 'rejected' })
				.end((err, res) => {
					res.should.have.status(404);
					if (err) return done();
					done();
				});
		});

		it('should get a single loan application', (done) => {
			chai.request(app)
				.get('/api/v2/loan/123loan')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});

		it('should get all loans fully paid', (done) => {
			chai.request(app)
				.get('/api/v2/fullyrepaid?status=accepted&repaid=true')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});

		it('should get all loans not fully paid', (done) => {
			chai.request(app)
				.get('/api/v2/notfullyrepaid?status=accepted&repaid=false')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});

		it('should update a loan application as accepted', (done) => {
			chai.request(app)
				.patch('/api/v2/loan/123loan')
				.set('authorization', `Bearer ${adminToken}`)
				.send({ status: 'accepted' })
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
    });
    
	});
})