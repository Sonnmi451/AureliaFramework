import { autoinject } from 'aurelia-dependency-injection';
import { PLATFORM } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';


@autoinject
export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Contacts';
    config.map([
      { route: '', moduleId: PLATFORM.moduleName('no-selection'), title: 'Select' },
      { route: 'contacts/:id', moduleId: PLATFORM.moduleName('contact-detail'), name: 'contacts' },
      { route: 'contact-new', moduleId: PLATFORM.moduleName('contact-new'), name: 'contact-new' }
    ]);

    this.router = router;
  }
}
