<template>
  <div class="row">
    <div class="col-12">
      <div class="form-group">
        <input class="form-control" placeholder="E-mail" v-model="object.user.username" />
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return reactive({})
      },
      validator: (value) => {
        const defaultConfig = {
          user: {},
        }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        return true;
      }
    }
  },
  emits: ['update:modelValue'],
  computed: {
    object: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  created() {
    this.$apollo.queries.listGroups.refetch()
  },
  data() {
    return {
      groups: [],
    }
  },
  apollo: {
    listGroups: {
      query: listGroups(`
          id
          name
      `),
      result(response) {
        let { data } = response
        let { objects } = data.listGroups
        this.groups = objects
      }
    },
  }
}
</script>

<style></style>