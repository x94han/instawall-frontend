<template>
  <q-card class="q-mb-md" flat bordered>
    <q-item>
      <q-item-section avatar class="col-auto">
        <router-link
          :to="{
            name: 'PersonalPage',
            params: { userId: props.post.user._id },
          }"
        >
          <q-avatar size="md">
            <img :src="props.post.user.avatar ?? defaultAvatar" />
          </q-avatar>
        </router-link>
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <router-link
            :to="{
              name: 'PersonalPage',
              params: { userId: props.post.user._id },
            }"
            class="link-text text-bold"
          >
            {{ props.post.user.screenName }}
          </router-link>
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator></q-separator>

    <q-img v-if="props.post.image" :src="props.post.image" />

    <q-card-actions>
      <q-btn flat round fab-mini icon="eva-heart-outline" />
      <q-btn
        @click="toLeaveComment"
        flat
        round
        fab-mini
        icon="eva-message-circle-outline"
      />
    </q-card-actions>

    <q-card-section class="q-pt-none">
      <div v-if="props.post.likes.length > 0" class="text-bold q-mb-xs">
        <a class="cursor-pointer"> {{ props.post.likes.length }} 個讚</a>
      </div>

      <div class="overflow-wrap-break white-space-line q-mb-sm">
        {{ props.post.content }}
      </div>

      <div
        v-if="props.post.comments.length > 0"
        @click="toLeaveComment"
        class="q-mb-sm"
      >
        <a class="cursor-pointer text-body2 text-grey">
          查看全部 {{ props.post.comments.length }} 則留言</a
        >
      </div>
      <ul class="list-unstyled">
        <li
          v-for="comment in commentsByMe"
          :key="comment._id"
          class="flex justify-between q-mb-sm"
        >
          <p class="q-mb-none col self-center">
            <router-link
              :to="{
                name: 'PersonalPage',
                params: { userId: props.post.user._id },
              }"
              class="link-text text-bold q-mr-sm"
            >
              {{ comment.user.screenName }}
            </router-link>
            <span>{{ comment.content }}</span>
          </p>
          <div class="col-auto self-center">
            <q-btn
              @click="toDeleteComment(comment)"
              flat
              round
              size="xs"
              icon="eva-trash-2-outline"
            />
          </div>
        </li>
      </ul>

      <div class="text-caption text-grey">
        {{ formatData(props.post.createdAt) }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed, inject } from "vue";
import { date } from "quasar";
import { useAuthStore } from "src/stores/authStore";

const authStore = useAuthStore();

const defaultAvatar = inject("defaultAvatar");
const dialog = inject("dialog");
const alert = inject("alert");
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const commentsByMe = computed(() => {
  if (!props.post.comments) return [];

  return props.post.comments.filter(
    (comment) => comment.user._id === authStore.user._id
  );
});

const formatData = (timeStamp) =>
  date.formatDate(new Date(timeStamp), "YYYY年M月D日");

/**
 * Open CommentDialog
 */
const toLeaveComment = () => {
  dialog.post = props.post;
  dialog.handler = true;
};

/**
 * Open CommentDeleteAlert
 */
const toDeleteComment = (comment) => {
  alert.comment = comment;
  alert.handler = true;
};
</script>
