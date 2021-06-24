export interface Ticket {
  busName: string;
  busNumber: string;
  farePerTicket: number;
  totalSeats: number;
  availableSeats: number;
  source: string;
  destination: string;
  facilities: string;
}