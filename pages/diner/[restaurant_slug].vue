<template>
  <!-- MENU -->
  <div v-if="mainRestaurant" class="pos pos-with-menu pos-with-sidebar" :class="{ 'pos-mobile-sidebar-toggled': mobileSidebarToggled }">
    <div class="pos-container">
      <!-- SIDEBAR LEFT -->
      <div class="pos-menu">
        <!-- LOGO Y NOMBRE -->
        <div class="logo">
          <RouterLink to="/">
            <!-- LOGO -->
            <div class="logo-img">              
              <img
                alt="logo"
                :src="`${$envVar.apiBaseUrl}/${mainRestaurant.logo}`"
              />
            </div>
            <!-- NOMBRE -->
            <div class="logo-text">{{ mainRestaurant.name }}</div>
          </RouterLink>
        </div>
        <!-- CATEGORÍAS -->
        <div class="nav-container">
          <perfect-scrollbar class="h-100">
            <ul class="nav nav-tabs" v-if="mainRestaurant.menu">
              <li class="nav-item" v-for="category in mainRestaurant.menu.categories">
                <a class="nav-link" :class="{ 'active': category.active }" href="#" @click="(event) => showCategory(event, category)">
                  <i :class="category.icon ? `fa fa-${category.icon} ${category.icon}` : 'fa fa-plate-wheat'"></i>
                  {{ category.name }}
                </a>
              </li>
            </ul>
          </perfect-scrollbar>
        </div>
      </div>
      <!-- MENU ITEMS -->
      <div class="pos-content">
        <div class="pos-content-container h-100">
          <div class="row gx-4" v-if="mainRestaurant.menu">
            <template v-for="itemMenu in mainRestaurant.menu.items">
              <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-sm-6 pb-4" v-if="!itemMenu.hide">
                <a href="#" class="pos-product" :class="{ 'not-available': itemMenu.notAvailable }" @click="(event) => showFoodModal(event, itemMenu.id)">
                  <!-- IMG -->
                  <div class="img" :style="{ backgroundImage: `url(${$envVar.apiBaseUrl}/${itemMenu.images[0]?.image})` }"></div>
                  <!-- INFO -->
                  <div class="info">
                    <div class="title">{{ itemMenu.name }}</div>
                    <div class="desc">{{ itemMenu.description }}</div>
                    <div class="price">${{ itemMenu.price }}</div>
                  </div>
                  <!-- NO DISPONIBLE -->
                  <div class="not-available-text" v-if="itemMenu.notAvailable">
                    <div>Not Available</div>
                  </div>
                </a>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- SIDEBAR RIGHT -->
      <div class="pos-sidebar" v-if="mainTable">
        <div class="h-100 d-flex flex-column p-0">
          <!-- HEADER -->
          <div class="pos-sidebar-header">
            <!-- BOTÓN ATRÁS -->
            <div class="back-btn">
              <button type="button" @click="toggleMobileSidebar()" class="btn">
                <font-awesome-icon :icon="['fa', 'chevron-left']" />
              </button>
            </div>
            <!-- ICON -->
            <div class="icon">
              <i class="fa fa-plate-wheat"></i>
            </div>
            <!-- MESA -->
            <div class="title">
              Table {{ mainTable.identifier }}
            </div>
            <!-- No PEDIDO -->
            <div class="order">
              Order: <b>{{ orderNo }}</b>
            </div>
          </div>
          <!-- TABS -->
          <div class="pos-sidebar-nav border-bottom">
            <ul class="nav nav-tabs nav-fill">
              <!-- NUEVO PEDIDO -->
              <li class="nav-item" @click="showFooterTotalOrder=true, showOrderTab=true, showOrderHistoryTab=false">
                <a class="nav-link active" href="#">
                  New Order ( {{ orderItems.length  }} )
                </a>
              </li>
              <!-- HISTORIAL PEDIDO -->
              <li class="nav-item" @click="showFooterTotalOrder=false, showOrderTab=false, showOrderHistoryTab=true">
                <a class="nav-link" href="#">
                  Order History ( 
                    <!-- {{ /** getOrderHistoryTotal() */  }}  -->
                    )
                </a>
              </li>
            </ul>
          </div>
          <!-- BODY -->
          <perfect-scrollbar ref="posSidebarBody" class="pos-sidebar-body tab-content">
            <!-- TAB NUEVO PEDIDO -->
            <div class="tab-pane fade h-100" :class="{'show active': showOrderTab }" id="newOrderTab">
              <!-- PEDIDO -->
              <template v-if="orderItems.length > 0">
                <div class="pos-order" v-for="orderItem in orderItems">
                  <!--DETALLE DEL ITEM DEL PEDIDO-->
                  <div class="pos-order-product">
                    <!-- IMG -->
                    <div class="img" :style="{ backgroundImage: `url(${$envVar.apiBaseUrl}/${orderItem.images[0]?.image})` }"></div>
                    <!-- INFO -->
                    <div class="flex-1">
                      <!-- NOMBRE -->
                      <div class="h6 mb-1">
                        {{ orderItem.name }}
                      </div>
                      <!-- PRECIO -->
                      <div class="small">
                        ${{ orderItem.price }}
                      </div>
                      <!-- VARIANTE -->
                      <div class="small mb-2" v-if="orderItem.selectedVariantOption">
                        <div>- {{ orderItem.variant.name }}: {{ orderItem.selectedVariantOption.name }}</div>
                      </div>
                      <!-- OPCIONES -->
                      <div class="small mb-2" v-if="orderItem.selectedOrderItemOptions.length > 0">
                        <template v-for="(group, i) in orderItem.selectedOrderItemOptions" :key="i">
                          <template v-if="group.length > 0">
                            <div v-for="optionAddition in group">- {{ optionAddition.group.name }}: {{ optionAddition.name }}</div>
                          </template>
                        </template>
                      </div>
                      <!-- [-] [CANTIDAD] [+] -->
                      <div class="d-flex">
                        <!-- DISMINUIR -->
                        <a href="#" class="btn btn-secondary btn-sm" @click="(event) => deductQty(event, orderItem.id)">
                          <i class="fa fa-minus"></i>
                        </a>
                        <!-- CANTIDAD -->
                        <input type="text" v-model="orderItem.amount" class="form-control w-50px form-control-sm mx-2 bg-white bg-opacity-25 text-center" />
                        <!-- AUMENTAR -->
                        <a href="#" class="btn btn-secondary btn-sm" @click="(event) => addQty(event, orderItem.id)">
                          <i class="fa fa-plus"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <!--TOTAL DEL ITEM DEL PEDIDO Y ELIMINAR ITEM-->
                  <div class="pos-order-price d-flex flex-column">
                    <!--TOTAL DEL ITEM DEL PEDIDO-->
                    <div>${{ (orderItem.price * orderItem.amount).toFixed(0) }}</div>
                    <!--ELIMINAR ITEM-->
                    <div class="text-end mt-auto">
                      <a href="#" @click="(event) => toggleConfirmation(event, orderItem.id, true)" class="btn btn-default btn-sm">
                        <i class="fa fa-trash"></i>
                        </a>
                      </div>
                  </div>
                  <!--REMOVER ITEM DEL PEDIDO-->
                  <div class="pos-order-confirmation text-center d-flex flex-column justify-content-center" v-if="orderItem.confirmation">
                    <!--ICON-->
                    <div class="mb-1">
                      <i class="fa fa-trash fs-36px lh-1"></i>
                    </div>
                    <!--PREGUNTA-->
                    <div class="mb-2">Remove this item?</div>
                    <!--BOTONES NO-YES-->
                    <div>
                      <!--BOTÓN NO-->
                      <a href="#" @click="(event) => toggleConfirmation(event, orderItem.id, false)" class="btn btn-default btn-sm ms-auto me-2 width-100px">
                        No
                      </a>
                      <!--BOTÓN YES-->
                      <a href="#" @click="(event) => removeOrder(event, orderItem.id)" class="btn btn-theme btn-sm width-100px">
                        Yes
                      </a>
                    </div>
                  </div>
                </div>
              </template>
              <!-- NO HAY PEDIDO -->
              <div v-else class="h-100 d-flex align-items-center justify-content-center text-center p-20">
                <div>
                  <div class="mb-3 mt-n5">
                    <i class="fa fa-utensils text-body text-opacity-25" style="font-size: 5em"></i>
                  </div>
                  <h5>No order found</h5>
                </div>
              </div>
            </div>
            <!-- TAB HISTORIAL PEDIDOS -->
            <div class="tab-pane fade h-100" :class="{'show active': showOrderHistoryTab }" id="orderHistoryTab">  
              <template v-if="todayOrders && todayOrders.length > 0">
                <div class="pos-order border-bottom" v-for="(todayOrder, index) in todayOrders" :key="index">
                  <!--DETALLE DEL PEDIDO-->
                  <div class="pos-order-product">
                    <div class="flex-1">
                      <!-- NOMBRE -->
                      <div class="h6 mb-1">
                        Pedido #{{ todayOrder.number }}

                        <span v-if="index==0" style="color: orange"> &nbsp;&nbsp;&nbsp; Ultimo!</span>
                      </div>
                      <!-- OBSERVACIONES -->
                      <div class="small mb-2">
                        <div style="color: #888;">OBSERVACIONES </div>
                      </div>
                      <!-- ESTADOS DEL PEDIDO -->
                      <div class="small mb-2">
                        CREADO - RECIBIDO - PREPARADO - ENTREGADO
                      </div>
                      <!-- VER ITEMS DEL PEDIDO -->
                      <div class="small mb-2">
                        <span style="color: blue; text-decoration: underline;" data-bs-toggle="collapse" :href="`#collapseOrderItems_${index}`" role="button" aria-expanded="false" :aria-controls="`#collapseOrderItems_${index}`">Ver detalle del pedido</span>
                      </div>
                      <!-- ITEMS DEL PEDIDO -->
                      <div class="collapse" :id="`collapseOrderItems_${index}`">
                        <template v-if="todayOrder.orderItems.length > 0">
                          <div class="pos-order border" v-for="orderItem in todayOrder.orderItems">
                            <!--DETALLE DEL ITEM DEL PEDIDO-->
                            <div class="pos-order-product">
                              <!-- IMG -->
                              <div class="img" :style="{ backgroundImage: `url(${$envVar.apiBaseUrl}/${orderItem.menuItem.images[0]?.image})` }"></div>
                              <!-- INFO -->
                              <div class="flex-1">
                                <!-- NOMBRE -->
                                <div class="h6 mb-1">
                                  {{ orderItem.menuItem.name }}
                                </div>
                                <!-- CANTIDAD -->
                                <div>
                                  Cantidad: {{ orderItem.amount }}
                                </div>
                                <!-- VARIANTE -->
                                <div class="small mb-2" v-if="orderItem.variantOption">
                                  <div>- {{ orderItem.variantOption.variant.name }}: {{ orderItem.variantOption.name }}</div>
                                </div>
                                <!-- OPCIONES -->
                                <div class="small mb-2" v-if="orderItem.orderItemOptions.length > 0">
                                    <div v-for="(orderItemOption, i) in orderItem.orderItemOptions" :key="i">- {{ orderItemOption.itemOption.group.name }}: {{ orderItemOption.itemOption.name }}</div>
                                </div>
                                <!--TOTAL DEL ITEM DEL PEDIDO-->
                                <div>${{ (orderItem.price * orderItem.amount).toFixed(0) }}</div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </template>            
                
              <div class="h-100 d-flex align-items-center justify-content-center text-center p-20" v-if="false">
                <div>
                  <div class="mb-3 mt-n5">
                    <i class="fa fa-shopping-bag text-body text-opacity-25" style="font-size: 5em"></i>
                  </div>
                  <h5>No se han realizado pedidos</h5>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
          <!-- FOOTER -->
          <div class="pos-sidebar-footer" v-if="showFooterTotalOrder">
            <!-- 
              SUBTOTAL
              <div class="d-flex align-items-center mb-2">
                <div>Subtotal</div>
                <div class="flex-1 text-end h6 mb-0">
                  $
                </div>
              </div>
              TAXES
              <div class="d-flex align-items-center">
                <div>Taxes (6%)</div>
                <div class="flex-1 text-end h6 mb-0">
                  $
                </div>
              </div>
              HR
              <hr /> 
            -->
            <!--TOTAL-->
            <div class="d-flex align-items-center mb-2">
              <div>Total</div>
              <div class="flex-1 text-end h4 mb-0">
                $ {{ getTotalPrice() }}
              </div>
            </div>
            <!--BOTONES-->
            <div class="mt-3">
              <div class="d-flex">
                <!--SERVICIO-->
                <a href="#" class="btn btn-default border w-70px me-10px d-flex align-items-center justify-content-center">
                  <span>
                    <i class="fa fa-bell fa-lg my-10px d-block"></i>
                    <span class="small fw-semibold">Service</span>
                  </span>
                </a>
                <!--BILL-->
                <a href="#" class="btn btn-default border w-70px me-10px d-flex align-items-center justify-content-center">
                  <span>
                    <i class="fa fa-receipt fa-fw fa-lg my-10px d-block"></i>
                    <span class="small fw-semibold">Bill</span>
                  </span>
                </a>
                <!--ENVIAR ORDEN-->
                <button @click="createOrderFromDiner()" class="btn btn-theme bg-primary flex-fill d-flex align-items-center justify-content-center">
                  <span>
                    <i class="fa fa-cash-register fa-lg my-10px d-block"></i>
                    <span class="small fw-semibold">Submit Order</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- BOTÓN FLOTANTE ABRIR PEDIDO -->
  <a href="#" class="pos-mobile-sidebar-toggler" @click="toggleMobileSidebar()">
    <i class="fa fa-cart-shopping"></i>
    <span class="badge">
      {{ orderItems.length }}
    </span>
  </a>
  <!-- MODAL ITEM -->
  <div class="modal modal-pos fade" ref="modalPosItem">
    <div class="modal-dialog modal-lg">
      <div class="modal-content border-0">
        <form @submit.prevent="addToCart">
          <card v-if="modalItemMenu">
            <card-body class="p-0">
              <!-- "X" DE CERRAR-->
              <a href="#" data-bs-dismiss="modal" class="btn-close position-absolute top-0 end-0 m-1"></a>
              <!--ITEM-->
              <div class="modal-pos-product">
                <!--IMG DEL ITEM-->
                <div class="modal-pos-product-img">
                  <div class="img" :style="{ backgroundImage: `url(${$envVar.apiBaseUrl}/${modalItemMenu.images[0]?.image})` }"></div>
                </div>
                <!--INFO DEL ITEM-->
                <div class="modal-pos-product-info d-flex flex-column">
                  <!--NOMBRE DEL ITEM-->
                  <div class="h4 mb-2">
                    {{ modalItemMenu.name }}
                  </div>
                  <!--DESCRIPCIÓN DEL ITEM-->
                  <div class="text-body text-opacity-50 mb-2">
                    {{ modalItemMenu.description }}
                  </div>
                  <!--PRECIO DEL ITEM-->
                  <div class="h4 mb-3">
                    ${{ modalItemMenu.hasMultiplePrice ? parseInt(newOrderItem.selectedVariantOption.price).toFixed(0) : parseInt(modalItemMenu.price).toFixed(0) }}
                  </div>
                  <!-- "- QTY +" DEL ITEM-->
                  <div class="d-flex mb-3">
                    <!--REDUCIR-->
                    <a href="#" class="btn btn-secondary" @click="(event) => deductModalQty(event)">
                      <i class="fa fa-minus"></i>
                    </a>
                    <!--INPUT DE CANTIDAD-->
                    <input type="number" class="form-control w-70px fw-bold mx-2 text-center" name="qty" v-model.number="newOrderItem.amount" />
                    <!--AUMENTAR-->
                    <a href="#" class="btn btn-secondary" @click="(event) => addModalQty(event)">
                      <i class="fa fa-plus"></i>
                    </a>
                  </div>
                  <!--HR-->
                  <hr class="opacity-1">
                  <!--VARIANTE-->
                  <template v-if="modalItemMenu.variant">
                    <div class="mb-2">
                      <div class="d-flex justify-content-between">
                        <div class="fw-bold">{{ modalItemMenu.variant.name }}</div>
                        <span class="badge text-bg-danger">Requerido</span>
                      </div>
                      <div class="option-list">
                        <div class="option" v-for="(variantOption, index) in modalItemMenu.variant.variantOptions">
                          <input type="radio" :id="`variantOption[${i}-${index}]`" :name="`variantOption[${i}-${index}]`" class="option-input" v-model="newOrderItem.selectedVariantOption" :value="variantOption" />
                          <label class="option-label" :for="`variantOption[${i}-${index}]`">
                            <span class="option-text">{{ variantOption.name }}</span>
                            <span class="option-price">+{{ parseInt(variantOption.price).toFixed(0) }}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </template>
                  
                  <!--OPCIONES/ADICIONALES-->
                  <template v-if="modalItemMenu.optionGroups">
                    <div class="mb-2" v-for="(optionAdditionGroup, n) in modalItemMenu.optionGroups" :key="n">
                      <div class="fw-bold">{{ optionAdditionGroup.name }}</div>
                      <div v-for="(optionAddition, index) in optionAdditionGroup.itemOptions">
                        <div class="d-flex justify-content-between">
                          <div>
                            <span>{{ optionAddition.name }}</span>
                            <span>+{{ parseInt(optionAddition.price).toFixed(0) }}</span>
                          </div>
                          <div>
                            <input 
                              :type="optionAdditionGroup.isMultiple ? 'radio' : 'checkbox'" 
                              :id="`addon[${n}-${index}]`" 
                              :name="`addon[${n}-${index}]`" 
                              :value="optionAddition" 
                              :true-value="optionAddition" 
                              :false-value="undefined"
                              v-model="newOrderItem.selectedOrderItemOptions[n]" />
                          </div>
                        </div>
                        <!-- 
                          
                          
                          <label class="option-label" :for="`addon[${n}-${index}]`">
                            <span class="option-text"></span>
                            <span class="option-price"></span>
                          </label> 
                        -->
                      </div>
                    </div>
                  </template>
                  
                  
                  <!--HR-->
                  <hr class="opacity-1">
                  <!--BOTONES-->
                  <div class="row">
                    <!--BOTÓN CANCELAR-->
                    <div class="col-4">
                      <a href="#" class="btn btn-default border fw-semibold mb-0 d-block py-3 w-100"
                        data-bs-dismiss="modal">Cancel</a>
                    </div>
                    <!--BOTÓN AGREGAR-->
                    <div class="col-8">
                      <button type="submit"
                        class="btn btn-theme bg-primary fw-semibold d-flex justify-content-center align-items-center py-3 m-0 w-100">
                        Add to cart
                        <i class="fa fa-plus ms-2 my-n3"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </card-body>
          </card>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import { useAppOptionStore } from '~/stores/app-option';
