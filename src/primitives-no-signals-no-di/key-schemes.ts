import {
  AffectedByRtl,
  HasActiveDescendant,
  HasOrientation,
  HasSelectedDescendant,
  Orientation
} from './behaviors';

/**
 * Represents a set of keyboard controls that map to actions. One or more KeySchemes can
 * be applied to a control.
 *
 * @template T Control type for which this key scheme applies. This is typically a union of one or
 *     more behaviors.
 */
export interface KeyScheme<T> {
  /**
   * Handles a key press, returning whether the given key mapped to an action.
   * @param control The control instance for which some action may be taken.
   * @param keyEvent The keyboard event being handled.
   * @returns Whether the key event has handled by this scheme.
   */
  handleKey(control: T, keyEvent: KeyboardEvent): boolean;
}

/** A list-like control that has arrow-key navigation, such as listbox or menu. */
export type ListLike = HasActiveDescendant & AffectedByRtl & HasOrientation;

/** Key scheme for navigating through a list-like control, such as a listbox or menu. */
export class ListNavigationKeyScheme implements KeyScheme<ListLike> {

  /**
   * Handles the key for the given control.
   * @param control The control that should handle the key press.
   * @param event The native KeyboardEvent for the interaction.
   * @returns Whether the action was handled.
   */
  handleKey(control: ListLike, event: KeyboardEvent): boolean {
    switch (event.key) {
      case 'ArrowDown':
        if (control.orientation === Orientation.Vertical) {
          control.activateNextItem();
          return true;
        }
        break;

      case 'ArrowUp':
        if (control.orientation === Orientation.Vertical) {
          control.activatePreviousItem();
          return true;
        }
        break;


      case 'ArrowRight':
        if (control.orientation === Orientation.Horizontal && !control.isRtl) {
          control.activateNextItem();
          return true;
        } else if (control.isRtl) {
          control.activatePreviousItem();
          return true;
        }
        break;

      case 'ArrowLeft':
        if (control.orientation === Orientation.Horizontal && !control.isRtl) {
          control.activatePreviousItem();
          return true;
        } else if (control.isRtl) {
          control.activateNextItem();
          return true;
        }
        break;
    }

    // TODO: typeahead
    // TODO: home and end

    return false;
  }
}

/** Key scheme for selecting items with a list-like control, such as a listbox. */
export class ListSelectionKeyScheme implements KeyScheme<HasSelectedDescendant> {
  handleKey(control: HasSelectedDescendant, event: KeyboardEvent) {
    switch (event.key) {
      case ' ':
        control.toggleActiveItemSelection();
        return true;
    }

    return false;
  }
}
