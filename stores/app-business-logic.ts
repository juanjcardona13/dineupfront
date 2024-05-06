import { defineStore } from "pinia";
import { APOLLO_CLIENTS } from '@/helpers/constants.js'
import gql from "graphql-tag";

export const useAppBusinessLogicStore = defineStore('appBusinessLogic', {
  state: () => {
    return {
      globalRestaurant: {}
		}
  },
  getters: {
    getGlobalRestaurant(state) {
      return state.globalRestaurant
    }
  },
  actions: {
    async setGlobalRestaurant(fields: String, extraArgs: [{}]) {
      var This = this
      const setInternalGlobalRestaurant = async (slug: String, internalFields: String) => {
        internalFields = internalFields || ` 
        id 
        paginatedMenus(where: $whereMenus) {
          objects { 
            id 
          }
        }
        paginatedBranches(where: $whereBranches) {
          objects { 
            id 
          }
        } 
        `
        const extraArgs = [
          {variableName: "whereBranches", variableType: "BranchFilterInput"}, 
          {variableName: "whereMenus", variableType: "MenuFilterInput"}, 
        ]
        const variables = {
          where: {slug: {exact: slug}}, 
          whereMenus: {isMain: { exact: true}},
          whereBranches: {isMain: { exact: true}}, 
        }
        const { data } = await executeQuery(readRestaurant(internalFields, extraArgs), variables, {fetchPolicy: "no-cache"})
        This.globalRestaurant = data.readRestaurant
      }
      const route = useRoute()
      let restaurantSlug: String = Array.isArray(route.params.restaurant_slug) ? route.params.restaurant_slug[0] : route.params.restaurant_slug || "all"
      const checkRouteInterval = setInterval(() => {
        if (restaurantSlug != "all") {
          clearInterval(checkRouteInterval)
          setInternalGlobalRestaurant(restaurantSlug, fields)
        } else {
          restaurantSlug = Array.isArray(route.params.restaurant_slug) ? route.params.restaurant_slug[0] : route.params.restaurant_slug || "all"
        }
      }, 1)
    }
  }
});