import { useAppBusinessLogicStore } from "~/stores/app-business-logic";
import { RouterLink } from 'vue-router';
import { Modal } from 'bootstrap';
import { APOLLO_CLIENTS } from '@/helpers/constants.js'
import gql from "graphql-tag";

definePageMeta({ layout: "menu-layout" })

export default {
  data() {
    return {
      orderItems: [],
      orderHistory: '',
      orderNo: '#0000',
      modal: '',
      modalItemMenu: '',
      newOrderItem: {
        amount: 1,
        selectedOrderItemOptions: [],
        selectedVariantOption: {},
      },
      mobileSidebarToggled: false,
      mainRestaurant: null,
      mainTable: null,
      showFooterTotalOrder: true,
      showOrderTab: true,
      showOrderHistoryTab: false,
    }
  },
  async created() {
    //buscar el restaurante
    const businessLogicStore = useAppBusinessLogicStore()
    businessLogicStore.setGlobalRestaurant(`
      id
      name
      slug
      logo
      slogan
      email
      phoneNumber
      website
      menu {
        id
        name
        categories {
          id
          name
          icon
          description
        }
        items {
          id
          name
          description
          price
          hasMultiplePrice
          category {id}
          images {
            id
            image
          }
          tags {
            id
            name
          }
          variant {
            id
            name
            variantOptions {
              id
              name
              price
              description
              isDefault
            }
          }
          optionGroups {
            id
            name
            nameType
            isRequired
            isMultiple
            minimum
            maximum
            itemOptions {
              id
              name
              description
              price
              isDefault
              group {
                id
                name
              }
            }
          }
        }
      }
    `)
    this.mainRestaurant = JSON.parse(JSON.stringify(businessLogicStore.getGlobalRestaurant))
    let intervalCheckRestaurant = setInterval(() => {
      if (!isEmpty(this.mainRestaurant)) {
        this.mainRestaurant.menu.items.forEach(elementItem => {
          if (elementItem.hasMultiplePrice) {
            elementItem.price = 0
            elementItem.variant.variantOptions.forEach(elementVariantOption => {
              if (elementVariantOption.isDefault) {
                elementItem.price = elementVariantOption.price
              }
            });
          }
        });
        this.mainRestaurant?.menu?.categories?.unshift({
          icon: "utensils",
          name: "ALL DISHES",
          id: "all",
          active: true
        })
        clearInterval(intervalCheckRestaurant)
      } else {
        this.mainRestaurant = JSON.parse(JSON.stringify(businessLogicStore.getGlobalRestaurant))
      }
    }, 1);

    // Decodificar t si viene, ahi vienen los datos de la mesa
    if (this.$route.query.t) {
      function parseQueryString(queryString) {
        const keyValuePairs = queryString.split('&');
        const output = {};
        keyValuePairs.forEach(pair => {
          const [key, value] = pair.split('=');
          output[key] = value;
        });
        return output;
      }
      const decodedText = Base64.decode(this.$route.query.t);
      const decodeData = parseQueryString(decodedText)
      const { table:idTable } = decodeData
      const { data } = await executeQuery(
        gql`
            query readLoginTable($id: ID! ) {
                readLoginTable(id: $id ) {
                    id
                    identifier
                }
            }
        `,
        { id: idTable },
        {fetchPolicy: "no-cache"}
      )
      this.mainTable = data.readLoginTable
    }
  },
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
    transformSelectedOrderItemOptions(input) {
        const output = [];

        // Recorrer cada elemento de la entrada
        input.forEach(element => {
            // Si el elemento es un objeto, agregarlo directamente al resultado
            if (typeof element === 'object' && !Array.isArray(element)) {
                output.push({
                    itemOption: element.id,
                    amount: 1
                });
            }
            // Si el elemento es un array, recorrer cada objeto dentro del array y agregarlos al resultado
            else if (Array.isArray(element)) {
                element.forEach(obj => {
                    output.push({
                        itemOption: obj.id,
                        amount: 1
                    });
                });
            }
        });

        return output;
    },
    async createOrderFromDiner() {
      let orderItems = []
      for (let orderItem of this.orderItems) {
        orderItems.push({
          amount: orderItem.amount,
          dinerName: "TODO",
          menuItem: orderItem.id,
          observations: "TODO",
          orderItemOptions: this.transformSelectedOrderItemOptions(orderItem.selectedOrderItemOptions),
          variantOption: orderItem.selectedVariantOption.id
        })
      }
      let objectData = {
        table: this.mainTable.id,
        diner: this.$userLoggedIn?.id,
        // waiter: this.$userLoggedIn?.id, //TODO
        orderItems
      }
      //TODO: Antes de hacer el pedido hay que loguearse
      let objectDataCopy = JSON.parse(JSON.stringify(objectData))
      objectDataCopy = removeEmptyNestedObjectsAndArrays(objectDataCopy)
      let r = await executeMutation(createOrders(), { input: [objectDataCopy] })
      this.$swal("Good job!", "You order is created!", "success");
      this.$apollo.queries.todayOrders.refetch()
      this.showFooterTotalOrder=false
      this.showOrderTab=false
      this.showOrderHistoryTab=true
      this.orderItems = []
    },



    toggleMobileSidebar: function () {
      this.mobileSidebarToggled = !this.mobileSidebarToggled;
    },
    getTotalPrice: function () {
      var value = 0;
      for (var i = 0; i < this.orderItems.length; i++) {
        value += parseFloat(this.orderItems[i].price) * parseInt(this.orderItems[i].amount);
      }
      return value.toFixed(0);
    },
    showCategory: function (event, category) {
      event.preventDefault();

      for (var i = 0; i < this.mainRestaurant.menu.categories.length; i++) {
        if (this.mainRestaurant.menu.categories[i].id == category.id) {
          this.mainRestaurant.menu.categories[i].active = true;
        } else {
          this.mainRestaurant.menu.categories[i].active = false;
        }
      }
      for (var i = 0; i < this.mainRestaurant.menu.items.length; i++) {
        if (category, this.mainRestaurant.menu.items[i].category.id || category.id == 'all') {
          this.mainRestaurant.menu.items[i].hide = false;
        } else {
          this.mainRestaurant.menu.items[i].hide = true;
        }
      }
    },
    showFoodModal: function (event, id) {
      event.preventDefault();
      this.newOrderItem = reactive({
        amount: 1,
        selectedOrderItemOptions: [],
        selectedVariantOption: {}
      })
      for (var i = 0; i < this.mainRestaurant.menu.items.length; i++) {
        if (this.mainRestaurant.menu.items[i].id == id) {
          this.modalItemMenu = this.mainRestaurant.menu.items[i];
          this.newOrderItem = {...this.newOrderItem, ...this.modalItemMenu}
        }
      }
      if (this.modalItemMenu.variant) {
        const variantOptionDefault = this.modalItemMenu.variant.variantOptions.find((opt) => opt.isDefault)
        if (variantOptionDefault) {
          this.newOrderItem.selectedVariantOption = variantOptionDefault
        }
      }
      if (this.modalItemMenu.optionGroups && this.modalItemMenu.optionGroups.length > 0) {
        for (let optionAddition in this.modalItemMenu.optionGroups) {
          this.newOrderItem.selectedOrderItemOptions.push([])
        }
      }
      this.modal = new Modal(this.$refs.modalPosItem);
      this.modal.show();
    },
    deductModalQty: function (event) {
      event.preventDefault();
      var newQty = parseInt(this.newOrderItem.amount) - 1;
      if (newQty < 1) {
        newQty = 1;
      }
      this.newOrderItem.amount = newQty;
    },
    addModalQty: function (event) {
      event.preventDefault();
      this.newOrderItem.amount = parseInt(this.newOrderItem.amount) + 1;
    },
    addToCart: function (event) {
      event.preventDefault();
      this.modal.hide();
      this.orderItems.push({"id": (this.orderItems.length + 1), ...this.newOrderItem});
      // {
      //   "id": (this.order.length + 1),
      //   "image": this.modalData.image,
      //   "title": this.modalData.title,
      //   "price": this.modalData.price,
      //   "amount": this.modalQuantity,
      //   "options": options
      // }

      setTimeout(() => {
        this.$refs.posSidebarBody.$el.scrollTop = 9999;
        this.$refs.posSidebarBody.ps.update();
      }, 500);
    },
    deductQty: function (event, id) {
      event.preventDefault();
      for (var i = 0; i < this.orderItems.length; i++) {
        if (this.orderItems[i].id == id) {
          var newQty = parseInt(this.orderItems[i].amount) - 1;
          if (newQty < 1) {
            newQty = 1;
          }
          this.orderItems[i].amount = newQty;
        }
      }
    },
    addQty: function (event, id) {
      event.preventDefault();
      for (var i = 0; i < this.orderItems.length; i++) {
        if (this.orderItems[i].id == id) {
          var newQty = parseInt(this.orderItems[i].amount) + 1;
          this.orderItems[i].amount = newQty;
        }
      }
    },
    toggleConfirmation: function (event, id, value) {
      event.preventDefault();
      for (var i = 0; i < this.orderItems.length; i++) {
        if (this.orderItems[i].id == id) {
          this.orderItems[i].confirmation = value;
        }
      }
    },
    removeOrder: function (event, id) {
      event.preventDefault();
      for (var i = 0; i < this.orderItems.length; i++) {
        if (this.orderItems[i].id == id) {
          this.orderItems.splice(i, 1);
        }
      }
    }
  },
  computed: {
    userLoggedIn() {
      return this.$getUserLoggedIn()
    }
  },
  apollo: {
    todayOrders: {
      query: searchOrders(`
        id
        number
        table {
          id
        }
        status {
          id
          name
        }
        waiter {
          id
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
        return {
          fieldsOfModel: {
            diner: this.userLoggedIn?.id,
          },
          advancedSearch: [
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
        }
      },
      update(data) {
        return sortObjectsByDate(JSON.parse(JSON.stringify(data.searchOrders.objects)))
      },
      skip() {
        return this.userLoggedIn?.id ? false : true
      }
    }
  }
}
</script>
