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
import {KeyScheme, ListNavigationKeyScheme, ListSelectionKeyScheme,} from './key-schemes';

let nextId = 0;

export interface ListboxInputs<T> {
  value?: T;
  id?: string;
  disabled?: boolean;
  orientation?: Orientation;
}

export class ListboxState<T> implements CanBeDisabled, HasOrientation, AffectedByRtl, HasKeySchemes<ListLike>, HasActiveDescendant, HasSelectedDescendant {
  value: T | undefined;
  id: string;

  isRtl: boolean;

  orientation: Orientation;
  disabled: boolean;

  // using aria-activedescendant for demonstration purposes; a real impl would need to also
  // support roving tabindex
  activeDescendantId: string = '';

  // Any information we'd normally inject is instead passed as a constructor param.
  constructor(inputs: ListboxInputs<T>, isRtl: boolean = false, defaultId: string) {
    this.value = inputs.value;
    this.disabled = inputs.disabled ?? false;
    this.orientation = inputs.orientation ?? Orientation.Vertical;
    this.id = inputs.id ?? defaultId;
    this.isRtl = isRtl;
  }

  // This needs to be called when inputs change.
  setInputs(inputs: ListboxInputs<T>) {
    Object.assign(this, inputs);
  }

  private keySchemes = [
    new ListNavigationKeyScheme(),
    new ListSelectionKeyScheme(),
  ];

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
  value?: T;
  disabled?: boolean;
}

export class OptionState<T> {
  value: T | undefined;
  id: string;
  disabled: boolean;

  constructor(inputs: OptionInputs<T>, private listbox: ListboxState<T>, defaultId: string) {
    this.value = inputs.value;
    this.disabled = inputs.disabled ?? false;
    this.id = inputs.id ?? defaultId;
  }

  // This needs to be called when inputs change.
  setInputs(inputs: OptionInputs<T>) {
    Object.assign(this, inputs);
  }

  selected(): boolean {
    return this.value === this.listbox.value;
  }

  active(): boolean {
    return this.id === this.listbox.activeDescendantId;
  }
}
