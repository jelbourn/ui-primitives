import {computed, contentChildren, Directive, inject, input, model} from '@angular/core';
import {Orientation} from '../primitives-no-signals-no-di/behaviors';
import {ListboxState, OptionState} from '../primities-signals-di/listbox-signals-di';


@Directive({
  standalone: true,
  selector: 'ui-listbox',
  exportAs: 'listbox',
  host: {
    'role': 'listbox',
    '[tabIndex]': 'uiState.tabIndex()',
    '[attr.aria-disabled]': 'uiState.disabled()',
    '[attr.aria-activedescendant]': 'uiState.activeDescendantId() ?? null',
    '(keydown)': 'uiState.handleKey($event)',
  },
})
export class ListboxComposed<T> {
  readonly value = model<T>();
  readonly disabled = input(false);
  readonly orientation = input(Orientation.Vertical);
  readonly options = contentChildren(OptionComposed);

  readonly uiState = new ListboxState({
    value: this.value,
    disabled: this.disabled,
    orientation: this.orientation,
    options: computed(() => this.options().map(o => o.uiState)),
  });
}

@Directive({
  selector: 'ui-option',
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
  protected listbox = inject(ListboxComposed);

  readonly uiState: OptionState<T> = new OptionState({
    value: this.value,
    disabled: this.disabled,
    listbox: this.listbox.uiState,
  });
}
