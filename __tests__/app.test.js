const app = require("../app");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const readApi = require("../controllers/api-controllers")

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
  test.only("200: responds with a 200 status code and responds with a JSON obj with all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((readApi) => {
        expect(readApi.body).toEqual(expect.any(Object))
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200: responds with a 200 status code and gets an article by its id", () => {
    return request(app)
    .get(`/api/articles/${article_id}`)
    .expect(200)
    .then((response) => {
      const recievedArticle = response.body 
    })
  })
})
