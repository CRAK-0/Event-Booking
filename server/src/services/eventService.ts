import { query } from "../db.js";

export const getAllEvents = async () => {
  const events = await query("SELECT * FROM events WHERE status = 'PUBLISHED'");
  return events;
};
export const getEventById = async (id: number) => {
  const event = await query(
    "SELECT * FROM events WHERE id = $1 AND status = 'PUBLISHED'",
    [id],
  );
  if (!event[0]) return null;

  const categories = await query(
    "SELECT * FROM ticket_categories WHERE event_id = $1",
    [id],
  );
  return { ...event[0], categories };
};
export const createEvent = async (data: any) => {
  const event = await query(
    "INSERT INTO events (title, description, category, venue_name, city, starts_at, timezone, poster_url) VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *",
    [
      data.title,
      data.description ?? null,
      data.category,
      data.venue_name,
      data.city,
      data.starts_at,
      data.timezone,
      data.poster_url ?? null,
    ],
  );
  return event[0];
};
