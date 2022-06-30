<template>
  <q-card class="q-mb-md" flat bordered>
    <q-item>
      <q-item-section avatar class="col-auto">
        <BaseAvatar size="md" :src="props.data.user.avatar" />
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-bold">{{
          props.data.user.screenName
        }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator></q-separator>

    <q-img v-if="props.data.image" :src="props.data.image" />

    <q-card-actions>
      <q-btn flat round fab-mini icon="eva-heart-outline" />
      <q-btn flat round fab-mini icon="eva-message-circle-outline" />
    </q-card-actions>

    <q-card-section class="q-pt-none">
      <div v-if="props.data.likes.length > 0" class="text-bold q-mb-xs">
        <a class="cursor-pointer"> {{ props.data.likes.length }} 個讚</a>
      </div>

      <div class="overflow-wrap-break white-space-line q-mb-sm">
        {{ props.data.content }}
      </div>

      <div v-if="props.data.comments.length > 0" class="q-mb-sm">
        <a class="cursor-pointer text-body2 text-grey">
          查看全部 {{ props.data.comments.length }} 則留言</a
        >
      </div>

      <div class="text-caption text-grey">
        {{ fornatData(props.data.createdAt) }}
      </div>
    </q-card-section>

    <q-separator></q-separator>

    <q-card-actions class="lg-screen-only">
      <q-input
        bottom-slots
        borderless
        autogrow
        dense
        placeholder="留言..."
        input-class="q-pl-sm"
        class="col-12 q-pb-none"
      >
        <template v-slot:after>
          <q-btn disable flat color="primary" label="發佈" />
        </template>
      </q-input>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { date } from "quasar";
import BaseAvatar from "src/components/BaseAvatar.vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const fornatData = (timeStamp) =>
  date.formatDate(Number(timeStamp), "YYYY年M月D日");
</script>
