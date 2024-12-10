<script setup lang="ts">
const { signOut, status } = useAuth();

const isAuthenticated = computed(() => status.value === "authenticated");
const textClass = "text-black hover:text-blue-500 cursor-pointer";
</script>

<template>
  <div class="flex-grow border-solid border-2 border-gray-200 py-4">
    <nav class="flex gap-4 px-4">
      <NuxtLink :class="textClass" to="/">Home</NuxtLink>
      <NuxtLink v-if="!isAuthenticated" :class="textClass" to="/register"
        >Register</NuxtLink
      >
      <NuxtLink v-if="!isAuthenticated" :class="textClass" to="/login"
        >Login</NuxtLink
      >
      <NuxtLink
        v-if="isAuthenticated"
        :class="textClass"
        @click="signOut({ callbackUrl: '/' })"
        >Logout</NuxtLink
      >
      <pre class="text-black ml-auto">Status: {{ status }}</pre>
    </nav>
  </div>
</template>
