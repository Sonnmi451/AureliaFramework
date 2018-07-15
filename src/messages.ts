
export class ContactUpdated {
  constructor(public contact) { }
}

export class ContactViewed {
  constructor(public contact) { }
}
export class ContactEdited {
  constructor() { } 
}
export class ContactDeleted {
  constructor() { }
}
export class ContactAdded {
  constructor(public contact) { }
}


