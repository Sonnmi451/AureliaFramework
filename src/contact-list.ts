import { EventAggregator } from 'aurelia-event-aggregator';
import { inject, autoinject } from 'aurelia-framework';
import { HttpClient, json } from "aurelia-fetch-client";
import { ContactAdded } from './messages';
import { ContactEdited } from './messages';
import { ContactDeleted } from './messages';
import { Router } from 'aurelia-router';
import {observable} from 'aurelia-framework';


@autoinject
export class ContactList {
  contacts: any[];
  selectedId = "";
  paging: number[];
  //@observable count = 3;
  numOfPages: any[];
  numbers = [2, 4, 6, 8];
  @observable FirstName;
  @observable page = 1;
  @observable pageSize;
  @observable totalCount;
  @observable pageCount;

  constructor(private ea: EventAggregator, private httpClient: HttpClient,private router: Router) {
    this.httpClient = this.httpClient.configure(config => {
      config.useStandardConfiguration();
      //config.withBaseUrl("https://localhost:44316/api/");
    });

    ea.subscribe(ContactAdded, () => {
      this.refreshList();
    });

    ea.subscribe(ContactEdited, () => {
      this.refreshList();
    });
    ea.subscribe(ContactDeleted, () => {
      this.refreshList();
    });
  }
  private apiGet = 'https://localhost:44316/api/contact?page=' + this.page + '&pageSize=' + this.pageSize;

  async attached() {
    await this.refreshList();
  }

  async refreshList() {
    console.log("Fetching clients");
    let response = await this.httpClient.fetch('https://localhost:44316/api/contact?page=' + this.page + '&pageSize=' + this.pageSize);
    let contacts = await response.json();
    this.contacts = contacts.items;
    this.page = contacts.page;
    this.pageSize = contacts.pageSize;
    this.pageCount = contacts.pageCount;
    this.totalCount=contacts.totalCount;
  }

  Select(contactId) {
    this.selectedId = contactId;
    return true;
  }
  GoNext() {
    if (this.page < this.pageCount) {
      this.page += 1;;
      console.log(this.page);
      console.log(this.pageSize);
      this.refreshList();
    }
  }
  GoPrev() {
    if (this.page > 1) {
      this.page -= 1;
      this.refreshList();
    }
  }
  GoFirst() {
    this.page = 1;
    this.refreshList();
  }
  GoLast() {
    this.page = this.pageCount;
    this.refreshList();
  }
  Preview(changeValue) { // contacts to preview
    this.pageSize = changeValue;
    this.refreshList();
  }
  OpenPage(changeValue) { //which page to open
    this.page = changeValue;
    this.refreshList();
  }
  async SearchContact() {
    let response = await this.httpClient.fetch(`https://localhost:44316/api/contact/search?FirstName=${this.FirstName}`);
    let contact = await response.json();
    this.contacts = contact;
    
  }

  CheckForSearch() {
    if (this.FirstName != "")
      this.SearchContact();
     // this.refreshList();
    
  }

  GoBack(){
    this.router.navigate('');
  }

  contactPreview(){
    return(this.router.navigate(''));
  }

  FirstNameChanged(){
    this.CheckForSearch()
  }
  pageChanged(){
    this.refreshList();
  }
  pageCountChanged(){
    this.refreshList()
  }
  pageSizeChanged(){
    this.refreshList()
  }
  totalCountChanged(){
    this.refreshList()
  }
}
