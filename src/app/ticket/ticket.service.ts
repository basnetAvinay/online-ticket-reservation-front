import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { TicketReserved } from "./ticket-reserved.model";
import { Ticket } from "./ticket.model";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  readonly tickets$ = new BehaviorSubject<Ticket[]>(null);
  readonly ticketsReservedByUser$ = new BehaviorSubject<
  {
    reservationId: number,
    busNumber: string,
    numberOfTicketsReserved: number,
    paymentId: number
  }[]>(null);

  constructor(private http: HttpClient) {}

  fetchAllTickets() {
    return this.http.get<Ticket[]>(`${environment.apiBaseUrl}/ticket/tickets`).subscribe(tickets => this.tickets$.next(tickets));
  }

  reserveTickets(ticketReserve: TicketReserved): Observable<TicketReserved> {
    return this.http.post<TicketReserved>(`${environment.apiBaseUrl}/ticketReserved/save`, ticketReserve);
  }

  fetchAllReservedTicketsByUsername() {
    this.http.get<{
      reservationId: number,
      busNumber: string,
      numberOfTicketsReserved: number,
      paymentId: number
    }[]>(`${environment.apiBaseUrl}/ticketReserved/findAllTicketsByUsername`)
      .subscribe(reservedTickets => this.ticketsReservedByUser$.next(reservedTickets));
  }
}