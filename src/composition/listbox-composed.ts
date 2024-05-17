import {
  computed,
  contentChildren,
  Directive,
  ElementRef,
  inject,
  input,
  model, Signal
} from '@angular/core';
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
export class ListboxComposed<T> implements ListboxInputs<T> {
  readonly id = input<string>(inject(IdFactory)());
  readonly value = model<T>();
  readonly disabled = input(false);
  readonly orientation = input(Orientation.Vertical);
  readonly options = contentChildren<OptionInputs<T>>(OptionComposed);
  readonly setValue = this.value.set;

  readonly uiState = new ListboxState(this);
}

@Directive({
  selector: 'ui-option',
  standalone: true,
  host: {
    'role': 'option',
    '[id]': 'uiState().id()',
    '[attr.aria-disabled]': 'uiState().disabled()',
    '[attr.aria-selected]': 'uiState().selected()',
    '[class.active]': 'uiState().active()',
  },
})
export class OptionComposed<T> implements OptionInputs<T> {
  readonly id = input<string>(inject(IdFactory)());
  readonly value = input.required<T>();
  readonly disabled = input(false);
  private readonly listbox = inject(ListboxComposed);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  displayText = () => this.elementRef.nativeElement.textContent ?? '';

  readonly uiState = this.listbox.uiState.getOptionById(this.id);
}
