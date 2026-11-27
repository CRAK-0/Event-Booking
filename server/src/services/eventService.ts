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
