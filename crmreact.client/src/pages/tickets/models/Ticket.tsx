export class Ticket {
    constructor(title: string, description: string) {
        this.title = title;
        this.description = description;
    }
    id?: string;
    title: string;
    contactId?: string;
    contact?: string;
    description: string;
    solution?: string;
    date?: Date;
}