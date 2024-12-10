<script lang="ts" setup>
import { definePageMeta, useAuth } from "#imports";
import { ref } from "vue";

const { data, token } = useAuth();

// console.log("auth data ", data.value);
// console.log("auth token ", token.value);

definePageMeta({
  auth: false,
});
</script>

<template>
  <div>
    <h1>Home Page</h1>
    <!-- <pre>Data: {{ data || "no session data present, are you logged in?" }}</pre> -->
  </div>
</template>
