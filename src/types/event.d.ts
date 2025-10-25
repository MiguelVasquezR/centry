import { eventSchema } from "../schemas/event";

interface EventType {
  id: string;
  title: string;
  description: string;
  type: string;
  date: Date;
  duration: string;
  location: string;
  responsible: string;
  notes?: string;
  link?: string;
  ability?: number;
  time?: string;
}

type EventFormValues = z.infer<typeof eventSchema>;

interface EventCardType {
  title: string;
  type: string;
  color: string;
}
