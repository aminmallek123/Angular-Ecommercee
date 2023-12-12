import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EcommerceService } from '../ecommerce.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {
  @Input() productAdded: any;
  total = 0;
  addTotal(prix: number, qte: number) {
    this.total += prix * qte;
  }
  constructor(private ecommService: EcommerceService) { };
  @Output() onOrderFinished = new EventEmitter();
  paymentHandler: any = null;
  stripeAPIKey: any =
    'pk_test_51O7i36GFZy3TZDoAO7sdOP1UhQaDt0RgkY2H7TZXvlnZOOysuyZISIce7bJ4yYoybMZVc3BG9HwyxJN77BwWhplH00VDwIqPIo';
  @ViewChild('htmlData') htmlData!: ElementRef;
  openPDF() {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 100;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 20;
      PDF.addImage(FILEURI, 'PNG', 50, position, fileWidth, fileHeight);
      PDF.save('cart.pdf');
    });
  }
    ngOnInit() {
      this.invokeStripe();
    }
    checkoutProduct() {
      this.makePayment();
    }
    makePayment() {
      let amount = this.total
      const paymentHandler = (<any>window).StripeCheckout.configure({
        key: this.stripeAPIKey,
        locale: 'auto',
        token: (stripeToken: any) => {
          this.processPayment(amount, stripeToken);
        },
      });
      paymentHandler.open({
        name: 'ItSolutionStuff.com',
        description: '3 widgets',
        amount: amount * 100,
      });
    }

    invokeStripe() {
      if (!window.document.getElementById('stripe-script')) {
        const script = window.document.createElement('script');
        script.id = 'stripe-script';
        script.type = 'text/javascript';
        script.src = 'https://checkout.stripe.com/checkout.js';
        script.onload = () => {
          this.paymentHandler = (<any>window).StripeCheckout.configure({
            key: this.stripeAPIKey,
            locale: 'auto',
            token: function (stripeToken: any) {
              console.log(stripeToken);
              alert('Payment has been successfull!');
              //signaler au composant ecommerce que la commande est réalisée
              this.onOrderFinished(false);
            },
          });
        };
        window.document.body.appendChild(script);
      }
    }
    processPayment(amount: any, stripeToken: any) {
      console.log(stripeToken);
      const data = {
        amount: amount * 100,
        token: stripeToken
      }
      this.ecommService.sendPayment(data)
        .subscribe({
          next: (res: any) => {
            console.log(res)
            alert("Operation sucessfully done")
            //signaler au composant ecommerce que la commande est finie
            this.openPDF();
            this.onOrderFinished.emit(false);
            //Rénitialiser total à 0
            this.total = 0;
          },
          error: (e) => {
            console.log(e);
            alert("Error : Operation not done")
          },
        });
    }

  }
