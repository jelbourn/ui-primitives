import {Directive, input} from '@angular/core';
import {Orientation} from '../primitives/behaviors';
import {ListboxState, OptionState} from '../primitives/listbox-signals-di';


@Directive({
  standalone: true,
  selector: 'listbox',
  host: {
    'role': 'listbox',
    '[tabIndex]': 'uiState.tabIndex()',
    '[attr.aria-disabled]': 'uiState.disabled()',
    '[attr.aria-activedescendant]': 'uiState.activeDescendantId() ?? null',
    '(keydown)': 'uiState.handleKey($event)',
  },
})
export class ListboxComposed<T> {
  readonly value = input<T>();
  readonly disabled = input(false);
  readonly orientation = input(Orientation.Vertical);

  protected uiState = new ListboxState({
    value: this.value,
    disabled: this.disabled,
    orientation: this.orientation,
  });
}

@Directive({
  standalone: true,
  host: {
    'role': 'option',
    '[attr.aria-disabled]': 'uiState.disabled()',
    '[attr.aria-selected]': 'uiState.selected()',
    '[class.active]': 'uiState.active()',
  },
})
export class OptionComposed<T> {
  readonly value = input<T>();
  protected readonly disabled = input(false);
  protected uiState = new OptionState({
    value: this.value,
    disabled: this.disabled,
  });
}
