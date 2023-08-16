const app = require("../app");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const readApi = require("../controllers/api-controllers");
const endpointsFile = require("../endpoints.json");

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
        expect(topics.length).toBeGreaterThan(0);
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
        expect(readApi.body).toEqual(endpointsFile);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with a 200 status code and gets a single article by its id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("GET: 400 sends an error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/burgers")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad request, no id found!");
      });
  });

  test("GET 404: responds with a 404 when given an valid but non exsistent id", () => {
    return request(app)
      .get("/api/articles/300")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("No article found!");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET 200: responds with a 200 status code and gets an array of comments by the article id number in descending order ", () => {
    const article_id = 1
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments).toBeSortedBy("created_at", {descending: true});
        expect(comments).toMatchObject([
            {
              comment_id: 5,
              body: 'I hate streaming noses',
              article_id: 1,
              author: 'icellusedkars',
              votes: 0,
              created_at: '2020-11-03T21:00:00.000Z'
            },
            {
              comment_id: 2,
              body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
              article_id: 1,
              author: 'butter_bridge',
              votes: 14,
              created_at: '2020-10-31T03:03:00.000Z'
            },
            {
              comment_id: 18,
              body: 'This morning, I showered for nine minutes.',
              article_id: 1,
              author: 'butter_bridge',
              votes: 16,
              created_at: '2020-07-21T00:20:00.000Z'
            },
            {
              comment_id: 13,
              body: 'Fruit pastilles',
              article_id: 1,
              author: 'icellusedkars',
              votes: 0,
              created_at: '2020-06-15T10:25:00.000Z'
            },
            {
              comment_id: 7,
              body: 'Lobster pot',
              article_id: 1,
              author: 'icellusedkars',
              votes: 0,
              created_at: '2020-05-15T20:19:00.000Z'
            },
            {
              comment_id: 8,
              body: 'Delicious crackerbreads',
              article_id: 1,
              author: 'icellusedkars',
              votes: 0,
              created_at: '2020-04-14T20:19:00.000Z'
            },
            {
              comment_id: 6,
              body: 'I hate streaming eyes even more',
              article_id: 1,
              author: 'icellusedkars',
              votes: 0,
              created_at: '2020-04-11T21:02:00.000Z'
            },
            {
              comment_id: 12,
              body: 'Massive intercranial brain haemorrhage',
              article_id: 1,
              author: 'icellusedkars',
              votes: 0,
              created_at: '2020-03-02T07:10:00.000Z'
            },
            {
              comment_id: 3,
              body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
              article_id: 1,
              author: 'icellusedkars',
              votes: 100,
              created_at: '2020-03-01T01:13:00.000Z'
            },
            {
              comment_id: 4,
              body: ' I carry a log — yes. Is it funny to you? It is not to me.',
              article_id: 1,
              author: 'icellusedkars',
              votes: -100,
              created_at: '2020-02-23T12:01:00.000Z'
            },
            {
              comment_id: 9,
              body: 'Superficially charming',
              article_id: 1,
              author: 'icellusedkars',
              votes: 0,
              created_at: '2020-01-01T03:08:00.000Z'
            }
        ])
        })
      });
  });
  test("GET 200: responds with a 200 and an empty array when no comments on an valid article id", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        const {comments} = response.body;
        expect(comments).toEqual([]);
      });
  });
  test("GET 404: respond with a 404 when no article id is valid but non exsistant and therefore no comments", () => {
    return request(app)
    .get("/api/articles/20000/comments")
    .expect(404)
    .then((response) => {
      const {msg} = response.body
      expect(msg).toBe("No article found!")
    })
  })
  test("GET 400: responds with a 400 when the article id is invalid", () => {
    return request(app)
    .get("/api/articles/whatsup/comments")
    .expect(400)
    .then((response) => {
      const {msg} = response.body
     expect(msg).toBe("Bad request, no id found!")
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
      expect(articles.length).toBeGreaterThan(0)
      articles.forEach((article) => { 
      expect(article).toHaveProperty("author", expect.any(String) )
      expect(article).toHaveProperty("title", expect.any(String))
      expect(article).toHaveProperty("article_id", expect.any(Number))
      expect(article).toHaveProperty("topic", expect.any(String))
      expect(article).toHaveProperty("created_at")
      expect(article).toHaveProperty("votes", expect.any(Number))
      expect(article).toHaveProperty("article_img_url")
      expect(article).toHaveProperty("comment_count", expect.any(String))
      })
    })
  })
})

