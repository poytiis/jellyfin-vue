<template>
  <SettingsPage>
    <template #title>
      {{ t('homeScreen') }}
    </template>

    <template #content>
      <VCol
        md="6"
        class="uno-pb-4 uno-pt-0">
        <VSelect
          v-for="(homeSection, index) in homeSectionModels"
          :key="index"
          v-model="homeSection.value"
          variant="outlined"
          class="uno-mt-6"
          :label="`${t('homeScreen')} ${index + 1}`"
          item-title="text"
          item-value="value"
          :items="screenSections" />
      </VCol>
    </template>
  </SettingsPage>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import { userSettings } from '#/store/settings/user.ts';

const { t } = useTranslation();

const screenSections = computed(() => [
  { text: t('myMedia'), value: 'smalllibrarytiles' },
  { text: t('myMediaSmall'), value: 'librarybuttons' }
]);

const homeSectionModels = Array.from({ length: 10 }, (_, index) =>
  computed({
    get: () => userSettings.homeSections.value[index],
    set: (newVal: string) => {
      const homeSections = [...userSettings.homeSections.value];

      homeSections[index] = newVal;
      userSettings.homeSections.value = homeSections;
    }
  }));
</script>
