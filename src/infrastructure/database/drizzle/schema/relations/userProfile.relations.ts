import { relations } from 'drizzle-orm';
import { users } from '../tables/users.js';
import { userProfiles } from '../tables/userProfile.js';

export const userProfileRelations = relations(userProfiles, ({ one }) => ({
        user: one(users, {
                fields: [userProfiles.userId],
                references: [users.id]
        })
}));

export const userRelationsExtension = relations(users, ({ one }) => ({
        profile: one(userProfiles)
}));
