import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser("Rahasia123!"));
app.use(express.json());

app.get('/', (req, res) => {
    const name = req.signedCookies["Login"];
    res.send(`Hello ${name}`);
});

app.post('/login', (req, res) => {
    const name = req.body.name;
    res.cookie("Login", name, {path: "/", signed: true});
    res.send(`Hello ${name}`);
});

test("Test Signed Cookie Read", async () => {
    const response = await request(app).get("/")
        .set("Cookie", "Login=s%3ARicky.ECDRDowBsl93T%2F4UAclkfG9I2TTR3wfIaGApExB6Nww; Path=/");
    expect(response.text).toBe("Hello Ricky");
});

test("Test Signed Cookie Write", async () => {
    const response = await request(app).post("/login")
        .send({name: "Ricky"});
    console.info(response.get("Set-Cookie"));
    expect(response.get("Set-Cookie").toString()).toContain("Ricky");
    expect(response.text).toBe("Hello Ricky");
});