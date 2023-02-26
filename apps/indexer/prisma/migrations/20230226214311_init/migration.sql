-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "chain_id" TEXT NOT NULL,
    "collection_address" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" UUID NOT NULL,
    "chain_id" TEXT NOT NULL,
    "collection_address" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "meta" JSONB,
    "machine" JSONB,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_chain_id_collection_address_token_id_key" ON "tokens"("chain_id", "collection_address", "token_id");
