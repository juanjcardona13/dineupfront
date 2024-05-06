<template>
  <li :class="{ active: navigationItem.defaultActive, show: navigationItem.active, 'nav-sub-item': isSubItem, 'nav-item': !isSubItem }" >

    <router-link class="nav-sub-link" :class="{ active: navigationItem.active }" :to="navigationItem.path" v-if="navigationItem.type === 'link' && isSubItem"  @click="$emit('nav-active', navigationItem)" >
      {{ navigationItem.title }}
    </router-link>
    <a class="nav-sub-link" href="javascript:;" v-if="navigationItem.type === 'empty' && isSubItem" :class="{ show: navigationItem.active, active: navigationItem.active, }" >
      {{ navigationItem.title }}
    </a>
    <router-link class="nav-sub-link sub-with-sub" :class="{ active: navigationItem.active }" to="#" v-if="navigationItem.type === 'sub' && isSubItem" @click="$emit('nav-toggle', navigationItem)" >
      <span class="sidemenu-label">
        {{ navigationItem.title }}
      </span>
      <i class="angle fe fe-chevron-right"></i>
    </router-link>
    
    <router-link class="nav-link" v-if="navigationItem.type === 'link' && !isSubItem" :to="navigationItem.path" @click="$emit('nav-active', navigationItem)" >
      <span class="shape1"></span>
      <span class="shape2"></span>
      <i :class="navigationItem.icon + ' sidemenu-icon menu-icon'"></i>
      <span class="sidemenu-label">
        {{ navigationItem.title }}
      </span>
    </router-link>
    <a class="nav-link" to="#" v-if="navigationItem.type === 'empty' && !isSubItem" @click="$emit('nav-toggle', navigationItem)" >
      <span class="shape1"></span>
      <span class="shape2"></span>
      <i :class="navigationItem.icon + ' sidemenu-icon menu-icon'"></i>
      <span class="sidemenu-label">
        {{ navigationItem.title }}
      </span>
    </a>
    <router-link class="nav-link with-sub" to="#" :class="{ active: navigationItem.active }" v-if="navigationItem.type === 'sub' && !isSubItem" @click="$emit('nav-toggle', navigationItem)" >
      <span class="shape1"></span>
      <span class="shape2"></span>
      <i :class="navigationItem.icon + ' sidemenu-icon menu-icon'"></i>
      <span class="sidemenu-label">
        {{ navigationItem.title }}
      </span>
      <span v-if="navigationItem.badgeClass && navigationItem.badgeValue" :class="'badge ' + navigationItem.badgeClass + ' side-badge'">
        {{ navigationItem.badgeValue }}
      </span>
      <i class="angle fe fe-chevron-right" :class="{ 'd-none': navigationItem.badgeClass }" ></i>

    </router-link>

    <ul v-if="navigationItem.children" :class="{ open: navigationItem.active, active: navigationItem.active, 'nav-sub': !isSubItem, 'sub-nav-sub': isSubItem }" > <!--eSTE ACTIVE SOLO DEBERIA DE APLICAR CUANDO ES 2 LEVEL, DE RESTO NO MAS, ENTONCES MIRAR QUE HACE-->
      <NavigationItem
        v-for="childItem in navigationItem.children"
        :key="childItem.title"
        :navigation-item="childItem"
        :is-sub-item="true"
        @nav-active="$emit('nav-active', $event)"
        @nav-toggle="$emit('nav-toggle', $event)"
      ></NavigationItem>
    </ul>
  </li>
</template>

<script>
export default {
  props: {
    navigationItem: Object,
    isSubItem: {
      type: Boolean,
      default: false
    }
  },
};
</script>

