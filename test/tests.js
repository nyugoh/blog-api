const chai = require('chai');
const expect = require('chai').expect;
const app = require('../app.js');
const baseUrl = `http://localhost:${process.env.PORT}/api/v1/blog`;

chai.use(require('chai-http'));

describe('Blog API tests', function () {
  it('Home page contains a welcome message', function (done) {
    chai.request('http://localhost:'+process.env.PORT)
      .get('/')
      .end((err, res)=>{
        expect(err).to.be.a('null');
        expect(res.body).to.be.an('object')
          .that.has.property('message')
          .that.includes('Welcome');
        done();
      });
  });

  it('should have a wildcard route( caught-all route)', function (done) {
    let someEndpoint = '/hacker';
    let someOtherEndpoint = '/some-trial-route';
    chai.request(baseUrl)
      .get(someEndpoint)
      .end((err, res)=>{
        expect(err).to.be.a('null');
        expect(res.status).to.equal(505);
        expect(res.body).to.be.an('object')
          .that.has.property('message')
          .that.includes('wild-route');
      });

    chai.request(baseUrl)
      .get(someOtherEndpoint)
      .end((err, res)=>{
        expect(err).to.be.a('null');
        expect(res.status).to.equal(505);
        expect(res.body).to.be.an('object')
          .that.has.property('message')
          .that.includes('wild-route');
        done();
      });
  });
});
