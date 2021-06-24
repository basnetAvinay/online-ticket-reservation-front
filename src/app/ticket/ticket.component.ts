import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Ticket, TicketReservation, TicketReservationCreate } from '../app.model';
import { TicketService } from './ticket.service';

export interface UserReservedTickets {
  reservationId: number,
  busNumber: string,
  numberOfTicketsReserved: number,
  paymentId: number
}

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit, OnDestroy {

  tickets: Ticket[] = [];
  ticketReservations: TicketReservation[] = [];

  showReservedTickets = false;
  toggleReservedTicketButton = 'Show Reserved Seats';

  displayedColumns: string[] = ['busNumber', 'numberOfTicketsReserved', 'reservationId'];

  ticketsSub: Subscription;
  reserveTicketsSub: Subscription;

  BUS_IMAGES = ["../../assets/bus-img.jpg", "../../assets/bus2.jpg", "../../assets/bus-img.jpg", "../../assets/bus2.jpg", "../../assets/bus-img.jpg"];

  constructor(private readonly ticketService: TicketService, private readonly router: Router) {
  }

  ngOnInit(): void {
    this.fetchTickets();
    this.fetchReservedTicketsByUser();
  }

  reserveTicket(ticket: Ticket, numberOfReservedSeats: number) {
    if (numberOfReservedSeats > ticket.availableSeats || numberOfReservedSeats <= 0)  {
      alert("Please select a valid number of seats.");
    }  else {
      const ticketReservationCreate: TicketReservationCreate = {
        noOfSeatReserved: numberOfReservedSeats,
        ticketId: ticket.ticketId
      };
      const reserveTickets$ = this.ticketService.reserveTickets(ticketReservationCreate);
      reserveTickets$.subscribe(() => {
        this.fetchTickets();
        this.fetchReservedTicketsByUser();
      });
    }
  }

  fetchTickets() {
    this.ticketService.fetchAllTickets();
    this.ticketsSub = this.ticketService.tickets$.subscribe(tickets => this.tickets = tickets);
  }

  fetchReservedTicketsByUser() {
    this.ticketService.fetchAllReservedTicketsByUsername();
    this.reserveTicketsSub = this.ticketService.ticketsReservedByUser$.subscribe(ticketReservations => {
      this.ticketReservations = ticketReservations;
    });
  }

  toggleReservedTicket() {
    this.showReservedTickets = !this.showReservedTickets;
    this.toggleReservedTicketButton = this.showReservedTickets ? 'Hide Reserved Seats': 'Show Reserved Seats';
  }

  proceedToPayment() {
    this.router.navigate(['/payment']);
  }

  ngOnDestroy(): void {
    this.reserveTicketsSub.unsubscribe();
    this.ticketsSub.unsubscribe();
  }
}
