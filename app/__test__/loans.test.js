import chai from 'chai';
import jwt from 'jsonwebtoken';
import chaiHttp from 'chai-http';
import app from '../../app';
import LoanId from '../helpers/Uid';

const { expect } = chai;
chai.use(chaiHttp);

let userToken,adminToken;
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
			userid: userid,
			firstname: 'Joseph',
			lastname: 'Njuguna',
			address: 'Kenya',
		  },
		  process.env.JWT_KEY, {
			expiresIn: '1h',
		  });
	});

	describe('/POST user request loan', () => {

		it('should check user token not available', (done) => {
			chai.request(app)
				.post('/api/v1/requestloan')
				.end((err, res) => {
					res.should.have.status(400);
					if (err) return done();
					done();
				});
		});

		it('should check loan field is not entered', (done) => {
			chai.request(app)
				.post('/api/v1/requestloan')
				.send({
					'': 10000,
				})
				.set('authorization', `Bearer ${userToken}`)
				.end((err, res) => {
					res.should.have.status(400);
					if (err) return done();
					done();
				});
		});

		it('should check loan amount is not entered', (done) => {
			chai.request(app)
				.post('/api/v1/requestloan')
				.send({
					amount: '',
				})
				.set('authorization', `Bearer ${userToken}`)
				.end((err, res) => {
					res.should.have.status(400);
					if (err) return done();
					done();
				});
		});

		it('should check successful loan request', (done) => {
			chai.request(app)
				.post('/api/v1/requestloan')
				.send({
					amount: 2000,
				})
				.set('authorization', `Bearer ${userToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});

		it('should check user has loan request available', (done) => {
			chai.request(app)
				.post('/api/v1/requestloan')
				.send({
					amount: 10000,
				})
				.set('authorization', `Bearer ${userToken}`)
				.end((err, res) => {
					res.should.have.status(409);
					if (err) return done();
					done();
				});
		});

	});

	describe('/GET admin get all loan applications', () => {
		
		it('should check that user is not admin', (done) => {
			chai.request(app)
				.get('/api/v1/loans')
				.set('authorization', `Bearer ${userToken}`)
				.end((err, res) => {
					res.should.have.status(403);
					if (err) return done();
					done();
				});
		});

		it('should get all loan applications', (done) => {
			chai.request(app)
				.get('/api/v1/loans')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});

		it('should check a loan id is not available', (done) => {
			chai.request(app)
				.get('/api/v1/loan/30000')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					res.should.have.status(404);
					expect(res.body.message).equals('Loan id not found');
					if (err) return done();
					done();
				});
		});

		it('should get a single loan application', (done) => {
			chai.request(app)
				.get(`/api/v1/loan/${loanId}`)
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});

	});

	describe('/PATCH admin accept loan application', () => {
		
		it('should check token is provided', (done) => {
			chai.request(app)
				.patch('/api/v1/loan/1')
				.set('authorization', '')
				.send({
					status: 'accepted',
				})
				.end((err, res) => {
					expect(res.status).equals(400);
					if (err) return done();
					done();
				});
		});

		it('should check a loan id is not available', (done) => {
			chai.request(app)
				.patch('/api/v1/loan/122')
				.set('authorization', `Bearer ${adminToken}`)
				.send({
					status: 'accepted',
				})
				.end((err, res) => {
					expect(res.body.message).equals('Loan id not found');
					if (err) return done();
					done();
				});
		});

		it('should update a loan application as accepted', (done) => {
			chai.request(app)
				.patch('/api/v1/loan/1')
				.set('authorization', `Bearer ${adminToken}`)
				.send({
					status: 'accepted',
				})
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});

	});

	describe('/GET  fully paid && not fully paid loan', () => {
		
		it('should check token is provided', (done) => {
			chai.request(app)
				.get('/api/v1/loan?status=accepted&repaid=true')
				.set('authorization', '')
				.end((err, res) => {
					expect(res.status).equals(400);
					if (err) return done();
					done();
				});
		});

		it('should get all loans fully paid', (done) => {
			chai.request(app)
				.get('/api/v1/loan?status=accepted&repaid=true')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					expect(res.status).equals(200);
					if (err) return done();
					done();
				});
		});

		it('should get all loans NOT fully paid', (done) => {
			chai.request(app)
				.get('/api/v1/loan?status=accepted&repaid=false')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					expect(res.status).equals(200);
					if (err) return done();
					done();
				});
		});

	});

	describe('/POST user pay loan', () => {
		
		it('check user has no token', (done) => {
			chai.request(app)
				.post(`/api/v1/payloan/${loanId}`)
				.set('authorization', '')
				.end((err, res) => {
					expect(res.status).equals(400);
					if (err) return done();
					done();
				});
		});

		it('check user has not entered amount to pay', (done) => {
			chai.request(app)
				.post(`/api/v1/payloan/${loanId}`)
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: '',
				})
				.end((err, res) => {
					expect(res.status).equals(400);
					if (err) return done();
					done();
				});
		});

		it('check user loan id doesn`t exist', (done) => {
			chai.request(app)
				.post(`/api/v1/payloan/${wrongId}`)
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: 575,
				})
				.end((err, res) => {
					expect(res.status).equals(404);
					if (err) return done();
					done();
				});
		});

		it('check user has paid loan first time', (done) => {
			chai.request(app)
				.post(`/api/v1/payloan/${loanId}`)
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: 575,
				})
				.end((err, res) => {
					expect(res.status).equals(200);
					if (err) return done();
					done();
				});
		});

		it('check user has paid loan second time', (done) => {
			chai.request(app)
				.post(`/api/v1/payloan/${loanId}`)
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: 575,
				})
				.end((err, res) => {
					expect(res.status).equals(200);
					if (err) return done();
					done();
				});
		});

		it('check user has paid loan third time', (done) => {
			chai.request(app)
				.post(`/api/v1/payloan/${loanId}`)
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: 575,
				})
				.end((err, res) => {
					expect(res.status).equals(200);
					if (err) return done();
					done();
				});
		});

		it('check user has paid loan fourth time', (done) => {
			chai.request(app)
				.post(`/api/v1/payloan/${loanId}`)
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: 575,
				})
				.end((err, res) => {
					expect(res.status).equals(200);
					if (err) return done();
					done();
				});
		});

	});

	describe('/GET user get loan payment history', () => {
		
		it('check user has no token', (done) => {
			chai.request(app)
				.get(`/api/v1/paymenthistory/${loanId}`)
				.set('authorization', '')
				.end((err, res) => {
					expect(res.status).equals(400);
					if (err) return done();
					done();
				});
		});

		it('should check a loan id is not available', (done) => {
			chai.request(app)
				.get(`/api/v1/paymenthistory/${wrongId}`)
				.set('authorization', `Bearer ${userToken}`)
				.send({
					status: 'accepted',
				})
				.end((err, res) => {
					expect(res.body.message).equals('Loan id not found');
					if (err) return done();
					done();
				});
		});

		it('should check a loan id is available', (done) => {
			chai.request(app)
				.get(`/api/v1/paymenthistory/${loanId}`)
				.set('authorization', `Bearer ${userToken}`)
				.end((err, res) => {
					expect(res.body.status).equals(200);
					if (err) return done();
					done();
				});
		});

	});

	describe('/GET user', () => {
	
		it('should check user loan application status', (done) => {
			chai.request(app)
				.get('/api/v1/viewloanrequest')
				.set('authorization', `Bearer ${userToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});

		it('should check user has no loan application', (done) => {
			chai.request(app)
				.get('/api/v1/viewloanrequest')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					res.should.have.status(404);
					if (err) return done();
					done();
				});
		});

	});

	describe('/GET all users loan repayments', ()=>{
		
		it('should get all loan applications', (done) => {
			chai.request(app)
				.get('/api/v1/payments')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});

	})
});
