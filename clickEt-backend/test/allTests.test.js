import request from "supertest";
import { expect } from "chai";
import { describe, it } from "mocha";


const server = "http://localhost:8080/api/v1"; 

let authToken;

// Authentication Tests
describe("Authentication API Tests", () => {
  it("should register a new user", async () => {
    const res = await request(server).post("/auth/register").send({
      full_name: "Test User",
      user_name: "testuser",
      email: "test@example.com",
      phone_number: "9800000000",
      password: "Test@1234",
    });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message");
  });

  it("should login and return a token", async () => {
    const res = await request(server).post("/auth/login").send({
      user_name: "0to1e",
      password: "Rohan123@",
    });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("accessToken");
    authToken = res.body.accessToken;
  });

  it("should fetch user profile", async () => {
    const res = await request(server)
      .get("/auth/user/status")
      .set("Cookie", `access_token=${authToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("user");
  });
  it("should delete the registered user", async () => {
    const res = await request(server)
      .delete("/auth/delete/testuser")
      .set("Cookie", `access_token=${authToken}`);
    expect(res.status).to.equal(200);
  });
});

// Movie API Tests
describe("Movie API Tests", () => {
  it('should fetch movies with status "upcoming"', async () => {
    const res = await request(server).get("/movie/status/upcoming");

    expect(res.status).to.equal(200);

    expect(res.body.movies)
      .to.be.an("array")
      .and.satisfy((movies) =>
        movies.every((movie) => movie.status === "upcoming")
      );
  });

  it("should fetch all movies", async () => {
    const res = await request(server).get("/movie/getAll");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("movies");
  });
});

// Distributor API Tests
describe("Distributor API Tests", () => {
  it("should fetch all distributors", async () => {
    const res = await request(server).get("/distributor/getAll");
    expect(res.status).to.equal(200);
    expect(res.body.distributors).to.be.an("array");
  });

  it("should fetch distributors by status", async () => {
    const res = await request(server).get("/distributor/getByStatus/true");
    expect(res.status).to.equal(200);

    expect(res.body.distributors)
      .to.be.an("array")
      .and.satisfy((distributors) =>
        distributors.every((distributor) => distributor.isActive === true)
      );
  });
});

// Hall API Tests
describe("Hall API Tests", () => {
  const hallId = "67b48bbf21aa77d7b8716422"; // Replace with a valid ID

  it("should toggle hall status to deactivated", async () => {
    // First toggle - should deactivate the hall
    let res = await request(server)
      .patch(`/hall/toggle/${hallId}`)
      .set("Cookie", `access_token=${authToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.include("Hall deactivated successfully");
  });

  it("should toggle hall status to activated", async () => {
    // First toggle - should deactivate the hall
    let res = await request(server)
      .patch(`/hall/toggle/${hallId}`)
      .set("Cookie", `access_token=${authToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.include("Hall activated successfully");
  });

  it("should fetch all halls", async () => {
    const res = await request(server).get("/hall/getAll");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});

// Booking API Tests
describe("Booking API Tests", () => {
  it("should fetch all actively holded seats for a user", async () => {
    const res = await request(server)
      .get("/booking/holds/getAll")
      .set("Cookie", `access_token=${authToken}`);
    expect(res.status).to.equal(200);
  });
  it("should fetch all past bookings history", async () => {
    const res = await request(server)
      .get("/booking/history")
      .set("Cookie", `access_token=${authToken}`);
    expect(res.status).to.equal(200);
  });

  it("should  delete a booking", async () => {
    const deleteId = "67b943471dc22e3c800bd2df"; // have to change in each test run

    const res = await request(server).delete(`/booking/delete/${deleteId}`);
    expect(res.status).to.equal(200);
  });
});

// Payment API Tests
describe("Payment API tests", () => {
  it("should return payment status successfully", async () => {
    const pidx = "4RnncG9jRvHYG6M9hkjWog";
    const res = await request(server)
      .get(`/payments/khalti/status/${pidx}`)
      .set("Cookie", `access_token=${authToken}`);
    expect(res.status).to.equal(200);
  });

  it("should fetch all payments", async () => {
    const res = await request(server)
      .get("/payments/khalti/getAll")
      .set("Cookie", `access_token=${authToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.be.at.least(2);
  });
});
