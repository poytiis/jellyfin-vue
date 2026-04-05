<template>
  <SettingsPage>
    <template #title>
      {{ t('account') }}
    </template>
    <template #content>
      <VCol md="6">
        <div class="uno-mb-8 uno-flex">
          <UserImage size="180" />
          <div class="uno-ml-10">
            <div class="uno-mb-6 uno-text-4xl">
              poytiis
            </div>
            <div class="uno-flex">
              <JFileUpload
                type="button"
                :button-text="t('editImage')" />
              <VBtn
                variant="flat"
                size="large"
                class="uno-ml-3"
                color="primary"
                @click="resetPassword">
                {{ t('deleteImage') }}
              </VBtn>
            </div>
          </div>
        </div>
        <div>
          <VTextField
            v-model="currentPassword"
            variant="outlined"
            autofocus
            :label="$t('currentPassword')"
            type="url" />
          <VTextField
            v-model="newPassword"
            variant="outlined"
            autofocus
            :label="$t('newPassword')"
            type="url" />
          <VTextField
            v-model="repeatNewPassword"
            variant="outlined"
            autofocus
            :label="$t('confirmPassword')"
            type="url" />
          <VBtn
            variant="flat"
            block
            size="large"
            color="primary"
            @click="resetPassword">
            {{ t('resetPassword') }}
          </VBtn>
        </div>
      </VCol>
    </template>
  </SettingsPage>
</template>

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import { shallowRef } from 'vue';

const { t } = useTranslation();
const currentPassword = shallowRef('');
const newPassword = shallowRef('');
const repeatNewPassword = shallowRef('');

/**
 * Reset user's password
 */
function resetPassword() {}

</script>
