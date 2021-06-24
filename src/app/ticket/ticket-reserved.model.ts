import { Payment } from "../payment/payment.model";

export interface TicketReserved {
  numberOfTicketsReserved: number;
  busNumber: string;
  username: string;
  payment: Payment;
}