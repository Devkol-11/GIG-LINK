// schemas/user.ts
import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { rolesEnum } from '../enums/enums.js';

export const users = table(
        'users',
        {
                id: t.uuid('id').primaryKey().defaultRandom(),

                google_id: t.varchar('google_id', { length: 255 }),

                email: t.varchar('email', { length: 255 }).notNull(),

                password_hash: t.varchar('password_hash', { length: 255 }),

                first_name: t.varchar('first_name', { length: 255 }).notNull(),
                last_name: t.varchar('last_name', { length: 255 }).notNull(),

                phone_number: t.varchar('phone_number', { length: 20 }),

                is_email_verified: t
                        .boolean('is_email_verified')
                        .default(false),

                role: rolesEnum('role').default('FREELANCER'),

                refresh_token: t.varchar('refresh_token', { length: 255 }),

                created_at: t.timestamp('created_at').defaultNow(),
                updated_at: t.timestamp('updated_at').defaultNow()
        },
        (table) => [
                t.uniqueIndex('users_email_key').on(table.email),
                t.index('users_role_idx').on(table.role),
                t.index('users_created_at_idx').on(table.created_at)
        ]
);
