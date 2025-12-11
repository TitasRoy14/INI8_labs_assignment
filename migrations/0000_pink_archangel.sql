CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" varchar(255) NOT NULL,
	"filepath" varchar(500) NOT NULL,
	"filesize" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
