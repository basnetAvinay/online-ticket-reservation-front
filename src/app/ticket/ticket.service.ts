import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Ticket, TicketReservation, TicketReservationCreate } from "../app.model";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  readonly tickets$ = new BehaviorSubject<Ticket[]>(null);
  readonly ticketsReservedByUser$ = new BehaviorSubject<TicketReservation[]>(null);

  constructor(private http: HttpClient) {}

  fetchAllTickets() {
    return this.http.get<Ticket[]>(`${environment.apiBaseUrl}/tickets`).subscribe(tickets => this.tickets$.next(tickets));
  }

  reserveTickets(ticketReservationCreate: TicketReservationCreate): Observable<TicketReservationCreate> {
    return this.http.post<TicketReservationCreate>(`${environment.apiBaseUrl}/ticket-reservation/save`, ticketReservationCreate);
  }

  fetchAllReservedTicketsByUsername() {
    this.http.get<TicketReservation[]>(`${environment.apiBaseUrl}/ticket-reservation/my`)
      .subscribe(ticketReservations => this.ticketsReservedByUser$.next(ticketReservations));
  }
}
