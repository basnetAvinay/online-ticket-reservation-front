import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Payment } from "./payment.model";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  readonly unpaidTicketsOfUser$ = new BehaviorSubject<Payment[]>(null);

  readonly paymentCompleted$ = new BehaviorSubject<boolean>(false);

  fetchAllUnpaidTicketsOfUser(): void {
    this.http.get<Payment[]>(`${environment.apiBaseUrl}/payment/ticket-payment`).subscribe(unpaidPayment => this.unpaidTicketsOfUser$.next(unpaidPayment));
  }

  payAllUnpaidTickets(): void {
    this.http.get(`${environment.apiBaseUrl}/payment/complete-payment`).subscribe(() => this.paymentCompleted$.next(true) );
  }

  fetchTotalSales(): Observable<{ busNumber: string, totalSales: number }[]> {
    return this.http.get<{ busNumber: string, totalSales: number }[]>(`${environment.apiBaseUrl}/sales/total-sales`);
  }

}