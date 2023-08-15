const app = require("../app");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const readApi = require("../controllers/api-controllers")
const endpointsFile = require("../endpoints.json");
const { forEach } = require("../db/data/test-data/articles");

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
  test("200: responds with 200 to get any article by its id", () => {
    const article_id = 2
    return request(app)
    .get(`/api/articles/${article_id}`)
    .expect(200)
    .then((response) => {
      const articles = response.body.article
      expect(articles).toMatchObject({ 
      title: "Sony Vaio; or, The Laptop",
      topic: "mitch",
      author: "icellusedkars",
      body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",})
      expect(articles).toHaveProperty("title", expect.any(String))
      expect(articles).toHaveProperty("topic", expect.any (String))
      expect(articles).toHaveProperty("article_id", expect.any (Number))
      expect(articles).toHaveProperty("body")
      expect(articles).toHaveProperty("created_at")
      expect(articles).toHaveProperty("article_img_url")
      expect(articles).toHaveProperty("votes", expect.any (Number))
      expect(articles).toHaveProperty("author", expect.any (String))
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
