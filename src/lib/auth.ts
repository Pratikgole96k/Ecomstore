import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from './prisma';
import { UserSession } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'vastrika-super-secret-jwt-key-2026';
const COOKIE_NAME = 'vastrika_token';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(password, hashed);
}

export function signToken(payload: UserSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch {
    return null;
  }
}

/**
 * Get current session from HTTP-only cookie on Server Components or API routes
 */
export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.id) return null;

    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true, role: true, phone: true, avatar: true },
    });

    if (!user) return null;
    return user as UserSession;
  } catch (error) {
    console.error('Session retrieval error:', error);
    return null;
  }
}

/**
 * Check if the current user is an Admin
 */
export async function requireAdmin(): Promise<UserSession | null> {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return null;
  }
  return session;
}

export { COOKIE_NAME };
