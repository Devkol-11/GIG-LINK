import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const refresh_tokens = table(
        'refresh_tokens',
        {
                id: t.uuid('id').primaryKey().defaultRandom(),

                user_id: t
                        .uuid('user_id')
                        .notNull()
                        .references(() => users.id, { onDelete: 'cascade' }),

                token: t.varchar('token', { length: 255 }).notNull(),

                expires_at: t.timestamp('expires_at').notNull(),

                created_at: t.timestamp('created_at').defaultNow()
        },
        (table) => [
                t.uniqueIndex('refresh_tokens_token_key').on(table.token),
                t.index('refresh_tokens_user_id_idx').on(table.user_id),
                t.index('refresh_tokens_expires_at_idx').on(table.expires_at)
        ]
);
