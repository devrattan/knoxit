ALTER TABLE "football_competitions" ADD COLUMN "competitive_entry_fee_chips" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "football_competitions" ADD COLUMN "competitive_max_members" integer DEFAULT 20 NOT NULL;--> statement-breakpoint
ALTER TABLE "football_competitions" ADD COLUMN "competitive_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "league_members" ADD COLUMN "join_request_key" text;--> statement-breakpoint
ALTER TABLE "leagues" ADD COLUMN "competition_key" text;--> statement-breakpoint
ALTER TABLE "leagues" ADD COLUMN "season_start_year" integer;--> statement-breakpoint
ALTER TABLE "leagues" ADD COLUMN "starting_round" integer;--> statement-breakpoint
ALTER TABLE "leagues" ADD COLUMN "instance_number" integer;--> statement-breakpoint
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_competition_key_football_competitions_key_fk" FOREIGN KEY ("competition_key") REFERENCES "public"."football_competitions"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "league_member_join_request_unique" ON "league_members" USING btree ("user_id","join_request_key") WHERE "league_members"."join_request_key" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "competitive_league_cohort_unique" ON "leagues" USING btree ("competition_key","season_start_year","starting_round","instance_number") WHERE "leagues"."type" = 'competitive';--> statement-breakpoint
CREATE INDEX "competitive_league_cohort_lookup_idx" ON "leagues" USING btree ("competition_key","season_start_year","starting_round","status");