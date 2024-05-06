<template>
  <div class="col-lg-6 col-xl-5 d-none d-lg-block text-center bg-primary details" >
        <div class="mt-3 pt-3 p-2 pos-absolute">
        <img
            src="@/assets/img/brand/logo-light.png"
            class="header-brand-img mb-4"
            alt="logo"
        />
        <div class="clearfix"></div>
        <img
            src="@/assets/img/svgs/user.svg"
            class="ht-100 mb-0"
            alt="user"
        />
        <h5 class="mt-4 text-white">Reset Your Password</h5>
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
            <h5 class="text-start mb-2">Forgot Password</h5>
            <p class="mb-4 text-muted tx-13 ms-0 text-start">
                It's free to signup and only takes a minute.
            </p>
            <form>
                <div class="form-group text-start">
                <label>Email</label>
                <input
                    class="form-control"
                    placeholder="Enter your email"
                    type="text"
                    value=""
                />
                <button class="btn ripple btn-primary btn-block mt-2">
                    Request reset link
                </button>
                </div>
            </form>

            <div class="card-footer border-top-0 ps-0 mt-3 text-start">
                <p>Did you remembered your password?</p>
                <p class="mb-0">
                Try to <nuxt-link to="signin">Signin</nuxt-link>
                </p>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
definePageMeta({layout: "auth"})

export default {

}
</script>

<style>

</style>