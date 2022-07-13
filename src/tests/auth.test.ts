import { AuthService } from '../auth/auth.service';
import { Users } from '../users/entities/user.entity';
import { createResponse } from 'node-mocks-http';
import { v4 as uuid } from 'uuid';

let service: AuthService;
let user = new Users();

beforeEach(() => {
  service = new AuthService();
  user.id = uuid();
  user.password = '_test_hashed';
  user.email = 'test@example.com';
});

test('Logout function sends status 200 when logout successfully', async () => {
  const response = await service.logout(user, createResponse());
  expect(response.statusCode).toBe(200);
});
