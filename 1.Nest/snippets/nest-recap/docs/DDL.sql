-- public.crawling_target_entity definition

-- Drop table

-- DROP TABLE public.crawling_target_entity;

CREATE TABLE public.crawling_target_entity (
	id serial4 NOT NULL,
	"createdAt" timestamptz NOT NULL DEFAULT now(),
	"updatedAt" timestamptz NOT NULL DEFAULT now(),
	"deletedAt" timestamptz NULL,
	"version" int4 NOT NULL,
	svc varchar(15) NULL,
	"dirId" varchar(63) NULL,
	"docId" varchar(255) NULL,
	url varchar(255) NULL,
	"isCrawled" bool NULL DEFAULT false,
	"isRewrited" bool NULL DEFAULT false,
	"contentHTML" text NULL,
	"rewritedMarkdown" text NULL,
	"rewritedHTML" text NULL,
	title text NULL,
	"isConsumed" bool NULL DEFAULT false,
	"isError" bool NULL DEFAULT false,
	"originalPrompot" text NULL,
	"rewritedTitle" text NULL,
	"consumedTo" varchar(15) NULL,
	CONSTRAINT "PK_1ef8bd2a9db31673b713c4a5ea7" PRIMARY KEY (id)
);
CREATE INDEX "IDX_0cfd08ad4a3460d7423a28c0e9" ON public.crawling_target_entity USING btree ("docId");
CREATE INDEX "IDX_db968a1753b3783e6a7645bc59" ON public.crawling_target_entity USING btree ("dirId");


-- public.gpt_log definition

-- Drop table

-- DROP TABLE public.gpt_log;

CREATE TABLE public.gpt_log (
	id serial4 NOT NULL,
	"createdAt" timestamptz NOT NULL DEFAULT now(),
	"targetId" int4 NOT NULL,
	tokens int4 NULL,
	latency numeric NULL,
	CONSTRAINT "PK_c22bda5d55e25094d73a5273406" PRIMARY KEY (id)
);