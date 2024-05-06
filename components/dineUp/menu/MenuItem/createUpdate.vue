<template>
  <div class="row" :key="keyCreateUpdateMenuItem">
    <!-- Datos principales -->
    <div class="col-12">
      <div class="p-3 bd rounded-3 mg-b-30" style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
        <!-- Titulo -->
        <h5 class="text-primary mg-b-20">
          Detalle del producto
        </h5>
        <!-- Campos -->
        <div class="row">
          <!-- seleccionar menu -->
          <div class="col-12" v-if="false">
            <div class="form-group">
              <v-select :options="menus" label="name" :reduce="menu => menu.id" v-model="object.menu"
                placeholder="Seleccione menu"></v-select>
            </div>
          </div>
          <!-- input nombre -->
          <div class="form-group col-6">
            <input class="form-control" placeholder="Nombre" v-model="object.name" />
          </div>
          <!-- select categorias -->
          <div class="form-group col-6">
            <v-select 
              :options="categories"
              label="name" 
              :reduce="category => category.id" 
              v-model="object.category"
              placeholder="Selecciona la categoría">
            </v-select>
          </div>
          <!-- descripcion -->
          <div class="form-group">
            <textarea class="form-control" placeholder="Descripción del item" rows="3"
              v-model="object.description"></textarea>
            <!-- <input class="form-control" placeholder="Descripción del item" v-model="object.description" /> -->
          </div>
          <!-- precio -->
          <div class="input-group col-12 mb-1" v-if="!object.hasMultiplePrice">
            <span class="input-group-text border-end-0">$</span>
            <input aria-label="Amount (to the nearest dollar)" class="form-control" type="text" placeholder="Precio" v-model="object.price" />
          </div>
          <!-- check multiples precios -->
          <div class="form-group col-12 mb-3">
            <input type="checkbox" v-model="object.hasMultiplePrice" />
            <span class="ms-2" style="color: #888; font-size: 12px;">Tiene multiples precios</span>
          </div>
          <!-- variantes -->
          <div class="form-group mg-t5" v-if="object.hasMultiplePrice">
            <hr>
            <div class="mg-b-20">
              <h5 class="text-primary mg-t-20 mg-b-5">
                Variante
              </h5>
              <p>
                La variante es una posibilidad que el comprador tiene al solicitar un artículo,
                por ejemplo distintos tamaños, sabores, etc.
                En caso de que la alternativa implique un cargo extra, este será agregado al precio del producto.
              </p>
            </div>
            <DineUpMenuItemVariant v-model="object.variant" />
            
            <div class="row">
              <div class="col-11">
                <DineUpMenuVariantOption v-for="(variantOption, i) in object.variant.variantOptions" :key="i" v-model="object.variant.variantOptions[i]" />
              </div>
              <div class="col-1 mb-3">
                <!-- boton eliminar variante -->
                <button v-for="(i) in object.variant.variantOptions.length-1" :key="i" class="btn ripple btn-outline-danger btn-icon btn-rounded mb-3" data-bs-placement="right"
                  data-bs-toggle="tooltip-danger" title="Quitar opción de variante" @click="object.variant.variantOptions.splice(i, 1)">
                  <i class="fa fa-minus"></i>
                </button>
                <!-- boton agregar variante -->
                <button class="btn ripple btn-outline-primary btn-icon btn-rounded" 
                  @click="object.variant.variantOptions.push({})"  
                  data-bs-placement="right"
                  data-bs-toggle="tooltip-primary" title="Agregar variantes">
                  <i class="fa-regular fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <!-- imágenes -->
    <div class="col-12" >
      <div class="row">
        <!-- Check for img -->
        <div class="col-12">
          <div class="form-group">
            <input type="checkbox" v-model="showImages" />
            <span class="ms-3">Agregar fotos</span>
          </div>
        </div>
        <div class="col-12" v-show="showImages">
          <div class="p-3 bd rounded-3 mg-b-30">
            <div>
              <h5 class="text-primary mg-b-20">
                Imágenes
              </h5>
            </div>
            <div class="row">
              <div class="col-11 mb-3">
                <template v-for="(image, i) in object.images" :key="i">
                  <DineUpMenuItemImageCreateUpdate class="mb-3" v-model="object.images[i]" />
                </template>
              </div>
              <div class="col-1 mb-3">
                <!-- boton eliminar imagen -->
                <button v-for="(i) in object.images.length-1" :key="i" class="btn ripple btn-outline-danger btn-icon btn-rounded mb-3" data-bs-placement="right"
                  data-bs-toggle="tooltip-danger" title="Quitar imagen" @click="object.images.splice(i, 1)">
                  <i class="fa fa-minus"></i>
                </button>
                <!-- boton agregar mas imagen -->
                <button class="btn ripple btn-outline-primary btn-icon btn-rounded" data-bs-placement="right"
                  data-bs-toggle="tooltip-primary" title="Agregar otra imagen" @click="object.images.push({})">
                  <i class="fa-regular fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Opcionales y adicionales del menu -->
    <div class="col-12">
      <div class="row">
        <div class="col-6" v-for="(typeItemOption, i) in ['OPTION', 'ADDITIONAL']" :key="i">
          <div class="row">
            <!--Checkboxes-->
            <div class="col-12">
              <div class="form-group">
                <input type="checkbox" v-model="showOptionsAndAdditions[typeItemOption]" />
                <span class="ms-3">Agregar items {{typeItemOption == 'OPTION' ? 'opcionales' : 'adicionales'}}</span>
              </div>
            </div>
            <!--Card and button-->
            <div class="col-12" v-show="showOptionsAndAdditions[typeItemOption]">
              <!--Card with form-->
              <template v-for="(optionGroup, i) in object.optionGroups" :key="i">
                <div v-if="optionGroup.nameType == typeItemOption" class="p-3 mb-3 bd rounded-3" style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
                  <div class="row">
                    <div class=" col-6 mg-b-20">
                      <h5 class="text-primary ">
                        {{typeItemOption == 'OPTION' ? 'Opción' : 'Adición'}}
                      </h5>
                    </div>
                  </div>
                  <DineUpMenuOptionGroup v-model="object.optionGroups[i]" :show-fields="{nameType: false}" />
                </div>
              </template>
              <!-- button for add options/addon -->
              <button class="btn ripple btn-outline-primary mg-t-20" @click="object.optionGroups.push({ nameType: typeItemOption, itemOptions: [{}] })">
                <i class="fa-regular fa-plus"></i>
                Agregar {{typeItemOption == 'OPTION' ? 'opción' : 'adición'}}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- select etiquetas -->
    <div class="col-12">
      <div class="row">
        <!-- Check for tags -->
        <div class="col-12">
          <div class="form-group">
            <input type="checkbox" v-model="showTags" />
            <span class="ms-3">Etiquetar producto</span>
          </div>
        </div>
        <div class="col-12" v-show="showTags">
          <div class="p-3 bd rounded-3 mg-b-30">
            <div>
              <h5 class="text-primary mg-b-20">
                Etiquetas
              </h5>
            </div>
            <div class="row">
              <!-- select etiquetas -->
              <div class="form-group col-6">
                <v-select :selectable="isOptionSelectableBasedOnSelectedOptions(object.tags)" :options="tags" label="name"
                  :reduce="tag => tag.id" v-model="object.tags" multiple placeholder="Seleccione etiquetas"></v-select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DineUpMenuItemImageCreateUpdate from '~/components/dineUp/menu/ItemImage/createUpdate.vue'
