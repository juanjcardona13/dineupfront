

<template>
  <VueFinalModal class="" content-class="modal-dialog modal-lg modal-dialog-scrollable bg-white" :modal-id="modalId" >
    <div class="modal-content">
        <div class="modal-header">
            <h6 class="modal-title">{{title}}</h6>
            <button class="btn-close" @click="$emit('close', $event), $vfm.close(modalId)"></button>
        </div>
        <div class="modal-body">
            <slot></slot>
        </div>
        <div class="modal-footer" v-if="!hiddenFooter">
            <button class="btn ripple btn-secondary" type="button" @click="$emit('cancel', $event)">
                {{ $t('cancelar') }}
            </button>
            <button class="btn ripple btn-primary" @click="$emit('confirm', $event)" >
                {{ $t('c-generics__modal-confirmation') }}
            </button>
        </div>
    </div>
  </VueFinalModal>
</template>


<script>
import { VueFinalModal } from "vue-final-modal";

export default {
    props: {
        title: {
            type: String,
        },
        modalId: {
            type: [String, Number],
            default: "DefaultModalId"
        },
        hiddenFooter: {
            type: Boolean,
            default: false
        }
    },
    components: {
        VueFinalModal
    },
    methods: { }
}
</script>
  