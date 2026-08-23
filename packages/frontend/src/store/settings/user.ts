import { computed } from 'vue';
import { sealed } from '@jellyfin-vue/shared/validation';
import type { KeysOfUnion } from 'type-fest';
import { SyncedStore } from '#/store/super/synced-store.ts';

/**
 * == INTERFACES AND TYPES ==
 * Casted typings for the CustomPrefs property of DisplayPreferencesDto
 */

export interface UserSettingsState {
  homesection0: string;
  homesection1: string;
}

@sealed
class UserSettingsStore extends SyncedStore<UserSettingsState, KeysOfUnion<UserSettingsState>> {
  public readonly homeSections = computed({
    get: () => this._state.value.homesection0,
    set: (newVal: string) => {
      this._state.value.homesection0 = newVal;
    }
  });

  public constructor() {
    super({
      storeKey: 'userSettings',
      defaultState: () => ({
        homesection0: 'smalllibrarytiles',
        homesection1: 'librarybuttons'
      }),
      resetOnLogout: true,
      persistenceType: 'localStorage'
    });
  }
}

export const userSettings = new UserSettingsStore();
