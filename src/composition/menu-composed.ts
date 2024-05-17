import {
  computed,
  contentChildren,
  Directive,
  ElementRef,
  inject,
  input,
  model, Signal
} from '@angular/core';
import {MenuInputs, MenuItemInputs, MenuState} from '../primities-signals-di/menu';
import {Orientation} from '../primitives-no-signals-no-di/behaviors';
import {
  IdFactory,
  ListboxInputs,
  ListboxState,
  OptionInputs,
  OptionState
} from '../primities-signals-di/listbox2';

@Directive({
  standalone: true,
  selector: '[uiMenuTrigger]',
  exportAs: 'menuTrigger',

})
export class UiMenuTrigger { }

@Directive({
  standalone: true,
  selector: '[uiMenu]',
  exportAs: 'menu',
  host: {
    'role': 'menu',
    '[tabIndex]': 'uiState.tabIndex()',
    '[attr.aria-orientation]': 'uiState.orientation()',
    '[attr.aria-activedescendant]': 'uiState.activeDescendantId() ?? null',
    '(keydown)': 'uiState.handleKey($event)',
  },
})
export class MenuComposed<T> implements MenuInputs {
  readonly orientation = input(Orientation.Vertical);
  readonly items = contentChildren<MenuItemInputs>(MenuItemComposed, {descendants: true});

  readonly uiState = new MenuState(this);
}

@Directive({
  selector: '[uiMenuItem]',
  standalone: true,
  host: {
    'role': 'menuitem',
    '[id]': 'uiState().id()',
    '[attr.aria-disabled]': 'uiState().disabled()',
    '[class.active]': 'uiState().active()',
  },
})
export class MenuItemComposed implements MenuItemInputs {
  readonly id = input<string>(inject(IdFactory)());
  readonly disabled = input(false);
  private readonly menu = inject(MenuComposed);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  displayText = () => this.elementRef.nativeElement.textContent ?? '';

  readonly uiState = this.menu.uiState.getItemById(this.id);
}
