<template>
  <JDraggableList
    :items="playbackManager.queue.value"
    :item-key="(item: any) => item.Id ?? item.Name ?? ''"
    @reorder="onReorder">
    <template #default="{ item, index }">
      <JHover v-slot="{ isHovering }">
        <VListItem
          :title="item.Name ?? ''"
          :subtitle="getArtists(item)"
          class="uno-cursor-grab"
          :class="{ 'text-primary font-weight-bold': isPlaying(index) }"
          @click="playbackManager.currentItemIndex.value = index" />
      </JHover>
    </template>
  </JDraggableList>
</template>

<script setup lang="ts">
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import { playbackManager } from '#/store/playback-manager.ts';

/**
 * Reorder the queue
 */
function onReorder(event: { item: BaseItemDto; newIndex: number }): void {
  if (event.item.Id) {
    playbackManager.changeItemPosition(event.item.Id, event.newIndex);
  }
}

/**
 * Checks if the item in the current position is playing
 */
function isPlaying(index: number): boolean {
  return index === playbackManager.currentItemIndex.value;
}

/**
 * Gets the artists of the item
 */
function getArtists(item: BaseItemDto): string | undefined {
  return item.Artists ? item.Artists.join(', ') : undefined;
}

</script>
