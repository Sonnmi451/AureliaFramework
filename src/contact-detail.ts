import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ContactViewed, ContactAdded, ContactDeleted } from './messages';
import { areEqual } from './utility';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Router } from 'aurelia-router';
import { ValidationRules, ValidationController } from 'aurelia-validation'

class Contact {
  firstName: string;
  lastName: string;
  email: string;
}

@autoinject
export class ContactDetail {
  routeConfig;
  contact: Contact;
  originalContact: Contact;

  constructor(private controller: ValidationController, private ea: EventAggregator, private httpClient: HttpClient, private router: Router) {
    this.httpClient = this.httpClient.configure(config => {
      config.useStandardConfiguration();
      config.withBaseUrl("https://localhost:44316/api/");
    }); console.log("cont"+this.contact);
  }
  //GET CONTACT
  async activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    let response = await this.httpClient.fetch(`contact/${params.id}`);
    let contact = await response.json();
    this.contact = contact;
    this.routeConfig.navModel.setTitle(this.contact.firstName);
    this.originalContact = JSON.parse(json(this.contact));
    console.log("org"+this.originalContact.firstName);
    console.log("cont"+this.contact.firstName);
    this.ea.publish(new ContactViewed(this.contact));
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
        this.save()

      }
    })
  }

  get canSave() {
    return this.contact.firstName && this.contact.lastName;
  }

  async save() {
    console.log("calling save function");
    let response = await this.httpClient.fetch(`contact/${this.router.currentInstruction.params.id}`, {
      method: 'put',
      body: json(this.contact)
    });
    this.originalContact = JSON.parse(json(this.contact));
    this.router.navigate('');
    this.ea.publish(new ContactAdded(this.contact));
  }

  async delete() {
    console.log("calling delete function");
    let response = await this.httpClient.fetch(`contact/${this.router.currentInstruction.params.id}`, {
      method: 'delete'
    });
    this.router.navigate('');
    this.ea.publish(new ContactDeleted());

  }
  canDeactivate() {
    console.log("org"+this.originalContact.firstName);
    console.log("cont"+this.contact.firstName);
    if (!areEqual(this.originalContact, this.contact)) {
      let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

      if (!result) {
        this.ea.publish(new ContactViewed(this.contact));
      }
      this.controller.reset();
      return result;
    }
    return true;
  }


}
