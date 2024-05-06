<template>
  <li class="nav-item" :class="{ 'nav-header': navigationItem.headTitle }" >
    <span v-if="navigationItem.headTitle" class="nav-label">{{ navigationItem.headTitle }}</span>
  </li>
  <template v-for="childNavigationItem in navigationItem.children" :key="childNavigationItem.active">
    <NavigationItem
        :navigation-item="childNavigationItem"
        @nav-active="setNavActive"
        @nav-toggle="toggleNavActive"
      ></NavigationItem>
  </template>
</template>

<script>
import NavigationItem from "~/components/generics/NavigationItem.vue";

export default {
  props: {
    navigationItem: Object,
    isSubItem: {
      type: Boolean,
      default: false
    },
    setNavActive: {
      type: Function,
      required: true
    },
    toggleNavActive: {
      type: Function,
      required: true
    },
  },
  components: {
    NavigationItem
  }
};
</script>

