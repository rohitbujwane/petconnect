import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/types';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

export const generateToken = (user: User): string => {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, config.jwtSecret) as TokenPayload;
  } catch (error) {
    return null;
  }
};
