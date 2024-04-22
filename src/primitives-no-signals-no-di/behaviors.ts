import {KeyScheme} from './key-schemes';


export enum Orientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

/** A control that has a unique ID. */
export interface HasId {
  id: string;
}

/** A control whose interaction is affected by the locale text direction. */
export interface AffectedByRtl {
  isRtl: boolean;
}

/** A control that can be disabled. */
export interface CanBeDisabled {
  disabled: boolean;
}

/** A control that can be oriented either vertically or horizontally. */
export interface HasOrientation {
  orientation: Orientation;
}

/** A control that can be selected. */
export interface CanBeSelected {
  selected: boolean;
}

/** A control that has some keyboard interaction. */
export interface HasKeySchemes<C> {
  getKeySchemes(): KeyScheme<C>[];
  handleKey(event: KeyboardEvent): void;
}

export interface HasSelectedDescendant{
  toggleActiveItemSelection(): void;
}

/** A control that has an active descendant, such as a listbox or menu. */
export interface HasActiveDescendant {
  activeDescendantId: string;

  activateNextItem(): void;
  activatePreviousItem(): void;
  activateFirstItem(): void;
  activateLastItem(): void;
}

/** A list-like control that has arrow-key navigation, such as listbox or menu. */
export type ListLike = HasActiveDescendant & AffectedByRtl & HasOrientation;
