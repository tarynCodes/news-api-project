const app = require("../app");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const readApi = require("../controllers/api-controllers")
const endpointsFile = require("../endpoints.json")


beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe("GET api/topics", () => {
  test("200: responds with a 200 status code and sends an array of topics with properties of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;
        expect(topics).toEqual(expect.any(Array));
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});
describe("GET api/", () => {
  test("200: responds with a 200 status code and responds with a JSON obj with all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((readApi) => {
        expect(readApi.body).toEqual(endpointsFile)
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with a 200 status code and gets a single article by its id", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then((response) => {
      const article = response.body.article
    expect(article).toMatchObject({
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
    })
    })
  })

  test("GET: 400 sends an error message when given an invalid id", () => {
    return request(app)
    .get('/api/articles/burgers')
    .expect(400)
    .then((response) => {
      const {msg} = response.body
      expect(msg).toBe('Bad request, no id found!')
    })
  })

  test("GET 404: responds with a 404 when given an valid but non exsistent id", () =>{
    return request(app)
    .get('/api/articles/300')
    .expect(404)
    .then((response) => {
      const {msg} = response.body
      expect(msg).toBe('No article found!');
    })
  })
})

describe("Get /api/articles", ()=>{
  test("GET 200: responds with an array of articles sorted by descending order", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then((response) => {
      const {articles} = response.body
      expect(articles).toBeSortedBy("created_at",{ descending: true })
      articles.forEach((article) => { 
      expect(article).toHaveProperty("author")
      expect(article).toHaveProperty("title")
      expect(article).toHaveProperty("article_id")
      expect(article).toHaveProperty("topic")
      expect(article).toHaveProperty("created_at")
      expect(article).toHaveProperty("votes")
      expect(article).toHaveProperty("article_img_url")
      expect(article).toHaveProperty("comment_count")
      })
    })
  })
})

