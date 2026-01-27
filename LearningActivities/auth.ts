//LearningActivities/auth.ts

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';

import clientPromise from '@/app/lib/mongodb';
import type { User } from '@/app/lib/definitions';

async function getUser(email: string): Promise<User | null> {
  const client = await clientPromise;
  const db = client.db('test');
  return db.collection<User>('users').findOne({ email });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUser(email);
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        // Must return an object with an id
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
});
