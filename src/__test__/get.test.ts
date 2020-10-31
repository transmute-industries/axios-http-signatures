import axios from 'axios';
import { getServer } from './server';

axios.defaults.adapter = require('axios/lib/adapters/http');

const server = getServer();

beforeAll(async () => {
  await server.listen(8080);
});

afterAll(() => {
  server.close();
});

it('test', async () => {
  const response = await axios({
    method: 'get',
    url: 'http://localhost:8080/ping',
  });
  expect(response.data.valid).toBe(true);
});
