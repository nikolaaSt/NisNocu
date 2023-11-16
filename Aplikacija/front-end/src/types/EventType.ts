import AdminType from "./AdminType";

export default class EventType {
    eventId?: number;
    administratorId?: AdminType;
    description?: string;
    startsAtDate?: string;
    finishesAtDate?: string;
    startsAtTime?: string;
    finishesAtTime?: string;
    availability?: 'Available'| 'Not available';
    maxTables?: number;
    maxLounges?: number;
}