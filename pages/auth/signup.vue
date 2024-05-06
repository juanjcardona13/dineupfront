<template>
  <div class="col-lg-6 col-xl-5 d-none d-lg-block text-center bg-primary details" >
        <div class="mt-5 pt-5 p-2 pos-absolute">
            <img src="@/assets/img/brand/logo-light.png" class="header-brand-img mb-4" alt="logo" />
            <div class="clearfix"></div>
            <img src="@/assets/img/svgs/user.svg" class="ht-100 mb-0" alt="user" />
            <h5 class="mt-4 text-white">Create Your Account</h5>
            <span class="tx-white-6 tx-13 mb-5 mt-xl-0"
            >Signup to create, discover and connect with the global community</span
            >
        </div>
    </div>
    <div class="col-lg-6 col-xl-7 col-xs-12 col-sm-12 login_form">
        <div class="main-container container-fluid">
            <div class="row row-sm">
            <div class="card-body mt-2 mb-2">
                <img
                src="@/assets/img/brand/logo-light.png"
                class="d-lg-none header-brand-img text-start float-start mb-4 error-logo-light"
                alt="logo"
                />
                <img
                src="@/assets/img/brand/logo.png"
                class="d-lg-none header-brand-img text-start float-start mb-4 error-logo"
                alt="logo"
                />
                <div class="clearfix"></div>
                <h5 class="text-start mb-2">Signup for Free</h5>
                <p class="mb-4 text-muted tx-13 ms-0 text-start">
                It's free to signup and only takes a minute.
                </p>
                <Form v-slot="propsForm">
                    <div class="form-group text-start">
                        <label>Nombres</label>
                        <Field name="Nombres" rules="required" class="form-control" v-model="object.user.firstName" placeholder="Nombres..." type="text" />
                        <ErrorMessage class="text-danger mt-1" name="Nombres" as="div" />
                    </div>
                    <div class="form-group text-start">
                        <label>Apellidos</label>
                        <Field name="Apellidos" rules="required" class="form-control" v-model="object.user.lastName" placeholder="Apellidos..." type="text"/>
                        <ErrorMessage class="text-danger mt-1" name="Apellidos" as="div"/>
                    </div>
                    <div class="form-group text-start">
                        <label>Email</label>
                        <Field name="Email" rules="required" class="form-control" v-model="object.user.email" placeholder="Email..." type="text"/>
                        <ErrorMessage class="text-danger mt-1" name="Email" as="div" />
                    </div>
                    <div class="form-group text-start">
                        <label>Contraseña</label>
                        <Field name="Contraseña" rules="required" class="form-control" v-model="object.user.password" placeholder="Contraseña" type="password"/>
                        <ErrorMessage class="text-danger mt-1" name="Contraseña" as="div" />
                    </div>
                    <button :disabled="!propsForm.meta.valid" @click="createUpdateObject()" type="button" class="btn ripple btn-primary btn-block" >
                        Crear cuenta
                    </button>
                </Form>
                <div class="text-start mt-5 ms-0">
                <p class="mb-0">
                    Already have an account?
                    <nuxt-link to="/auth/signin">Sign In</nuxt-link>
                </p>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Field, Form, ErrorMessage } from 'vee-validate';
import { APOLLO_CLIENTS } from '@/helpers/constants.js'

definePageMeta({layout: "auth"})

export default {
    components: {
        Field,
        Form,
        ErrorMessage
    },
    data() {
        return {
            object: {
                user: {

                }
            }
        }
    },
    methods: {
        async createUpdateObject() {
            this.object.user.username = this.object.user.email
            await this.$apollo.mutate({
                mutation: createDineUpUsers(),
                variables: {
                    input: [this.object]
                }
            })
            this.$swal("Good job!", "You account is created!", "success");
            this.$router.push("/auth/signin")
        },
    },

}
</script>

<style>

</style>