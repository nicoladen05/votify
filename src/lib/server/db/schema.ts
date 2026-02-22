import {
	pgTable,
	text,
	primaryKey,
	timestamp,
	boolean,
	foreignKey,
	serial,
	integer
} from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const spotifyTokens = pgTable(
	'spotifyTokens',
	{
		id: serial('id').primaryKey().notNull(),
		userId: text('userId').notNull(),
		access_token: text('access_token').notNull(),
		refresh_token: text('refresh_token').notNull(),
		expires_at: timestamp('expires_at').notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id]
		}).onDelete('cascade')
	]
);

export const songQueueItem = pgTable(
	'songQueueItem',
	{
		room_id: integer('room_id').notNull(),
		song_id: text('song_id').notNull(),
		song_uri: text('song_uri').notNull(),
		img_url: text('img_url').notNull(),
		title: text('title').notNull(),
		artist: text('artist').notNull()
	},
	(table) => [primaryKey({ columns: [table.room_id, table.song_id] })]
);

export const guest = pgTable('guest', {
	cookie: text('cookie').primaryKey() // Cookie ist eindeutige ID
});

export const votes = pgTable(
	'votes',
	{
		room_id: integer('room_id').notNull(),
		song_id: text('song_id').notNull(),
		guest_cookie: text('guest_cookie').notNull(),
		is_upvote: boolean('is_upvote').notNull()
	},
	(table) => [
		primaryKey({ columns: [table.room_id, table.song_id, table.guest_cookie] }),

		foreignKey({
			columns: [table.room_id, table.song_id],
			foreignColumns: [songQueueItem.room_id, songQueueItem.song_id]
		}).onDelete('cascade'),

		foreignKey({
			columns: [table.guest_cookie],
			foreignColumns: [guest.cookie]
		}).onDelete('cascade')
	]
);

export const room = pgTable(
	'room',
	{
		id: serial('id').primaryKey().notNull(),
		spotifyTokens: integer('spotifyTokens'),
		name: text('name').notNull(),
		userId: text('userId').notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id]
		}).onDelete('cascade')
	]
);

export * from './auth.schema';
