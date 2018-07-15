import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from "aurelia-framework";
import { HttpClient, json } from "aurelia-fetch-client";
import { ContactAdded } from 'messages';
import { Router } from 'aurelia-router';
import { ValidationRules, ValidationController } from 'aurelia-validation';

class Contact {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

@autoinject
export class ContactNew {
  contact: Contact = new Contact();
  canSave = true;
  constructor(private controller: ValidationController, private router: Router, private ea: EventAggregator, private httpClient: HttpClient) {
    this.httpClient.configure(config => {
      config.useStandardConfiguration();
      config.withBaseUrl("https://localhost:44316/api/");
    });
  }
  validation() {
    ValidationRules
      .ensure("firstName").minLength(3).required()
      .ensure("lastName").minLength(3).required()
      .ensure("email").email().required()
      .ensure("phoneNumber").matches(/\d{3}-\d{3}-\d{3}/).required()
      .on(this.contact)
  }
  ValidateMe() {
    this.validation();
    this.controller.validate().then(v => {
      if (v.valid) {
        this.addContact()
      }
    });
  }

  async addContact() {
    console.log("calling ADD function");
    console.log(this.contact);
    let response = await this.httpClient.fetch(`contact`, {
      method: 'post',
      body: json(this.contact)
    });
    this.ea.publish(new ContactAdded(this.contact));
    this.router.navigate('');
  }
}
