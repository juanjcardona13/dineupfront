<template>
    <div class="col-lg-6 col-xl-5 d-none d-lg-block bg-primary" style="display: flex !important; justify-content: center; align-items: center;">
      <img
        src="@/assets/img/brand/Isotipocolorblanco.png"
        class="header-brand-img mb-0 animacion logo-light"
        alt="user"
      />
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
                        class="d-lg-none header-brand-img text-center mb-4 logo-light"
                        alt="logo"
                    />
                    <div class="clearfix"></div>
                    <Form v-slot="propsForm">
                        <h5 class="text-center mb-4 mt-2">Inicio de sesión</h5>
                        <!-- <p class="mb-4 text-muted tx-13 ms-0 text-start">
                            Signin to create, discover and connect with the global community
                        </p> -->
                        <div class="form-group text-start">
                            <label>Correo electrónico</label>
                            <Field name="Email" rules="required" class="form-control" v-model="object.username" placeholder="Ejemplo@correo.com" type="text"/>
                            <ErrorMessage class="text-danger mt-1" name="Email" as="div" />
                        </div>
                        <div class="form-group text-start">
                            <label>Contraseña</label>
                            <Field name="Contraseña" rules="required" class="form-control" v-model="object.password" placeholder="Contraseña" type="password"/>
                            <ErrorMessage class="text-danger mt-1" name="Contraseña" as="div" />
                        </div>
                        <button :disabled="!propsForm.meta.valid" @click="login()" type="button" class="btn ripple btn-primary btn-block" >
                          Iniciar sesión
                        </button>
                    </Form>
                    <div class="text-start mt-5 ms-0">
                        <!-- <div class="mb-1">
                        <nuxt-link to="/auth/forgotpassword">Forgot password?</nuxt-link>
                        </div> -->
                        <div>
                        ¿Aún no te registras?
                        <nuxt-link to="/auth/signup">Regístrate Aquí</nuxt-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Field, Form, ErrorMessage } from 'vee-validate';
import { APOLLO_CLIENTS } from '@/helpers/constants.js'
import gql from "graphql-tag";
import { useUserLoggedInStore } from '~/stores/userLoggedIn.js'
import { mapActions, mapState } from 'pinia';


definePageMeta({layout: "auth"})

export default {
    components: {
        Field,
        Form,
        ErrorMessage
    },
    data() {
        return {
            object: {}
        }
    },
    methods: {
        ...mapActions(useUserLoggedInStore, {
            setIsUserLoggedIn: "setIsUserLoggedIn"
        }),
        async login() {
            const {data} = await this.$apollo.mutate({
                mutation: gql`
                    mutation token($username: String! $password: String!) {
                        tokenAuth(username: $username password: $password) {
                            payload
                            refreshExpiresIn
                            token
                        }
                    }
                `,
                variables: {
                    username: this.object.username,
                    password: this.object.password,
                }
            })
            const { tokenAuth } = data
            this.$auth.setToken(tokenAuth.token)
            this.setIsUserLoggedIn(true)
            this.$getUserLoggedIn()
            this.$router.push("/")
        }
    }
};
</script>

<style>
.logo-light {
  width: 50%;
}
.animacion {
  animation: crescendo 1.5s alternate;
}
@keyframes crescendo {
  0%   {transform: scale(.8);}
  100% {transform: scale(1.5);};
}
</style>
