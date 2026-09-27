<template>
  <SettingsPage>
    <template #title>
      {{ t('homeScreen') }}
    </template>

    <template #content>
      <VCol
        md="6"
        class="uno-pb-4 uno-pt-0">
        <h2 class="uno-text-lg">
          {{ t('homeScreenSections') }}
        </h2>
        <JDraggableList
          :items="homeSectionModels"
          :item-key="(homeSection: any) => homeSection.id"
          :options="{ handle: '.home-section-drag-handle', filter: 'button' }"
          tag="div"
          @reorder="reorderHomeSections">
          <template #default="{ item, index }">
            <div class="home-section-drag-handle home-section-row uno-mt-2 uno-flex uno-cursor-grab uno-items-center uno-gap-2 uno-rounded uno-px-2 uno-py-1">
              <JIcon
                class="i-mdi:folder uno-flex-none"
                aria-hidden="true" />
              <JIcon
                :class="[item.icon, 'uno-flex-none']"
                aria-hidden="true" />
              <span class="uno-flex-1">{{ item.value }}</span>
              <VBtn
                icon
                size="small"
                variant="text"
                :disabled="index === 0"
                @click.stop="moveHomeSection(index, index - 1)">
                <JIcon class="i-mdi:chevron-up" />
              </VBtn>
              <VBtn
                icon
                size="small"
                variant="text"
                :disabled="index === homeSectionModels.length - 1"
                @click.stop="moveHomeSection(index, index + 1)">
                <JIcon class="i-mdi:chevron-down" />
              </VBtn>
              <VBtn
                icon
                size="small"
                variant="text"
                @click.stop="deleteHomeSection(index)">
                <JIcon class="i-mdi:delete-outline" />
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
            @click="addHomeSection">
            <JIcon class="i-mdi:plus-circle-outline" />
          </VBtn>
        </div>
        <h2 class="uno-mt-8 uno-text-lg">
          {{ t('libraries') }}
        </h2>
        <JDraggableList
          :items="libraryOrderModels"
          :item-key="(library: any) => library.id"
          :options="{ handle: '.library-drag-handle', filter: 'button' }"
          tag="div"
          @reorder="reorderLibraries">
          <template #default="{ item, index }">
            <div class="library-drag-handle home-section-row uno-mt-2 uno-flex uno-cursor-grab uno-items-center uno-gap-2 uno-rounded uno-px-2 uno-py-1">
              <JIcon
                :class="item.icon"
                aria-hidden="true" />
              <span class="uno-ml-2 uno-flex-1">{{ item.value }}</span>
              <VBtn
                icon
                size="small"
                variant="text"
                :disabled="index === 0"
                @click.stop="moveLibrary(index, index - 1)">
                <JIcon class="i-mdi:chevron-up" />
              </VBtn>
              <VBtn
                icon
                size="small"
                variant="text"
                :disabled="index === libraryOrderModels.length - 1"
                @click.stop="moveLibrary(index, index + 1)">
                <JIcon class="i-mdi:chevron-down" />
              </VBtn>
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
import { getUserViewsApi } from '@jellyfin/sdk/lib/utils/api/user-views-api';
import { userSettings } from '#/store/settings/user.ts';
import { useBaseItem } from '#/composables/apis.ts';
import { getLibraryIcon } from '#/utils/items.ts';
import { orderItemsById } from '#/utils/ordering.ts';

const { t } = useTranslation();
const { data: views } = await useBaseItem(getUserViewsApi, 'getUserViews')();

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
const libraryOrderModels = ref(
  orderItemsById(views.value, userSettings.libraryOrder.value)
    .flatMap(library => library.Id
      ? [{
          id: library.Id,
          icon: getLibraryIcon(library.CollectionType),
          value: library.Name ?? ''
        }]
      : [])
);

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

/**
 * Persist the current library order.
 */
function updateLibraryOrder(): void {
  userSettings.libraryOrder.value = libraryOrderModels.value.map(({ id }) => id);
}

/**
 * Move a library to its newly selected position.
 */
function reorderLibraries({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }): void {
  const [library] = libraryOrderModels.value.splice(oldIndex, 1);

  if (!library) {
    return;
  }

  libraryOrderModels.value.splice(newIndex, 0, library);
  updateLibraryOrder();
}

/**
 * Move a library using the list controls.
 */
function moveLibrary(oldIndex: number, newIndex: number): void {
  reorderLibraries({ oldIndex, newIndex });
}
</script>

<style scoped>
.home-section-row {
  min-height: 3rem;
  transition: background-color 150ms ease;
  user-select: none;
}

.home-section-row:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.08);
}
</style>
