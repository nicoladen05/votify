import { pgTable, text, primaryKey, doublePrecision } from 'drizzle-orm/pg-core';

export const spotifyTokens = pgTable(
	'spotifyTokens',
	{
		access_token: text('access_token'),
		refresh_token: text('refresh_token'),
		expires_in: doublePrecision('expires_in')
	},
	(table) => [primaryKey({ columns: [table.access_token, table.refresh_token] })]
);

//export * from './auth.schema';
