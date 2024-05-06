<template>
  <div>
    <div class="row">
        <!-- TITULO -->
      <h5 class="mg-b-20 text-primary" >
        Información
      </h5>
      <!--DATOS-->
      <div class="col-6">
        <!-- NOMBRE -->
        <div class="col-12">
          <div>
            <h6>Nombre:</h6>
          </div>
          <span>
            {{ object.name }}
          </span>
        </div>
        <!-- TELEFONO -->
        <div class="col-12">
          <div class="mg-t-10">
            <h6>Teléfono:</h6>
          </div>
          <span>
            {{ object.phoneNumber }}
          </span>
        </div>
        <!-- SITIO WEB -->
        <div class="col-12">
          <div class="mg-t-10">
            <h6>Sitio web:</h6>
          </div>
          <span>
            {{ object.website }}
          </span>
        </div>
      </div>
      <!-- LOGO Y SLOGAN -->
      <div class="col-6">
        <div class="p-2 bd rounded-3 text-center" style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
          <img :src="`${$envVar.apiBaseUrl}/${object.logo}`" />
          <h6 class="mt-3" style="font-style: italic;">{{ object.slogan ? object.slogan : '' }}</h6>
        </div>
      </div>
      <!-- INFO ADICIONAL -->
      <div class="col-12" v-if="object.paginatedBranches">
        <!-- TITULO2 -->
        <h5 class="mg-b-20 mg-t-20 text-primary">
          Sucursales
        </h5>
        <div v-for="branch in object.paginatedBranches.objects">
          <DineUpBranchRead :object="branch" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DineUpBranchRead from '~/components/dineUp/restaurant/Branch/read.vue';

export default {
  props: {
    object: {
      type: Object,
      default: () => {
        return reactive({})
      }
    }
  },
  components: {
    DineUpBranchRead
  }
}
</script>

<style></style>