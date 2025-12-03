import { relations } from 'drizzle-orm';
import { creators } from '../tables/creator.js';
import { users } from '../tables/users.js';

export const creatorRelations = relations(creators, ({ one, many }) => ({
        user: one(users, {
                fields: [creators.userId],
                references: [users.id]
        }),

        gigs: many(() => import('../tables/gig.js').then((m) => m.gigs))
}));

export const userCreatorProfileRelation = relations(users, ({ one }) => ({
        creatorProfile: one(creators)
}));
