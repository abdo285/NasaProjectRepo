const request = require("supertest");
const app = require("../../app");
const { loadPlanetsData } = require("../../models/planets.model");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("TEST GET /launches", () => {
    test("it should response with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
  describe("TEST POST /launches", () => {
    const data = {
      mission: "uss",
      rocket: "asdsad",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };
    const dataWithouDate = {
      mission: "uss",
      rocket: "asdsad",
      target: "Kepler-62 f",
    };
    const dataWithInvalidDate = {
      mission: "uss",
      rocket: "asdsad",
      target: "Kepler-62 f",
      launchDate: "zoo",
    };
    test("it should response with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(data)
        .expect("Content-Type", /json/)
        .expect(201);
      const requestDate = new Date(data.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(response.body).toMatchObject(dataWithouDate);
    });
    test("it should response with 400 success", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(dataWithouDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        err: "Missing required launch info",
      });
    });
    test("it should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(dataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        err: "Invalid launch date",
      });
    });
  });
});
