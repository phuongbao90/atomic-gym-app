<script lang="ts" setup>
import { definePageMeta, useAuth } from "#imports";
import { ref } from "vue";

definePageMeta({
  auth: false,
});

const { signUp } = useAuth();

const email = ref("thu02@gmail.com");
const password = ref("123456#@Nn");
const name = ref("Thu Dang");

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
</script>

<template>
  <div>
    <h1>Register Page</h1>
    <form
      @submit.prevent="
        signUp({ email, password, name }, { callbackUrl: '/', external: true })
      "
    >
      <input type="text" placeholder="Username" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <input type="text" placeholder="Name" v-model="name" />
      <button type="submit">Register</button>
    </form>
  </div>
</template>
