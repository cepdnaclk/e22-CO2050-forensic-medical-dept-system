// src/data/mockAuth.js
// Mock authentication service for development

import { users, ROLES } from './mockData';

// Simulated credentials for each role
const credentials = {
  admin: { password: 'admin123', userId: 1 },
  'dr.wickramasinghe': { password: 'jmo123', userId: 2 },
  'registrar.kandy': { password: 'reg123', userId: 3 },
  'si.perera': { password: 'police123', userId: 4 },
  'clerk.fernando': { password: 'clerk123', userId: 5 },
  'dr.silva': { password: 'jmo456', userId: 6 },
};

// Simple base64 encode to simulate JWT (NOT for production)
function createMockToken(user) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60, // 8 hours
    })
  );
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

function decodeMockToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function mockLogin(username, password, mfaCode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cred = credentials[username];
      if (!cred || cred.password !== password) {
        reject({ message: 'Invalid username or password. Please try again.' });
        return;
      }

      const user = users.find((u) => u.id === cred.userId);
      if (!user) {
        reject({ message: 'User account not found.' });
        return;
      }

      if (!user.isActive) {
        reject({ message: 'This account has been deactivated. Contact the administrator.' });
        return;
      }

      // MFA check for Admin and JMO
      if (user.role === ROLES.ADMIN || user.role === ROLES.JMO) {
        if (user.mfaEnabled && mfaCode !== '123456') {
          reject({ message: 'Invalid MFA code. Please try again.' });
          return;
        }
      }

      const token = createMockToken(user);
      resolve({
        token,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          email: user.email,
        },
      });
    }, 500); // Simulate network delay
  });
}

export function mockLogout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Logged out successfully.' });
    }, 200);
  });
}

export { decodeMockToken };