import DineUpMenuItemVariant from '~/components/dineUp/menu/MenuItemVariant/createUpdate.vue'
import DineUpMenuVariantOption from '~/components/dineUp/menu/VariantOption/createUpdate.vue'
import DineUpMenuOptionGroup from '~/components/dineUp/menu/OptionGroup/createUpdate.vue'


export default {
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return reactive({})
      },
      validator: (value) => {
        const defaultConfig = {
          hasMultiplePrice: false,
          images: [{}],
          variant: {
            variantOptions: [{}],
          },
          optionGroups: []
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
  components: {
    DineUpMenuItemImageCreateUpdate,
    DineUpMenuItemVariant,
    DineUpMenuVariantOption,
    DineUpMenuOptionGroup,
  },
  emits: ['update:modelValue'],
  computed: {
    object: {
      get() {

        console.log("==========>", this.modelValue)


        if (this.modelValue) {
          if (this.modelValue.images && this.modelValue.images.length > 0) {
            this.showImages = true
          }
          if (this.modelValue.optionGroups && this.modelValue.optionGroups.length > 0) {
            let existOption = this.modelValue.optionGroups.filter(optionGroup => optionGroup.nameType == "OPTION")
            if (existOption.length > 0) {
              this.showOptionsAndAdditions['OPTION'] = true
            }
            let existAdditional = this.modelValue.optionGroups.filter(optionGroup => optionGroup.nameType == "ADDITIONAL")
            if (existAdditional.length > 0) {
              this.showOptionsAndAdditions['ADDITIONAL'] = true
            }
          }
          this.keyCreateUpdateMenuItem++
        }
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  created() {
    this.$apollo.queries.searchMenus.refetch()
    this.$apollo.queries.searchCategories.refetch()
    this.$apollo.queries.searchItemTags.refetch()
  },
  data() {
    return {
      showOptionsAndAdditions: {
        "OPTION": false,
        "ADDITIONAL": false,
      },
      showTags: false,
      showImages: false,
      categories: [],
      tags: [],
      menus: [],
      keyCreateUpdateMenuItem: 0
    }
  },
  watch: {
    showOptionsAndAdditions: {
      handler(value) {
        if (value.OPTION) {
          let existOption = this.object.optionGroups.filter(optionGroup => optionGroup.nameType == "OPTION")
          if (existOption.length == 0) {
            this.object.optionGroups.push({
              nameType: "OPTION",
              itemOptions: [{}]
            })
          }
        } else {
          this.object.optionGroups = this.object.optionGroups.filter(optionGroup => optionGroup.nameType != "OPTION")
        }
        if (value.ADDITIONAL) {
          let existAdditional = this.object.optionGroups.filter(optionGroup => optionGroup.nameType == "ADDITIONAL")
          if (existAdditional.length == 0) {
            this.object.optionGroups.push({
              nameType: "ADDITIONAL",
              itemOptions: [{}]
            })
          }
        } else {
          this.object.optionGroups = this.object.optionGroups.filter(optionGroup => optionGroup.nameType != "ADDITIONAL")

        }
      },
      deep: true
    }
  },
  apollo: {
    searchMenus: {
      query: searchMenus(`
          id
          name
          isMain
          isActive
      `),
      variables() {
        return {
          fieldsOfModel: {
            isActive: true
          }
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchMenus
        this.menus = objects
      }
    },
    searchCategories: {
      query: searchCategories(`
          id
          name
          isActive
      `),
      variables() {
        return {
          fieldsOfModel: {
            isActive: true
          }
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchCategories
        this.categories = objects
      }
    },
    searchItemTags: {
      query: searchItemTags(`
          id
          name
          isActive
      `),
      variables() {
        return {
          fieldsOfModel: {
            isActive: true
          }
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchItemTags
        this.tags = objects
      }
    },
  }
}
</script>

<style></style>