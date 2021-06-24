import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TicketReserved } from './ticket-reserved.model';
import { Ticket } from './ticket.model';
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
  reservedTickets: UserReservedTickets[] = [];

  showReservedTickets = false;
  toggleReservedTicketButton = 'Show Reserved Seats';

  displayedColumns: string[] = ['busNumber', 'numberOfTicketsReserved', 'reservationId'];
  dataSource: UserReservedTickets[] = [];

  ticketsSub: Subscription;
  reserveTicketsSub: Subscription;

  BUS_IMAGES = ["../../assets/bus-img.jpg", "../../assets/bus2.jpg", "../../assets/bus-img.jpg", "../../assets/bus2.jpg", "../../assets/bus-img.jpg"];

  constructor(
    private ticketService: TicketService, 
    private router: Router) { }

  ngOnInit(): void {
    this.fetchTickets();
    this.fetchReservedTicketsByUser();
  }

  reserveTicket(ticket: Ticket, numberOfReservedSeats: number) {
    if (numberOfReservedSeats > ticket.availableSeats || numberOfReservedSeats <= 0)  {
      alert("Please select a valid number of seats.");
    }  else {
      const ticketDescription = `Ticket for ${numberOfReservedSeats} people from ${ticket.source} to ${ticket.destination}`;
      const totalFare = ticket.farePerTicket * numberOfReservedSeats;
      const username = sessionStorage.getItem('username');
      const ticketReserve: TicketReserved = {
        numberOfTicketsReserved: numberOfReservedSeats,
        busNumber: ticket.busNumber,
        username: username,
        payment: {
          description: ticketDescription,
          paymentDone: false,
          totalFare: totalFare,
          username: username,
          busNumber: ticket.busNumber
        }
      }
      const reserveTickets$ = this.ticketService.reserveTickets(ticketReserve);
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
    this.reserveTicketsSub = this.ticketService.ticketsReservedByUser$.subscribe(reservedTickets => {
      this.reservedTickets = reservedTickets;
      this.dataSource = this.reservedTickets;
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
