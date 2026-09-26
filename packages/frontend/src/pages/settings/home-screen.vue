<template>
  <SettingsPage>
    <template #title>
      {{ t('homeScreen') }}
    </template>

    <template #content>
      <VCol
        md="6"
        class="uno-pb-4 uno-pt-0">
        <JDraggableList
          :items="homeSectionModels"
          :item-key="(homeSection: any) => homeSection.id"
          :options="{ handle: '.home-section-drag-handle' }"
          tag="div"
          @reorder="reorderHomeSections">
          <template #default="{ item, index }">
            <div class="uno-mt-6 uno-flex uno-items-center uno-gap-2">
              <JIcon
                class="home-section-drag-handle i-mdi:drag-horizontal uno-flex-none uno-cursor-grab"
                aria-hidden="true" />
              <span>{{ item.value }}</span>
            </div>
          </template>
        </JDraggableList>
      </VCol>
    </template>
  </SettingsPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { userSettings } from '#/store/settings/user.ts';

const { t } = useTranslation();

const screenSections = computed(() => [
  { text: t('myMedia'), value: 'smalllibrarytiles' },
  { text: t('myMediaSmall'), value: 'librarybuttons' },
  { text: t('recentlyAddedMedia'), value: 'latestmedia' }
]);

const dictionary: Record<string, string> = {
  smalllibrarytiles: t('myMedia'),
  librarybuttons: t('myMediaSmall'),
  latestmedia: t('recentlyAddedMedia'),
  nextup: t('nextUp'),
  resume: t('continueWatching'),
  livetv: t('liveTv'),
  resumeaudio: t('continueListening'),
  resumebook: t('continueReading'),
  none: t('none')
};

const homeSectionModels = ref(
  userSettings.homeSections.value.map((value, id) => ({ value: dictionary[value], id: value }))
);

/**
 * Persist the current home section selections and order.
 */
function updateHomeSections(): void {
  userSettings.homeSections.value = homeSectionModels.value.map(({ value }) => value);
}

/**
 * Move a home section to its newly selected position.
 */
function reorderHomeSections({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }): void {
  const [homeSection] = homeSectionModels.value.splice(oldIndex, 1);

  if (!homeSection) {
    return;
  }

  homeSectionModels.value.splice(newIndex, 0, homeSection);
  updateHomeSections();
}
</script>
