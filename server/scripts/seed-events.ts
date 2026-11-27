import { query } from "../src/db.js";
import events from "./data/events-sample.json" with { type: "json" };

// Deterministic pricing — same category = same base price across events
const PRICE_BY_CATEGORY: Record<string, number> = {
  General: 49900, // ₹499 in paise
  Premium: 99900, // ₹999
  VIP: 199900, // ₹1999
};

const QTY_BY_CATEGORY: Record<string, number> = {
  General: 60,
  Premium: 30,
  VIP: 10,
};

async function main() {
  try {
    await query("BEGIN"); // start transaction — all-or-nothing

    for (const ev of events) {
      // Combine localDate + localTime into one string, e.g. "2027-08-20T19:00:00"
      const startsAtLocal = `${ev.dates.start.localDate}T${ev.dates.start.localTime}`;
      const tz = ev.dates.start.timezone;

      // Insert the event, then get back the auto-generated id
      const inserted = await query<{ id: number }>(
        `INSERT INTO events
           (title, category, venue_name, city, starts_at, timezone, status, poster_url, source)
         VALUES
           ($1, $2, $3, $4, ($5::timestamp AT TIME ZONE $6), $6, 'PUBLISHED', $7, 'ticketmaster')
         RETURNING id`,
        [
          ev.name,
          ev.category,
          ev.venue.name,
          ev.venue.city,
          startsAtLocal,
          tz,
          ev.posterUrl,
        ],
      );

      const eventId = inserted[0].id;

      // Create 3 ticket categories per event
      for (const categoryName of ["General", "Premium", "VIP"] as const) {
        const price = PRICE_BY_CATEGORY[categoryName];
        const qty = QTY_BY_CATEGORY[categoryName];

        await query(
          `INSERT INTO ticket_categories
             (event_id, name, price_paise, total_quantity, available_quantity)
           VALUES ($1, $2, $3, $4, $4)`,
          [eventId, categoryName, price, qty],
        );
      }

      console.log(`✓ Event ${eventId}: ${ev.name} (3 categories)`);
    }

    await query("COMMIT"); // save all inserts
    console.log("✅ Seed complete");
    process.exit(0);
  } catch (err) {
    await query("ROLLBACK").catch(() => {}); // undo partial work
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

main();
