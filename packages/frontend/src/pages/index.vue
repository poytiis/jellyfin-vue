<template>
  <div>
    <ItemsCarousel
      v-if="carousel.length"
      :items="carousel"
      page-backdrop>
      <template #referenceText>
        {{ $t('recentlyAdded') }}
      </template>
    </ItemsCarousel>
    <VContainer class="sections-after-header">
      <VRow
        v-for="(homeSection, index) in homeSections"
        :key="`homeSection-${index}`">
        <SwiperSection
          :title="homeSection.title"
          :items="getHomeSectionContent(homeSection)"
          :shape="homeSection.shape" />
      </VRow>
    </VContainer>
  </div>
</template>

<script lang="ts">
const excludeViewTypes = new Set([
  'playlists',
  'livetv',
  'boxsets',
  'channels'
]);
</script>

<script setup lang="ts">
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import { isNil } from '@jellyfin-vue/shared/validation';
import { CardShapes, fetchIndexPage, getShapeFromCollectionType } from '#/utils/items.ts';
import { usePageTitle } from '#/composables/page-title.ts';
import { userSettings } from '#/store/settings/user.ts';

definePage({
  meta: {
    layout: {
      transparent: true,
      transition: {}
    }
  }
});

interface HomeSection {
  id: string;
  title: string;
  libraryId: string;
  shape: CardShapes;
  type: 'libraries' | 'resumevideo' | 'nextup' | 'latestmedia';
}

const { t } = useTranslation();

usePageTitle(() => t('home'));

const { carousel, nextUp, views, resumeVideo, latestPerLibrary } = await fetchIndexPage();

const latestMediaSections = computed(() => {
  return views.value.map((userView) => {
    if (
      userView.CollectionType
      && !excludeViewTypes.has(userView.CollectionType)
    ) {
      return {
        id: `latestmedia:${userView.Id ?? ''}`,
        title: t('latestLibrary', { libraryName: userView.Name }),
        libraryId: userView.Id ?? '',
        shape: getShapeFromCollectionType(userView.CollectionType),
        type: 'latestmedia'
      };
    }
  }).filter((i): i is HomeSection => !isNil(i));
});

const defaultHomeSections = computed<HomeSection[]>(() => {
  return [
    /**
     * Library tiles
     */
    {
      id: 'smalllibrarytiles',
      title: t('libraries'),
      libraryId: '',
      shape: CardShapes.Thumb,
      type: 'libraries'
    },
    {
      id: 'librarybuttons',
      title: t('libraries'),
      libraryId: '',
      shape: CardShapes.Square,
      type: 'libraries'
    },
    /**
     * Resume video
     */
    {
      id: 'resumevideo',
      title: t('continueWatching'),
      libraryId: '',
      shape: CardShapes.Thumb,
      type: 'resumevideo'
    },
    /**
     * Next up
     */
    {
      id: 'nextup',
      title: t('nextUp'),
      libraryId: '',
      shape: CardShapes.Thumb,
      type: 'nextup'
    },
    /**
     * Latest media
     */
    ...latestMediaSections.value
  ];
});

/**
 * Resolves a stored home section id to one or more renderable sections.
 */
function getConfiguredHomeSections(id: string, sectionsById: Map<string, HomeSection>): HomeSection[] {
  if (id === 'latestmedia') {
    return latestMediaSections.value;
  }

  const section = sectionsById.get(id);

  return section ? [section] : [];
}

const homeSections = computed<HomeSection[]>(() => {
  const sectionsById = new Map(defaultHomeSections.value.map(section => [section.id, section]));
  const configuredSections = userSettings.homeSections.value.flatMap(id =>
    getConfiguredHomeSections(id, sectionsById)
  );

  return configuredSections.length ? configuredSections : defaultHomeSections.value;
});

/**
 * Gets the items for every home section
 */
function getHomeSectionContent(section: HomeSection): BaseItemDto[] {
  switch (section.type) {
    case 'libraries': {
      return views.value;
    }
    case 'resumevideo': {
      return resumeVideo.value;
    }
    case 'nextup': {
      return nextUp.value;
    }
    case 'latestmedia': {
      return latestPerLibrary.get(section.libraryId)?.value ?? [];
    }
    default: {
      return [];
    }
  }
};
</script>

<style scoped>
.sections-after-header {
  position: relative;
  z-index: 4;
}
</style>
