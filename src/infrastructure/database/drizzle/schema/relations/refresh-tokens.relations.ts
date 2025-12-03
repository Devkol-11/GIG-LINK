import { relations } from 'drizzle-orm';
import { refresh_tokens } from '../tables/refreshTokens.js';
import { users } from '../tables/users.js';

export const refreshTokenRelations = relations(refresh_tokens, ({ one }) => ({
        user: one(users, {
                fields: [refresh_tokens.user_id],
                references: [users.id]
        })
}));
