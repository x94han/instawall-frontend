<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white text-grey-10">
      <q-toolbar class="constrain">
        <q-toolbar-title class="text-grand-hotel text-bold">
          Instawall
        </q-toolbar-title>
        <div class="lg-screen-only">
          <q-btn to="/" flat round icon="eva-home-outline" />
          <q-btn to="/login" flat round icon="eva-search-outline" />
          <q-btn to="/posts" flat round icon="eva-plus-square-outline" />
          <q-btn flat round>
            <q-avatar size="25px">
              <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
            </q-avatar>
          </q-btn>
          <q-btn flat round icon="eva-menu-outline">
            <q-menu transition-show="jump-down" transition-hide="jump-up">
              <q-list style="min-width: 130px">
                <q-item clickable>
                  <div class="flex items-center q-mr-md">
                    <q-icon size="20px" name="eva-person" />
                  </div>
                  <q-item-section>個人資料</q-item-section>
                </q-item>
                <q-item clickable>
                  <div class="flex items-center q-mr-md">
                    <q-icon size="20px" name="eva-people" />
                  </div>
                  <q-item-section>追蹤列表</q-item-section>
                </q-item>
                <q-item clickable>
                  <div class="flex items-center q-mr-md">
                    <q-icon size="20px" name="eva-heart" />
                  </div>
                  <q-item-section>按讚列表</q-item-section>
                </q-item>
                <q-separator></q-separator>
                <q-item clickable>
                  <q-item-section>登出</q-item-section>
                </q-item>
                <q-separator />
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-footer bordered class="bg-white sm-screen-only">
      <q-tabs
        active-color="primary"
        indicator-color="transparent"
        class="text-grey-10"
      >
        <q-route-tab to="/" icon="eva-home-outline" />
        <q-route-tab to="/login" icon="eva-search-outline" />
        <q-route-tab to="/posts" icon="eva-plus-square-outline" />
        <q-route-tab to="/">
          <q-avatar size="25px">
            <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
          </q-avatar>
        </q-route-tab>
      </q-tabs>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup></script>

<style lang="scss">
.q-toolbar__title {
  font-size: 30px;
}
</style>
