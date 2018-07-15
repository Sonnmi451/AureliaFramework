import {bindable, observable} from 'aurelia-framework';
export class Pagination{
  @bindable  page;
  @bindable @observable pageSize; 
  @bindable @observable totalCount;
  @bindable @observable pageCount: number;
  numOfPages: any[];
  numbers = [2, 4, 6, 8]
  //count = 3;

  GoNext() {
    if (this.page < this.pageCount) {
      this.page += 1;;
      console.log(this.page);
      console.log(this.pageSize);
     // this.refreshList();
    }
  }
  GoPrev() {
    if (this.page > 1) {
      this.page -= 1;
     // this.refreshList();
    }
  }
  GoFirst() {
    this.page = 1;
    //this.refreshList();
  }
  GoLast() {
    this.page = this.pageCount;
   // this.refreshList();
  }
  Preview(changeValue) { // contacts to preview
    this.pageSize = changeValue;
    //this.refreshList();
  }
  OpenPage(changeValue) { //which page to open
    this.page = changeValue;
    //this.refreshList();
  }

  
}
