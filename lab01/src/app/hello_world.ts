import {Component} from 'angular2/core';


@Component({

  // Declare the tag name in index.html to where the component attaches
  selector: 'hello-world',

  template: `
  	<label>Name:</label>
	<!-- data-bind to the input element; store value in yourName -->
	<input type="text" [(ngModel)]="yourName" placeholder="Enter a name here">
	<hr>
	<!-- conditionally display yourName -->
	<h1 [hidden]="!yourName">Hello {{yourName}}!</h1>
`
})

export class HelloWorld {
  // Declaring the variable for binding with initial value
  yourName: string = '';
}
