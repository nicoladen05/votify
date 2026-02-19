CREATE TABLE "guest" (
	"cookie" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "songQueueItem" (
	"song_id" text PRIMARY KEY NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"downvotes" integer DEFAULT 0 NOT NULL,
	"song_uri" text NOT NULL,
	"img_url" text NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spotifyTokens" (
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "spotifyTokens_access_token_refresh_token_pk" PRIMARY KEY("access_token","refresh_token")
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"song_id" text NOT NULL,
	"guest_cookie" text NOT NULL,
	"is_upvote" boolean NOT NULL,
	CONSTRAINT "votes_song_id_guest_cookie_pk" PRIMARY KEY("song_id","guest_cookie")
);
--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_song_id_songQueueItem_song_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songQueueItem"("song_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_guest_cookie_guest_cookie_fk" FOREIGN KEY ("guest_cookie") REFERENCES "public"."guest"("cookie") ON DELETE cascade ON UPDATE no action;