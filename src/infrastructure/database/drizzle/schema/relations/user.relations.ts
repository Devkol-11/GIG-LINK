import { relations } from 'drizzle-orm';
import { users } from '../tables/users.js';
import { refresh_tokens } from '../tables/refreshTokens.js';

export const userRelations = relations(users, ({ many }) => ({
        refreshTokens: many(refresh_tokens)
}));
