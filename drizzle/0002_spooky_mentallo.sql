CREATE TABLE "songQueueItem" (
	"song_id" text PRIMARY KEY NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"downvotes" integer DEFAULT 0 NOT NULL
);
