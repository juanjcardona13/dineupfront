<template>
	<!-- POS -->
	<div class="pos pos-vertical pos-with-header" id="pos">
		<!-- POS-CONTAINER -->
		<div class="pos-container">	
			<!-- POS-CONTENT -->
			<div class="pos-content">
				<perfect-scrollbar class="pos-content-container h-100 p-0">
          <template v-if="todayOrders && todayOrders.length > 0">
            <div class="pos-task" v-for="order in todayOrders">
              <div class="pos-task-info">
                <div class="h3 mb-1">Mesa {{ order.table.identifier }}</div>
                <div class="mb-3">Pedido No: #{{ order.number }}</div>
                <div class="mb-2">
                  <span class="badge fs-14px" v-bind:class="{ 'bg-theme text-theme-color': order.orderStatus != 'Completed', 'bg-gray-500 text-white': order.orderStatus == 'Completed'}">{{ order.orderType }}</span>
                </div>
                <div v-if="order.orderTime"><span v-bind:class="{ 'text-danger fw-bold': order.urgent }">{{ order.orderTime }}</span> time</div>
                <div v-if="order.totalOrderTime">
                  All dish served<br />{{ order.totalOrderTime }} total time
                </div>
              </div>
              <div class="pos-task-body">
                <div class="fs-16px mb-3">
                  Completed: ({{ getTotalCompletedItems(order.orderItems) }}/{{ order.orderItems.length }})
                </div>
                <div class="row gx-4">
                  <div class="col-lg-3 pb-4" v-for="orderItem in order.orderItems">
                    <div class="pos-task-product" v-bind:class="{ 'completed': orderItem.status == 'Completed' || orderItem.status == 'Cancelled' }">
                      <div class="pos-task-product-img">
                        <div class="cover" v-bind:style="{ backgroundImage: `url(${$envVar.apiBaseUrl}/${orderItem.menuItem.images[0].image})` }"></div>
                        
                        <div class="caption" v-if="orderItem.status == 'Completed'">
                          <div>Completed</div>
                        </div>
                        <div class="caption" v-if="orderItem.status == 'Cancelled'">
                          <div>Cancelled</div>
                        </div>
                      </div>
                      <div class="pos-task-product-info">
                        <div class="flex-1">
                          <div class="d-flex mb-2">
                            <div class="fs-5 mb-0 fw-semibold flex-1">{{ orderItem.menuItem.name }}</div>
                            <div class="fs-5 mb-0 fw-semibold">x{{ orderItem.amount }}</div>
                          </div>
                          <div class="text-body text-opacity-75">- {{ orderItem.variantOption.variant.name }}: {{ orderItem.variantOption.name }}</div>
                          <div class="text-body text-opacity-75" v-for="orderItemOption in orderItem.orderItemOptions"> - {{ orderItemOption.amount }} {{ orderItemOption.itemOption.name }}</div>
                        </div>
                      </div>
                      <div class="pos-task-product-action">
                        <a href="#" class="btn btn-theme bg-primary" 
                          v-on:click="(event) => setItemStatus(event, orderItem, 'Completed')"
                          v-bind:class="{ 'disabled': orderItem.status == 'Completed' || orderItem.status == 'Cancelled' }">
                          Complete
                        </a>
                        <a href="#" class="btn btn-default bg-white border" 
                          v-on:click="(event) => setItemStatus(event, orderItem, 'Cancelled')"
                          v-bind:class="{ 'disabled': orderItem.status == 'Completed' || orderItem.status == 'Cancelled' }">
                          Cancel
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
					
					<div class="px-3 py-5 text-center" v-else>
						No order found
					</div>
				</perfect-scrollbar>
			</div>
		</div>
	</div>
</template>


<script>
import { useAppOptionStore } from '@/stores/app-option';
import { useAppBusinessLogicStore } from "~/stores/app-business-logic";

// definePageMeta({ 
//   layout: "menu-layout",
// })

export default {
	mounted() {
    const { $auth, $pinia } = useNuxtApp()
    const appOption = useAppOptionStore($pinia);
		appOption.appSidebarHide = true;
		appOption.appHeaderHide = true;
		appOption.appContentClass = 'p-0';
		appOption.appContentFullHeight = true;
	},
	beforeUnmount() {
    const { $auth, $pinia } = useNuxtApp()
    const appOption = useAppOptionStore($pinia);
		appOption.appSidebarHide = false;
		appOption.appHeaderHide = false;
		appOption.appContentClass = '';
		appOption.appContentFullHeight = false;
	},
	methods: {
		checkTime(i) {
			if (i < 10) {i = "0" + i};
			return i;
		},
		getTime() {
			var today = new Date();
			var h = today.getHours();
			var m = today.getMinutes();
			var s = today.getSeconds();
			var a;
			m = this.checkTime(m);
			s = this.checkTime(s);
			a = (h > 11) ? 'pm' : 'am';
			h = (h > 12) ? h - 12 : h;
			
			setTimeout(this.getTime, 500);
			
			return h + ":" + m + a;
		},
		getTotalCompletedItems(items) {
			var count = 0;
			for (var i = 0; i < items.length; i++) {
				if (items[i].status == 'Completed') {
					count++;
				}
			}
			return count;
		},
		setItemStatus(event, item, status) {
			event.preventDefault();
			
			if (confirm('Confirm set this order to ' + status + '?') === true) {
				item.status = status;
			}
		}
	},
  apollo: {
    todayOrders: {
      query: searchOrders(`
        id
        number
        createdAt
        total
        table {
          id
          identifier
        }
        status {
          id
          name
        }
        diner {
          id
          phoneNumber
          user {
            firstName
            lastName
            username
          }
        }
        waiter {
          id
          dineUpUser {
            id
            user {
              firstName
              lastName
              username
            }
          }
        }
        orderItems {
          id
          menuItem {
            id
            name
            description
            price
            hasMultiplePrice
            images {
              id
              image
            }
          }
          amount
          dinerName
          observations
          price
          orderItemOptions {
            id
            amount
            itemOption {
              id
              name
              group {
                id
                name
              }
            }
          }
        }
      `),
      variables() {
        const businessLogicStore = useAppBusinessLogicStore()
        const globalRestaurant = businessLogicStore.getGlobalRestaurant
        const getRestaurantSearch = (branchId) => {
          return {
            fieldsAndFilters: [{ field: "table__branch__pk" }],
            searchValues: [branchId],
          };
        };
        const advancedSearch = [
          {
            fieldsAndFilters: [
              {
                field: "created_at",
                filter: "range"
              },
            ],
            searchValues: [getStartAndEndOfDay()]
          },
        ]
        if (globalRestaurant?.id) {
          advancedSearch.push(getRestaurantSearch(globalRestaurant.paginatedBranches.objects[0].id));
        }
        return {
          advancedSearch
        }
      },
      update(data) {
        return sortObjectsByDate(JSON.parse(JSON.stringify(data.searchOrders.objects)))
      }
    }
  }
}
</script>
