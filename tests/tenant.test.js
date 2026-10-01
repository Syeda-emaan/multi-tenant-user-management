require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Company = require('../src/models/Company');

const tag = Date.now();
const auth = (t) => ({ Authorization: `Bearer ${t}` });
let a, b, employee;

beforeAll(async () => {
  if (!process.env.MONGO_URI_TEST || process.env.MONGO_URI_TEST === process.env.MONGO_URI) {
    throw new Error('Set MONGO_URI_TEST to a DIFFERENT database, or the tests would wipe real data');
  }
  await mongoose.connect(process.env.MONGO_URI_TEST);
  await Promise.all([User.deleteMany({}), Company.deleteMany({})]);
  await Promise.all([User.init(), Company.init()]);

  const reg = async (n) =>
    (await request(app).post('/api/auth/register-company').send({
      companyName: `Company ${n}`, companyEmail: `c${n}${tag}@test.com`,
      name: `Admin ${n}`, email: `admin${n}${tag}@test.com`, password: 'Password123',
    })).body.data;
  a = await reg('A');
  b = await reg('B');
  employee = (await request(app).post('/api/users').set(auth(a.token))
    .send({ name: 'Emp One', email: `emp${tag}@test.com`, password: 'Password123', role: 'employee' })).body.data;
});

afterAll(async () => {
  await Promise.all([User.deleteMany({}), Company.deleteMany({})]);
  await mongoose.disconnect();
});

test('password hash is never returned', () => {
  expect(employee.password).toBeUndefined();
});

test('company B cannot read company A user (404)', async () => {
  const res = await request(app).get(`/api/users/${employee._id}`).set(auth(b.token));
  expect(res.status).toBe(404);
});

test('company B list does not contain A users', async () => {
  const res = await request(app).get('/api/users').set(auth(b.token));
  expect(res.body.data.every((u) => u.companyId === b.company._id)).toBe(true);
});

test('company B cannot delete company A user', async () => {
  const res = await request(app).delete(`/api/users/${employee._id}`).set(auth(b.token));
  expect(res.status).toBe(404);
});

test('employee cannot create users (403)', async () => {
  const login = await request(app).post('/api/auth/login').send({ email: employee.email, password: 'Password123' });
  const res = await request(app).post('/api/users').set(auth(login.body.data.token))
    .send({ name: 'X Y', email: `x${tag}@test.com`, password: 'Password123' });
  expect(res.status).toBe(403);
});

test('manager cannot create an admin (403)', async () => {
  const m = (await request(app).post('/api/users').set(auth(a.token))
    .send({ name: 'Mgr One', email: `mgr${tag}@test.com`, password: 'Password123', role: 'manager' })).body.data;
  const login = await request(app).post('/api/auth/login').send({ email: m.email, password: 'Password123' });
  const res = await request(app).post('/api/users').set(auth(login.body.data.token))
    .send({ name: 'Bad Admin', email: `bad${tag}@test.com`, password: 'Password123', role: 'admin' });
  expect(res.status).toBe(403);
});

test('soft delete hides user and blocks login', async () => {
  const del = await request(app).delete(`/api/users/${employee._id}`).set(auth(a.token));
  expect(del.status).toBe(200);
  expect((await request(app).get(`/api/users/${employee._id}`).set(auth(a.token))).status).toBe(404);
  expect((await request(app).post('/api/auth/login').send({ email: employee.email, password: 'Password123' })).status).toBe(401);
  expect(await User.countDocuments({ _id: employee._id })).toBe(1); // still in DB
});