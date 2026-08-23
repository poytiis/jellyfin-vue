<template>
  <SettingsPage>
    <template #title>
      {{ t('homeScreen') }}
    </template>

    <template #content>
      <VCol
        md="6"
        class="uno-pb-4 uno-pt-0" />
      <VSelect
        v-model="userSettings.homeSections.value"
        variant="outlined"
        class="uno-mt-6"
        :label="$t('imageType')"
        item-title="text"
        :items="screenSections" />
    </template>
  </SettingsPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { getDisplayPreferencesApi } from '@jellyfin/sdk/lib/utils/api/display-preferences-api';
import { remote } from '#/plugins/remote/index.ts';
import { userSettings } from '#/store/settings/user.ts';

const screenSection = ref<string | undefined>(undefined);

const { t } = useTranslation();
const userId = remote.auth.currentUserId.value;

const screenSections = computed(() => [
  { text: t('myMedia'), value: 'smalllibrarytiles' },
  { text: t('myMediaSmall'), value: 'librarybuttons' }
]);

const { data: displayPreferences } = await remote.sdk
  .newUserApi(getDisplayPreferencesApi)
  .getDisplayPreferences({
    displayPreferencesId: 'userSettings',
    userId,
    client: 'vue'
  });

const homeSectionOrder = computed(() => {
  const customPrefs = displayPreferences.CustomPrefs ?? {};

  console.log(customPrefs);

  return Array.from({ length: 10 }, (_, index) => {
    return customPrefs[`homesection${index}`];
  }).filter(Boolean);
});

console.log(homeSectionOrder.value);
console.log(userSettings.homeSections.value);

</script>
