ALTER TABLE "room" ADD COLUMN "state" text DEFAULT 'offline' NOT NULL;--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "room_spotifyTokens_spotifyTokens_id_fk" FOREIGN KEY ("spotifyTokens") REFERENCES "public"."spotifyTokens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "songQueueItem" ADD CONSTRAINT "songQueueItem_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;
