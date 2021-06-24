import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { TicketReservation } from "../app.model";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  readonly unpaidTicketsOfUser$ = new BehaviorSubject<TicketReservation[]>(null);

  readonly paymentCompleted$ = new BehaviorSubject<boolean>(false);

  fetchAllUnpaidTicketsOfUser(): void {
    this.http.get<TicketReservation[]>(`${environment.apiBaseUrl}/ticket-reservation/my`)
      .subscribe(ticketReservations => this.unpaidTicketsOfUser$.next(ticketReservations));
  }

  payAllUnpaidTickets(): void {
    this.http.get(`${environment.apiBaseUrl}/ticket-reservation/payment`)
      .subscribe(() => this.paymentCompleted$.next(true));
  }

  fetchTotalSales(): Observable<{ busNumber: string, sales: number }[]> {
    return this.http.get<{ busNumber: string, sales: number }[]>(`${environment.apiBaseUrl}/ticket-reservation/sales`);
  }
}
