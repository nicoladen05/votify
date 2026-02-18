import { pgTable, text, primaryKey, timestamp } from 'drizzle-orm/pg-core';

export const spotifyTokens = pgTable(
	'spotifyTokens',
	{
		access_token: text('access_token').notNull(),
		refresh_token: text('refresh_token').notNull(),
		expires_at: timestamp('expires_at').notNull()
	},
	(table) => [primaryKey({ columns: [table.access_token, table.refresh_token] })]
);

//export * from './auth.schema';
