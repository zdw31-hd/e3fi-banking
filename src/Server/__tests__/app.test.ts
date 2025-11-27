import fs from "fs";
import os from "os";
import path from "path";
import request from "supertest";

// Set isolated data file before importing app
const tempFile = path.join(os.tmpdir(), `bank-data-${Date.now()}.json`);
process.env.DATA_FILE_PATH = tempFile;

import app from "../app";

const removeTempFile = () => {
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
};

describe("API Endpunkte (Auth & Konten)", () => {
  afterEach(() => {
    removeTempFile();
  });

  const readPersisted = () => {
    const raw = fs.readFileSync(tempFile, "utf-8");
    return JSON.parse(raw);
  };

  test("POST /signup legt User an und leitet auf /dashboard um", async () => {
    const agent = request.agent(app);
    const res = await agent
      .post("/signup")
      .type("form")
      .send({ name: "Alice", email: "alice@test.de", password: "secret" });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/dashboard");

    const data = readPersisted();
    expect(data.users).toHaveLength(1);
    expect(data.users[0].email).toBe("alice@test.de");
  });

  test("POST /login schlägt fehl bei falschem Passwort", async () => {
    // Vorher einen User anlegen
    const agent = request.agent(app);
    await agent
      .post("/signup")
      .type("form")
      .send({ name: "Bob", email: "bob@test.de", password: "pw123" });

    const res = await agent
      .post("/login")
      .type("form")
      .send({ email: "bob@test.de", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.text).toContain("Login fehlgeschlagen");
  });

  test("Konto anlegen, einzahlen und abheben aktualisiert Persistenz", async () => {
    const agent = request.agent(app);
    await agent
      .post("/signup")
      .type("form")
      .send({ name: "Cara", email: "cara@test.de", password: "pw" });

    // Konto anlegen
    const createRes = await agent
      .post("/accounts")
      .type("form")
      .send({ accountType: "standard", initialBalance: 1000 });
    expect(createRes.status).toBe(302);

    let data = readPersisted();
    expect(data.accounts).toHaveLength(1);
    const accountNumber = data.accounts[0].accountNumber;

    // Einzahlung
    const depositRes = await agent
      .post(`/accounts/${accountNumber}/deposit`)
      .type("form")
      .send({ amount: 200 });
    expect(depositRes.status).toBe(200);

    // Abhebung
    const withdrawRes = await agent
      .post(`/accounts/${accountNumber}/withdraw`)
      .type("form")
      .send({ amount: 150 });
    expect(withdrawRes.status).toBe(200);

    data = readPersisted();
    const persistedAcc = data.accounts.find((a: any) => a.accountNumber === accountNumber);
    expect(persistedAcc.balance).toBeCloseTo(1050); // 1000 + 200 - 150
  });
});
