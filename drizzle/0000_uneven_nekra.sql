CREATE TABLE "spotifyTokens" (
	"access_token" text,
	"refresh_token" text,
	"expires_in" double precision,
	CONSTRAINT "spotifyTokens_access_token_refresh_token_pk" PRIMARY KEY("access_token","refresh_token")
);
