import {
	pgTable,
	text,
	primaryKey,
	timestamp,
	integer,
	boolean,
	foreignKey
} from 'drizzle-orm/pg-core';

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

export const guest = pgTable('guest', {
	cookie: text('cookie').primaryKey() // Cookie ist eindeutige ID
});

export const votes = pgTable(
	'votes',
	{
		song_id: text('song_id').notNull(),
		guest_cookie: text('guest_cookie').notNull(),
		is_upvote: boolean('is_upvote').notNull()
	},
	(table) => [
		primaryKey({ columns: [table.song_id, table.guest_cookie] }),

		foreignKey({
			columns: [table.song_id],
			foreignColumns: [songQueueItem.song_id]
		}).onDelete('cascade'),

		foreignKey({
			columns: [table.guest_cookie],
			foreignColumns: [guest.cookie]
		}).onDelete('cascade')
	]
);

export * from './auth.schema';
