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
              <span class="uno-flex-1">{{ item.value }}</span>
              <VBtn
                icon
                size="small"
                variant="text"
                :disabled="index === 0"
                :aria-label="`${t('previous')}: ${item.value}`"
                @click.stop="moveHomeSection(index, index - 1)">
                <JIcon class="i-mdi:arrow-up" />
              </VBtn>
              <VBtn
                icon
                size="small"
                variant="text"
                :disabled="index === homeSectionModels.length - 1"
                :aria-label="`${t('next')}: ${item.value}`"
                @click.stop="moveHomeSection(index, index + 1)">
                <JIcon class="i-mdi:arrow-down" />
              </VBtn>
              <VBtn
                icon
                size="small"
                variant="text"
                :aria-label="`${t('delete')}: ${item.value}`"
                @click.stop="deleteHomeSection(index)">
                <JIcon class="i-mdi:delete" />
              </VBtn>
            </div>
          </template>
        </JDraggableList>
        <div class="uno-mt-6 uno-flex uno-items-center uno-gap-2">
          <VSelect
            v-model="newHomeSection"
            variant="outlined"
            hide-details
            :label="t('addHomeSection')"
            :items="availableHomeSections"
            item-title="value"
            item-value="id"
            :disabled="availableHomeSections.length === 0" />
          <VBtn
            icon
            :disabled="!newHomeSection"
            :aria-label="t('addHomeSection')"
            @click="addHomeSection">
            <JIcon class="i-mdi:plus" />
          </VBtn>
        </div>
      </VCol>
    </template>
  </SettingsPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { userSettings } from '#/store/settings/user.ts';

const { t } = useTranslation();

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

const addableHomeSectionIds = [
  'smalllibrarytiles',
  'librarybuttons',
  'resume',
  'nextup',
  'latestmedia'
] as const;

const homeSectionModels = ref(
  userSettings.homeSections.value
    .filter(value => value !== '' && value !== 'none')
    .map(value => ({ value: dictionary[value], id: value }))
);
const newHomeSection = ref<string>();
const availableHomeSections = computed(() => {
  const configuredIds = new Set(homeSectionModels.value.map(({ id }) => id));

  return addableHomeSectionIds
    .filter(id => !configuredIds.has(id))
    .map(id => ({ id, value: dictionary[id] }));
});

/**
 * Persist the current home section selections and order.
 */
function updateHomeSections(): void {
  userSettings.homeSections.value = homeSectionModels.value.map(({ id }) => id);
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

/**
 * Move a home section using the list controls.
 */
function moveHomeSection(oldIndex: number, newIndex: number): void {
  reorderHomeSections({ oldIndex, newIndex });
}

/**
 * Remove a section from the home screen.
 */
function deleteHomeSection(index: number): void {
  homeSectionModels.value.splice(index, 1);
  updateHomeSections();
}

/**
 * Append the selected section to the home screen.
 */
function addHomeSection(): void {
  const id = newHomeSection.value;

  if (!id || homeSectionModels.value.some(section => section.id === id)) {
    return;
  }

  homeSectionModels.value.push({ id, value: dictionary[id] });
  newHomeSection.value = undefined;
  updateHomeSections();
}
</script>
