CREATE TYPE "public"."booster_type" AS ENUM('draw_shield', 'team_recall', 'league_pulse');--> statement-breakpoint
CREATE TYPE "public"."chip_transaction_type" AS ENUM('signup_bonus', 'daily_reward', 'league_entry', 'split_payout', 'vault_payout', 'chip_purchase', 'shop_purchase', 'referral_bonus', 'admin_adjustment');--> statement-breakpoint
CREATE TYPE "public"."join_request_status" AS ENUM('pending', 'approved', 'declined');--> statement-breakpoint
CREATE TYPE "public"."league_status" AS ENUM('upcoming', 'active', 'completed', 'split');--> statement-breakpoint
CREATE TYPE "public"."league_type" AS ENUM('competitive', 'friends');--> statement-breakpoint
CREATE TYPE "public"."league_visibility" AS ENUM('public', 'invite_only');--> statement-breakpoint
CREATE TYPE "public"."member_status" AS ENUM('alive', 'knocked_out');--> statement-breakpoint
CREATE TYPE "public"."pick_result" AS ENUM('pending', 'survived', 'eliminated');--> statement-breakpoint
CREATE TYPE "public"."split_response" AS ENUM('pending', 'agreed', 'declined');--> statement-breakpoint
CREATE TYPE "public"."split_vote_status" AS ENUM('voting', 'passed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TABLE "active_boosters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"league_id" uuid NOT NULL,
	"gameweek" integer NOT NULL,
	"booster_type" "booster_type" NOT NULL,
	"team" text,
	"activated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"consumed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ad_reward_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"item_id" text NOT NULL,
	"views_completed" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_sessions" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chip_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"league_id" uuid,
	"type" "chip_transaction_type" NOT NULL,
	"amount" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "join_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid NOT NULL,
	"requester_id" uuid NOT NULL,
	"status" "join_request_status" DEFAULT 'pending' NOT NULL,
	"message" text,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "league_members" (
	"league_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "member_status" DEFAULT 'alive' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"knocked_out_at_gameweek" integer,
	"is_admin" boolean DEFAULT false NOT NULL,
	CONSTRAINT "league_members_league_id_user_id_pk" PRIMARY KEY("league_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "league_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leagues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"sport" text NOT NULL,
	"type" "league_type" DEFAULT 'competitive' NOT NULL,
	"visibility" "league_visibility" DEFAULT 'public' NOT NULL,
	"status" "league_status" DEFAULT 'upcoming' NOT NULL,
	"created_by" uuid,
	"entry_fee_chips" integer DEFAULT 0 NOT NULL,
	"vault_chips" integer DEFAULT 0 NOT NULL,
	"max_members" integer,
	"current_gameweek" integer DEFAULT 1 NOT NULL,
	"locks_at" timestamp with time zone,
	"entry_terms" text,
	"invite_code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "leagues_code_unique" UNIQUE("code"),
	CONSTRAINT "leagues_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"pick_lock_reminders" boolean DEFAULT true NOT NULL,
	"result_alerts" boolean DEFAULT true NOT NULL,
	"chat_messages" boolean DEFAULT true NOT NULL,
	"friends_league_requests" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "picks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"gameweek" integer NOT NULL,
	"primary_team" text NOT NULL,
	"backup_team" text,
	"result" "pick_result" DEFAULT 'pending' NOT NULL,
	"used_backup" boolean DEFAULT false NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "split_vote_responses" (
	"split_vote_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"response" "split_response" DEFAULT 'pending' NOT NULL,
	"responded_at" timestamp with time zone,
	CONSTRAINT "split_vote_responses_split_vote_id_user_id_pk" PRIMARY KEY("split_vote_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "split_votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid NOT NULL,
	"gameweek" integer NOT NULL,
	"proposed_by" uuid NOT NULL,
	"status" "split_vote_status" DEFAULT 'voting' NOT NULL,
	"vault_at_proposal" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"username" text NOT NULL,
	"chip_balance" integer DEFAULT 0 NOT NULL,
	"referral_code" text NOT NULL,
	"referred_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
ALTER TABLE "active_boosters" ADD CONSTRAINT "active_boosters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "active_boosters" ADD CONSTRAINT "active_boosters_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_reward_progress" ADD CONSTRAINT "ad_reward_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chip_ledger" ADD CONSTRAINT "chip_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chip_ledger" ADD CONSTRAINT "chip_ledger_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_members" ADD CONSTRAINT "league_members_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_members" ADD CONSTRAINT "league_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_messages" ADD CONSTRAINT "league_messages_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_messages" ADD CONSTRAINT "league_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "picks" ADD CONSTRAINT "picks_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "picks" ADD CONSTRAINT "picks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "split_vote_responses" ADD CONSTRAINT "split_vote_responses_split_vote_id_split_votes_id_fk" FOREIGN KEY ("split_vote_id") REFERENCES "public"."split_votes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "split_vote_responses" ADD CONSTRAINT "split_vote_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "split_votes" ADD CONSTRAINT "split_votes_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "split_votes" ADD CONSTRAINT "split_votes_proposed_by_users_id_fk" FOREIGN KEY ("proposed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;