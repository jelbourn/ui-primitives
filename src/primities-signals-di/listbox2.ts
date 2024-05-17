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

// TODO: consider not letting IDs be inputs at all and always generate them

// for demonstration purposes only
export const IS_RTL = new InjectionToken<boolean>('IS_RTL');
export const IdFactory = new InjectionToken<() => string>('IdFactory');

// This uses Angular APIs for demonstration purposes, but assume this is written
// in a world where there are framework-agnostic signal APIs and DI APIs.

export interface ListboxOptions {
  // TODO: strategy pattern for these
  wrapKeyNavigation: boolean;
  useActiveDescendant: boolean;
}

// TODO: typeahead

export interface ListboxInputs<T> {
  readonly id: () => string;
  readonly value: () => T | undefined,
  readonly setValue: (value: T) => void,
  readonly disabled: () => boolean;
  readonly orientation: () => Orientation;
  readonly options: () => readonly OptionInputs<T>[];
}

export class ListboxState<T> {
  id = this.inputs.id ?? inject(IdFactory)();
  value = this.inputs.value;
  disabled = this.inputs.disabled;
  orientation = this.inputs.orientation;
  activeDescendantId = signal<string>('');
  tabIndex = computed(() => this.disabled() ? -1 : 0);
  private optionInputs = this.inputs.options;

  options = computed(() => this.optionInputs().map(o => new OptionState(o, this)));

  isRtl = inject(IS_RTL);
  private keySchemes = [
    inject(ListNavigationKeyScheme),
    inject(ListSelectionKeyScheme),
  ];

  constructor(private inputs: ListboxInputs<T>) { }

  getOptionById(id: () => string): () => OptionState<T> {
    // todo: allow undefined to flow through
    return computed(() => this.options().find(o => o.id() === id())!);
  }

  getKeySchemes(): KeyScheme<this>[] {
    return (this.keySchemes as any);
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
    const currentIndex = options.findIndex(o => o.id() === this.activeDescendantId()) ?? 0;
    this.activateOption(options[(currentIndex + 1) % options.length]);
  }

  activatePreviousItem(): void {
    const options = this.options();
    const currentIndex = options.findIndex(o => o.id() === this.activeDescendantId()) ?? 0;
    this.activateOption(options[((currentIndex - 1) + options.length) % options.length]);
  }

  toggleActiveItemSelection(): void {
    const activeOption = this.options().find(o => o.id() === this.activeDescendantId());
    if (activeOption) {
      this.inputs.setValue(activeOption.value());
    }
  }

  private activateOption(option: OptionState<T> | undefined): void {
    this.activeDescendantId.set(option?.id() || '');
  }

}


export interface OptionInputs<T> {
  readonly id: () => string;
  readonly value: () => T;
  readonly disabled: () => boolean;

  // needed for typeahead
  readonly displayText: () => string;
}

export class OptionState<T> {
  readonly id = this.inputs.id ?? inject(IdFactory)();
  readonly value = this.inputs.value;
  readonly disabled: Signal<boolean> = computed(() => this.inputs.disabled() || this.listbox.disabled());
  readonly selected: Signal<boolean> = computed(() => this.value() === this.listbox.value());
  readonly active: Signal<boolean> = computed(() => this.id() === this.listbox.activeDescendantId());

  constructor(private inputs: OptionInputs<T>, private listbox: ListboxState<T>) {}
}
