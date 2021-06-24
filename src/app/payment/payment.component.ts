import { Component, OnDestroy, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Subscription } from 'rxjs';
import { TicketReservation } from '../app.model';
import { PaymentService } from './payment.service';

export interface UserPayment {
  paymentId: number;
  description: string;
  totalFare: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {

  ticketReservations: TicketReservation[] = [];
  unpaidPaymentsSub: Subscription;

  paymentCompleted: boolean = false;
  paymentCompletedSub: Subscription;

  displayedColumns: string[] = ['paymentId', 'description', 'totalFare'];

  isUserAdmin = false;

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    const authorities = sessionStorage.getItem('authorities');
    this.isUserAdmin = (authorities == 'ADMIN') ? true : false;
    this.fetchUnpaidPayments();
    this.paymentService.fetchTotalSales().subscribe(sales => {
      this.salesBarGraph(sales);
    });
  }

  fetchUnpaidPayments() {
    this.paymentService.fetchAllUnpaidTicketsOfUser();
    this.unpaidPaymentsSub = this.paymentService.unpaidTicketsOfUser$
      .subscribe(ticketReservations => {
        this.ticketReservations = ticketReservations;
      });
  }

  payUnpaidPayments() {
    this.paymentService.payAllUnpaidTickets();
    this.paymentCompletedSub = this.paymentService.paymentCompleted$.subscribe(paymentCompleted => {
      this.paymentCompleted = paymentCompleted;
      this.fetchUnpaidPayments();
      this.paymentService.fetchTotalSales().subscribe(sales => {
        this.salesBarGraph(sales);
      });
    });
  }

  salesBarGraph(totalSales: { busNumber: string, sales: number }[]) {
    let svg = d3.select("svg");
    svg.selectAll('*').remove();
    let margin = 200;
    let width = Number(svg.attr("width")) - margin;
    let height = Number(svg.attr("height")) - margin;

    const xScale = d3
      .scaleBand()
      .range([0, width])
      .domain(totalSales.map(totalSale => totalSale.busNumber))
      .padding(0.4);

    const g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
      .attr("font-size", "10px")
      .append("text")
      .attr("y", height - 250)
      .attr("text-anchor", "start")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .style("fill", "white")
      .text("Bus Number");

    const values = totalSales.map(totalSale => totalSale.sales);
    const yDomainMin = d3.min(values) * 0.9;
    const yDomainMax = d3.max(values) * 1.1;
    const yScale = d3.scaleLinear()
      .range([0, height])
      .domain([yDomainMax, yDomainMin])
      .nice();

    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat(d => "Rs. " + d);

    g.append("g")
      .call(yAxis)
      .attr("font-size", "10px")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 1)
      .attr("dy", "-8em")
      .attr("text-anchor", "end")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .style("fill", "white")
      .text("Total sales made by bus");;

    g.append('g')
      .selectAll('rect')
      .data(totalSales)
      .enter()
      .append('rect')
      .attr('x', totalSale => xScale(totalSale.busNumber))
      .attr('width', xScale.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .transition()
      .ease(d3.easeLinear)
      .duration(2000)
      .attr('height', totalSale => height - yScale(totalSale.sales))
      .attr('y', totalSale => yScale(totalSale.sales))
      .attr('height', totalSale => height - yScale(totalSale.sales))
      .attr('fill', '#e31b6d')

  }

  ngOnDestroy(): void {
    this.unpaidPaymentsSub.unsubscribe();
  }
}
