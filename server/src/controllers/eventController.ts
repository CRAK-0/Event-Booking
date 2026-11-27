import type { Request, Response } from "express";
import { getAllEvents as fetchAllEvents } from "../services/eventService.js";

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await fetchAllEvents();
    res.json(events);
  } catch (error) {
    res.json({ message: "An error occured" });
  }
};
