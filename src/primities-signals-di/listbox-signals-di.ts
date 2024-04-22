import {computed, inject, InjectionToken, Signal, signal, WritableSignal} from '@angular/core';
import {
  AffectedByRtl,
  CanBeDisabled,
  HasActiveDescendant,
  HasKeySchemes,
  HasOrientation,
  HasSelectedDescendant,
  ListLike,
  Orientation
} from './behaviors';
import {KeyScheme, ListNavigationKeyScheme, ListSelectionKeyScheme} from './key-schemes';

// for demonstration purposes only
export const IS_RTL = new InjectionToken<boolean>('IS_RTL');
export const IdFactory = new InjectionToken<() => string>('IdFactory');

// This uses Angular APIs for demonstration purposes, but assume this is written
// in a world where there are framework-agnostic signal APIs and DI APIs.

export interface ListboxInputs<T> {
  id?: string;
  value: WritableSignal<T>;
  disabled: Signal<boolean>;
  orientation: Signal<Orientation>;
  options: Signal<OptionState<T>[]>;
}

export class ListboxState<T> implements CanBeDisabled, HasOrientation, AffectedByRtl, HasKeySchemes<ListLike>, HasActiveDescendant, HasSelectedDescendant {
  id = this.inputs.id ?? inject(IdFactory)();
  value = this.inputs.value;
  disabled = this.inputs.disabled;
  orientation = this.inputs.orientation;
  activeDescendantId = signal<string>('');
  tabIndex = computed(() => this.disabled() ? -1 : 0);
  private options = this.inputs.options;

  isRtl = inject(IS_RTL);
  private keySchemes = [
    inject(ListNavigationKeyScheme),
    inject(ListSelectionKeyScheme),
  ];

  constructor(private inputs: ListboxInputs<T>) { }

  getKeySchemes(): KeyScheme<this>[] {
    return this.keySchemes;
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
    this.activateOption(this.options()[0]);
  }

  activateLastItem(): void {
    const options = this.options();
    this.activateOption(options[options.length - 1]);
  }

  activateNextItem(): void {
    const options = this.options();
    const currentIndex = options.findIndex(o => o.id === this.activeDescendantId()) ?? 0;
    this.activateOption(options[(currentIndex + 1) % options.length]);
  }

  activatePreviousItem(): void {
    const options = this.options();
    const currentIndex = options.findIndex(o => o.id === this.activeDescendantId()) ?? 0;
    this.activateOption(options[((currentIndex - 1) + options.length) % options.length]);
  }

  toggleActiveItemSelection(): void {
    const activeOption = this.options().find(o => o.id === this.activeDescendantId());
    if (activeOption) {
      this.value.set(activeOption.value());
    }
  }

  private activateOption(option: OptionState<T> | undefined): void {
    this.activeDescendantId.set(option?.id || '');
  }

}


export interface OptionInputs<T> {
  id?: string;
  value: Signal<T>;
  disabled: Signal<boolean>;
  listbox: ListboxState<T>,
}

export class OptionState<T> {
  id = this.inputs.id ?? inject(IdFactory)();
  value = this.inputs.value;
  disabled: Signal<boolean> = computed(() => this.inputs.disabled() || this.listbox.disabled());
  selected: Signal<boolean> = computed(() => this.value() === this.listbox.value());
  active: Signal<boolean> = computed(() => this.id === this.listbox.activeDescendantId());

  private listbox: ListboxState<T> = this.inputs.listbox;

  constructor(private inputs: OptionInputs<T>) {}
}
