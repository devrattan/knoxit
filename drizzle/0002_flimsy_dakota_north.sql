CREATE TABLE "football_competitions" (
	"key" text PRIMARY KEY NOT NULL,
	"provider_code" text NOT NULL,
	"name" text NOT NULL,
	"emblem" text,
	"season_start_year" integer,
	"current_matchday" integer,
	"last_synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "football_competitions_provider_code_unique" UNIQUE("provider_code")
);
--> statement-breakpoint
CREATE TABLE "football_fixtures" (
	"provider_id" integer PRIMARY KEY NOT NULL,
	"competition_key" text NOT NULL,
	"season_start_year" integer,
	"matchday" integer,
	"stage" text,
	"group_name" text,
	"utc_date" timestamp with time zone NOT NULL,
	"status" text NOT NULL,
	"venue" text,
	"home_team_id" integer,
	"home_team_name" text NOT NULL,
	"home_team_short_name" text,
	"home_team_crest" text,
	"away_team_id" integer,
	"away_team_name" text NOT NULL,
	"away_team_short_name" text,
	"away_team_crest" text,
	"winner" text,
	"home_score" integer,
	"away_score" integer,
	"provider_updated_at" timestamp with time zone,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "football_standings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_key" text NOT NULL,
	"season_start_year" integer NOT NULL,
	"stage" text NOT NULL,
	"type" text NOT NULL,
	"group_name" text,
	"position" integer NOT NULL,
	"team_id" integer NOT NULL,
	"team_name" text NOT NULL,
	"team_short_name" text,
	"team_crest" text,
	"played_games" integer NOT NULL,
	"form" text,
	"won" integer NOT NULL,
	"draw" integer NOT NULL,
	"lost" integer NOT NULL,
	"points" integer NOT NULL,
	"goals_for" integer NOT NULL,
	"goals_against" integer NOT NULL,
	"goal_difference" integer NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "football_fixtures" ADD CONSTRAINT "football_fixtures_competition_key_football_competitions_key_fk" FOREIGN KEY ("competition_key") REFERENCES "public"."football_competitions"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "football_standings" ADD CONSTRAINT "football_standings_competition_key_football_competitions_key_fk" FOREIGN KEY ("competition_key") REFERENCES "public"."football_competitions"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "football_fixtures_competition_date_idx" ON "football_fixtures" USING btree ("competition_key","utc_date");--> statement-breakpoint
CREATE INDEX "football_fixtures_competition_matchday_idx" ON "football_fixtures" USING btree ("competition_key","matchday");--> statement-breakpoint
CREATE INDEX "football_fixtures_status_idx" ON "football_fixtures" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "football_standings_unique_row" ON "football_standings" USING btree ("competition_key","season_start_year","stage","type","team_id");--> statement-breakpoint
CREATE INDEX "football_standings_competition_position_idx" ON "football_standings" USING btree ("competition_key","position");