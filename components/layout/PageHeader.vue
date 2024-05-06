<template>
  <div class="page-header">
    <div>
      <h2 class="main-content-title tx-24 mg-b-5">{{ heading }}</h2>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="javascript:;"></a>{{ maintitle }}
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ subtitle }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  name: "Page-header",
  props: ["heading", "maintitle", "subtitle"],
};
</script>

<style></style>
