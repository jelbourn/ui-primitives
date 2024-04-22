import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ListboxComposed, OptionComposed} from '../composition/listbox-composed';
import {ListNavigationKeyScheme, ListSelectionKeyScheme} from '../primities-signals-di/key-schemes';
import {IdFactory, IS_RTL} from '../primities-signals-di/listbox-signals-di';

let nextId = 0;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ListboxComposed, OptionComposed],
  providers: [
    {provide: IdFactory, useValue: () => `id${nextId++}`},
    {provide: IS_RTL, useValue: false},
    ListNavigationKeyScheme,
    ListSelectionKeyScheme,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ui-primitives-no-signals-no-di';
}
