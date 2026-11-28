import type { Request, Response } from "express";
import { getAllEvents as fetchAllEvents } from "../services/eventService.js";
import { getEventById as fetchIdEvent } from "../services/eventService.js";
import { createEventSchema, idSchema } from "../schemas/eventSchema.js";
import { createEvent as creatingEvent } from "../services/eventService.js";

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await fetchAllEvents();
    res.json(events);
  } catch (error) {
    res.json({ message: "An error occured" });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const Id = req.params.id;
  const result = idSchema.safeParse(Id);
  if (!result.success) return res.status(400).json({ message: "Bad Request" });
  try {
    const event = await fetchIdEvent(Number(result.data));
    if (!event) return res.status(404).json({ message: "Not found" });
    else {
      return res.status(200).json({
        message: "Success fetch id data",
        data: event,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch the data",
    });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const event = req.body;
    const parsed = createEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ issues: parsed.error.issues });
    }
    const result = await creatingEvent(parsed.data);
    return res.status(201).json({
      message: "Created the event",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to Create the Event",
    });
  }
};
