CREATE TABLE "guest" (
	"cookie" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room" (
	"id" serial PRIMARY KEY NOT NULL,
	"spotifyTokens" integer,
	"name" text NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "songQueueItem" (
	"room_id" integer NOT NULL,
	"song_id" text NOT NULL,
	"song_uri" text NOT NULL,
	"img_url" text NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	CONSTRAINT "songQueueItem_room_id_song_id_pk" PRIMARY KEY("room_id","song_id")
);
--> statement-breakpoint
CREATE TABLE "spotifyTokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"room_id" integer NOT NULL,
	"song_id" text NOT NULL,
	"guest_cookie" text NOT NULL,
	"is_upvote" boolean NOT NULL,
	CONSTRAINT "votes_room_id_song_id_guest_cookie_pk" PRIMARY KEY("room_id","song_id","guest_cookie")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "room_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spotifyTokens" ADD CONSTRAINT "spotifyTokens_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_room_id_song_id_songQueueItem_room_id_song_id_fk" FOREIGN KEY ("room_id","song_id") REFERENCES "public"."songQueueItem"("room_id","song_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_guest_cookie_guest_cookie_fk" FOREIGN KEY ("guest_cookie") REFERENCES "public"."guest"("cookie") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");