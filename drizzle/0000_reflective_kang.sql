CREATE TABLE "spotifyTokens" (
	"access_token" text,
	"refresh_token" text,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "spotifyTokens_access_token_refresh_token_pk" PRIMARY KEY("access_token","refresh_token")
);
