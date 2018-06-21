const chai = require('chai');
const expect = require('chai').expect;
const Blog = require('../../app/models/Blog');
const app = require('../../app.js');
const baseUrl = `http://localhost:${process.env.PORT}/api/v1/blog`;
chai.use(require('chai-http'));

describe('Blog model tests suite', function(){
  // Remove any records present
  /*before(function (done) {
    Blog.remove((err =>{
      done();
    }));
  });*/

  describe('It should', function () {
    before(function (done) {
      Blog.remove({}, (err =>{
        done();
      }));
    });
    it('list all blogs', function (done) {
      chai.request(baseUrl)
        .get('/list')
        .end((err, res)=>{
          expect(err).to.be.a('null');
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object')
            .that.has.property('blogs')
            .that.has.lengthOf(0); // No blogs since we cleared collection
          done();
        });
    });

    it('insert new blog post', function (done) {
      let blog = new Blog({
        title: 'Hello world test',
        description: 'Lorem ipsum text'
      });
      chai.request(baseUrl)
        .post('/add')
        .send({ blog })
        .end((err, res)=>{
          expect(err).to.be.a('null');
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object')
            .that.has.property('blog')
            .that.has.property('_id');
          done();
        });
    });
  });

  // Clear the database
  after(function (done) {
    Blog.remove((err =>{
      done();
    }));
  });
});
