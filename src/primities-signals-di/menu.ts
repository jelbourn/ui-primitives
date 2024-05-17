import {computed, inject, Signal, signal} from '@angular/core';
import {Orientation} from './behaviors';
import {ListNavigationKeyScheme, ListSelectionKeyScheme} from './key-schemes';
import {IdFactory, OptionState} from './listbox2';


export interface MenuTriggerInputs {
  open: () => boolean;
  setOpen: (value: boolean) => void;
}

export class MenuTriggerState {
  expanded = this.inputs.open;

  constructor(private inputs: MenuTriggerInputs) { }
}

export interface MenuInputs {
  orientation: () => Orientation;
  items: () => readonly MenuItemInputs[];
}

export class MenuState {
  orientation = this.inputs.orientation;
  tabIndex = computed(() => 0);
  activeDescendantId = signal<string>('');
  items = computed(() => this.inputs.items().map(i => new MenuItemState(i, this)));

  constructor(protected inputs: MenuInputs) {
  }

  private keySchemes = [
    inject(ListNavigationKeyScheme),
    inject(ListSelectionKeyScheme),
  ];

  handleKey(event: KeyboardEvent): boolean {
    for (const scheme of this.keySchemes) {
      const handled = scheme.handleKey(this as any, event);
      if (handled) return true;
    }

    return false;
  }

  getItemById(id: () => string): () => MenuItemState {
    // todo: allow undefined to flow through
    return computed(() => this.items().find(i => i.id() === id())!);
  }

  // The methods below would all be called based upon user interaction only (keyboard, pointer)
  activateFirstItem(): void {
    this.activeItem(this.items()[0]);
  }

  activateLastItem(): void {
    const items = this.items();
    this.activeItem(items[items.length - 1]);
  }

  activateNextItem(): void {
    const items = this.items();
    const currentIndex = items.findIndex(o => o.id() === this.activeDescendantId()) ?? 0;
    this.activeItem(items[(currentIndex + 1) % items.length]);
  }

  activatePreviousItem(): void {
    const items = this.items();
    const currentIndex = items.findIndex(o => o.id() === this.activeDescendantId()) ?? 0;
    this.activeItem(items[((currentIndex - 1) + items.length) % items.length]);
  }

  private activeItem(item: MenuItemState | undefined): void {
    this.activeDescendantId.set(item?.id() || '');
  }
}

export interface MenuItemInputs {
  id: () => string;
  disabled: () => boolean;
  displayText: () => string;
}

export class MenuItemState {
  id = this.inputs.id;
  disabled = this.inputs.disabled;
  displayText = this.inputs.displayText;
  readonly active = computed(() => this.id() === this.menu.activeDescendantId());

  constructor(public inputs: MenuItemInputs, protected menu: MenuState) {}
}

export interface MenuItemCheckboxInputs extends MenuItemInputs {
  checked: () => boolean;
  setChecked: (checked: boolean) => void;
}

export class MenuItemCheckboxState extends MenuItemState {
  // TODO: consider making a generic to avoid the constructor chaining
  constructor(public override inputs: MenuItemCheckboxInputs, protected override menu: MenuState) {
    super(inputs, menu);
  }
}

export interface MenuItemRadioInputs extends MenuItemInputs {
}

export class MenuItemRadioState extends MenuItemState {
}
