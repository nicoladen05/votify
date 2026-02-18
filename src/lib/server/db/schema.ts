import { pgTable, text, primaryKey, timestamp, integer } from 'drizzle-orm/pg-core';

export const spotifyTokens = pgTable(
	'spotifyTokens',
	{
		access_token: text('access_token').notNull(),
		refresh_token: text('refresh_token').notNull(),
		expires_at: timestamp('expires_at').notNull()
	},
	(table) => [primaryKey({ columns: [table.access_token, table.refresh_token] })]
);

export const songQueueItem = pgTable('songQueueItem', {
	song_id: text('song_id').notNull().primaryKey(),
	upvotes: integer('upvotes').default(0).notNull(),
	downvotes: integer('downvotes').default(0).notNull(),
	song_uri: text('song_uri').notNull(),
	img_url: text('img_url').notNull(),
	title: text('title').notNull(),
	artist: text('artist').notNull()
});

//export * from './auth.schema';
