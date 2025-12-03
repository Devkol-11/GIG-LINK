import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const creators = table(
        'creators',
        {
                id: t.uuid('id').primaryKey(),

                userId: t
                        .uuid('user_id')
                        .notNull()
                        .unique()
                        .references(() => users.id, { onDelete: 'cascade' }),

                organizationName: t.varchar('organization_name', {
                        length: 255
                }),
                rating: t.real('rating').default(0),
                totalGigsPosted: t.integer('total_gigs_posted').default(0),
                verified: t.boolean('verified').default(false),

                createdAt: t.timestamp('created_at').defaultNow(),
                updatedAt: t.timestamp('updated_at').defaultNow()
        },
        (table) => [
                t.index('creators_verified_idx').on(table.verified),
                t.index('creators_rating_idx').on(table.rating)
        ]
);
