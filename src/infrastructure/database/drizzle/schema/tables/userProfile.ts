import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const userProfiles = table(
        'user_profiles',
        {
                id: t.uuid('id').primaryKey(),

                userId: t
                        .uuid('user_id')
                        .notNull()
                        .unique()
                        .references(() => users.id, { onDelete: 'cascade' }),

                bio: t.varchar('bio', { length: 255 }),

                skills: t.text('skills').array(),
                avatarUrl: t.varchar('avatar_url', { length: 255 }),
                interests: t.text('interests').array(),
                location: t.varchar('location', { length: 255 }).notNull(),

                createdAt: t.timestamp('created_at').defaultNow(),
                updatedAt: t.timestamp('updated_at').defaultNow()
        },
        (table) => [t.index('user_profiles_location_idx').on(table.location)]
);
