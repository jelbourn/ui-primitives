import {computed, inject, InjectionToken, Signal, signal} from '@angular/core';
import {Orientation} from './behaviors';
import {KeyScheme, ListNavigationKeyScheme, ListSelectionKeyScheme} from './key-schemes';

// for demonstration purposes only
const IS_RTL = new InjectionToken<boolean>('IS_RTL');
const IdFactory = new InjectionToken<() => string>('IdFactory');

// This uses Angular APIs for demonstration purposes, but assume this is written
// in a world where there are framework-agnostic signal APIs and DI APIs.

export interface ListboxInputs<T> {
  id?: string;
  value: Signal<T>;
  disabled: Signal<boolean>;
  orientation: Signal<Orientation>;
}

export class ListboxState<T> {
  id = this.inputs.id ?? inject(IdFactory)();
  value = this.inputs.value;
  disabled = this.inputs.disabled;
  orientation = this.inputs.orientation;
  tabIndex = computed(() => this.disabled() ? -1 : 0);

  activeDescendantId = signal<string>('');

  isRtl = inject(IS_RTL);
  private keySchemes = [
    inject(ListNavigationKeyScheme),
    inject(ListSelectionKeyScheme),
  ];

  constructor(private inputs: ListboxInputs<T>) { }

  getKeySchemes(): KeyScheme<this>[] {
    // glossing over type mismatches on the interface for now
    // return this.keySchemes;
    return [];
  }

  handleKey(event: KeyboardEvent): boolean {
    for (const scheme of this.getKeySchemes()) {
      const handled = scheme.handleKey(this, event);
      if (handled) return true;
    }

    return false;
  }

  // The methods below would all be called based upon user interaction only (keyboard, pointer)
  activateFirstItem(): void {
    // TODO: figure out how to know the ID of the appropriate item.
    //  Reading the DOM directly is an option
  }

  activateLastItem(): void {
    // TODO: figure out how to know the ID of the appropriate item.
    //  Reading the DOM directly is an option
  }

  activateNextItem(): void {
    // TODO: figure out how to know the ID of the appropriate item.
    //  Reading the DOM directly is an option
  }

  activatePreviousItem(): void {
    // TODO: figure out how to know the ID of the appropriate item.
    //  Reading the DOM directly is an option
  }

  toggleActiveItemSelection(): void {
    // TODO: figure out how to know the value of the appropriate item.
    //   Can't read from the DOM because it could be an object.
  }

}


export interface OptionInputs<T> {
  id?: string;
  value: Signal<T>;
  disabled: Signal<boolean>;
}

export class OptionState<T> {
  id = this.inputs.id ?? inject(IdFactory)();
  value = this.inputs.value;
  disabled = computed(() => this.inputs.disabled() || this.listbox.disabled());
  selected = computed(() => this.value() === this.listbox.value());
  active = computed(() => this.id === this.listbox.activeDescendantId());

  private listbox = inject(ListboxState);

  constructor(private inputs: OptionInputs<T>) {}
}
