export interface User {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
}

export interface Bus {
  busId: number;
  busName: string;
  busNumber: string;
  facilities: string;
}

export interface Ticket {
  ticketId: number;
  farePerSeat: number;
  totalSeats: number;
  availableSeats: number;
  source: string;
  destination: string;
  bus: Bus;
}

export interface TicketReservation {
  ticketReservationId: number;
  noOfSeatReserved: number;
  isPaymentDone: boolean;
  ticket: Ticket;
  user: User;
}

export interface TicketReservationCreate {
  noOfSeatReserved: number;
  ticketId: number;
}
