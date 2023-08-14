const app = require("../app")
const testData = require("../db/data/test-data")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const request = require("supertest")

beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe("GET api/topics", () => {
    test("200: responds with a 200 status code and sends an array of topics with properties of slug and description", () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            
            const {topics} = response.body
            expect(topics).toEqual(expect.any(Array))
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description")
        })
        })
    })
})
