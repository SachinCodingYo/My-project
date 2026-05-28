import cron from "node-cron";
import { InternationalPlan, Country } from "../esim.model";
import { getPackagesByCountry, getCountries } from "../zetexa/zetexa.endpoints";
import { adaptPackageList, adaptCountryList } from "../zetexa/zetexa.adapter";

// ─── Sync Countries ───────────────────────────────────────────────────────────
// Fetches all ~180 countries from Zetexa and upserts into DB
// Runs once a day — countries rarely change

export const syncCountries = async (): Promise<void> => {
  console.log("[SyncJob] Starting country sync...");

  try {
    const response = await getCountries();
    const adapted = adaptCountryList(response.data);

    // bulkWrite lets us upsert all 180 countries in ONE DB operation
    // instead of 180 separate queries
    const operations = adapted.map((country) => ({
      updateOne: {
        filter: { iso2: country.iso2 }, // find by iso2 code
        update: { $set: country }, // update all fields
        upsert: true, // insert if doesn't exist
      },
    }));

    await Country.bulkWrite(operations);
    console.log(`[SyncJob] Countries synced: ${adapted.length}`);
  } catch (error: any) {
    console.error("[SyncJob] Country sync failed:", error.message);
  }
};

// ─── Sync Plans for One Country ───────────────────────────────────────────────
// Fetches plans for a specific country and upserts into DB

export const syncPlansForCountry = async (
  countryCode: string,
): Promise<void> => {
  console.log(`[SyncJob] Syncing plans for ${countryCode}...`);

  try {
    const response = await getPackagesByCountry(countryCode);

    // no plans returned for this country
    if (!response.data || response.data.length === 0) {
      console.log(`[SyncJob] No plans found for ${countryCode}`);
      return;
    }

    const adapted = adaptPackageList(response); // already filters inactive

    // upsert each plan by zetexaPackageId
    const operations = adapted.map((plan) => ({
      updateOne: {
        filter: { zetexaPackageId: plan.zetexaPackageId },
        update: {
          $set: {
            ...plan,
            countryCode: countryCode.toUpperCase(),
            lastSyncedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    await InternationalPlan.bulkWrite(operations);

    // Mark plans that Zetexa no longer returns as inactive
    // "If it wasn't in this sync, deactivate it"
    const activeIds = adapted.map((p) => p.zetexaPackageId);
    await InternationalPlan.updateMany(
      {
        countryCode: countryCode.toUpperCase(),
        zetexaPackageId: { $nin: activeIds }, // $nin = "not in"
      },
      { $set: { isActive: false } },
    );

    console.log(`[SyncJob] ${countryCode}: ${adapted.length} plans synced`);
  } catch (error: any) {
    console.error(`[SyncJob] Failed to sync ${countryCode}:`, error.message);
  }
};

// ─── Sync All Known Countries ─────────────────────────────────────────────────
// Finds all countries already in our DB and refreshes their plans
// These are countries users have already searched — we keep them fresh

const syncAllKnownCountries = async (): Promise<void> => {
  console.log("[SyncJob] Starting full plan sync...");

  try {
    // find all unique country codes we already have plans for
    const knownCountries = await InternationalPlan.distinct("countryCode");

    if (knownCountries.length === 0) {
      console.log("[SyncJob] No countries in DB yet — skipping plan sync");
      return;
    }

    console.log(`[SyncJob] Syncing ${knownCountries.length} countries...`);

    // sync one by one with a small delay between each
    // to avoid hammering Zetexa API all at once
    for (const countryCode of knownCountries) {
      await syncPlansForCountry(countryCode);
      await delay(500); // 500ms pause between each country
    }

    console.log("[SyncJob] Full plan sync complete");
  } catch (error: any) {
    console.error("[SyncJob] Full sync failed:", error.message);
  }
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Register Cron Jobs ───────────────────────────────────────────────────────

export const registerEsimSyncJobs = (): void => {
  // Sync plans every 6 hours
  // "0 */6 * * *" = at minute 0, every 6th hour
  cron.schedule("0 */6 * * *", async () => {
    console.log("[SyncJob] Cron triggered: plan sync");
    await syncAllKnownCountries();
  });

  // Sync countries once a day at midnight
  // "0 0 * * *" = at 00:00 every day
  cron.schedule("0 0 * * *", async () => {
    console.log("[SyncJob] Cron triggered: country sync");
    await syncCountries();
  });

  console.log("[SyncJob] Cron jobs registered ✅");
};
