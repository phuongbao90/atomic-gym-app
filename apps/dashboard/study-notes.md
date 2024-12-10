## vue for react developers

#### difference between <script> and <script setup>

- <script setup> is a compiler macro that allows you to use the same syntax for defining props, emits, and other component options as in the template.
- <script> is the old way to define component options.
- <script setup> is more concise and easier to read.

#### create vue component (named component)

    - not sure how to export named with vue

```vue
<script setup lang="ts">
import { ref } from "vue";

const username = ref("");
export {
  name: "LoginScreen",
}
</script>

<template>
  <div>Login</div>
  <input v-model="username" />
</template>
```

vs

```tsx
import React from "react";
import { useState } from "react";

export function LoginScreen() {
  const [username, setUsername] = useState("");
  return (
    <div>
      Login
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
    </div>
  );
}
```

#### passing props

- method 1

```vue
<script setup lang="ts">
export default defineComponent({
  name: "LoginScreen",
  props: {
    username: {
      type: String,
      required: true,
    },
  },
});
</script>
<template>
  <div>Login {{ username }}</div>
</template>
```

- method 2

```vue
<script setup lang="ts">
const props = defineProps<{
  username: String;
}>();
</script>
<template>
  <div>Login {{ props.username }}</div>
</template>
```

vs

```tsx
import React from "react";
import { useState } from "react";

export function LoginScreen({ username }: { username: string }) {
  return <div>Login {username}</div>;
}
```

#### manage local state

- to access ref in <script></script> => via .value but in <template></template> => no need

```vue
<script setup lang="ts">
const username = ref("");

function handleClick() {
  console.log(username.value);
}
</script>
<template>
  <div>Login {{ username }}</div>
  <input v-model="username" />
  <button @click="handleClick">click</button>
</template>
```

vs

```tsx
import React from "react";
import { useState } from "react";

export function LoginScreen() {
  const [username, setUsername] = useState("");
  return (
    <div>
      Login {username}
      <button onClick={() => console.log(username)}>click</button>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
    </div>
  );
}
```

#### useEffect => watchEffect

```vue
<script setup lang="ts">
const count = ref(0);

watchEffect(() => {
  if (count.value > 9) {
    alert("count > 9");
  }
});
</script>
```

vs

```tsx
import React from "react";
import { useState, useEffect } from "react";

export function LoginScreen() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count > 9) alert("count > 9");
  }, [count]);
}
```

#### lifecycle hooks

```vue
<script setup lang="ts">
const countRef = ref(0);

onMounted(() => {
  console.log("mounted");
});

onUpdated(() => {
  console.log("updated");
});

// 3
watch(countRef, (newVal) => {
  console.log("countRef updated", newVal);
});
// or
watchEffect(() => {
  console.log("countRef updated", countRef.value);
});
</script>
```

vs

```tsx
import React from "react";
import { useEffect } from "react";

export function LoginScreen() {
  const [count, setCount] = useState(0);
  // 1
  useEffect(() => {
    console.log("mounted");

    // 2
    return () => {
      console.log("unmounted");
    };
  }, []);

  // 3
  useEffect(() => {
    console.log("updated");
  }, [count]);
}
```

#### computed => useMemo

```vue
<script setup lang="ts">
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
</script>
```

vs

```tsx
import React from "react";
import { useState, useMemo } from "react";

export function LoginScreen() {
  const [count, setCount] = useState(0);
  const doubleCount = useMemo(() => count * 2, [count]);
}
```

#### useLayoutEffect => onBeforeUpdate

#### dependency injection => provide / inject => useContext

```vue
<!-- parent -->
<script setup lang="ts">
import { provide } from "vue";

const user = { name: "John" };
provide("user", user);
</script>

<!-- child -->
<script setup lang="ts">
const user = inject("user");
</script>
```

vs

```tsx
import React from "react";
import { useContext } from "react";

const UserContext = createContext(null);

const Wrapper = () => {
  const user = { name: "John" };
  return (
    <UserContext.Provider value={user}>
      <LoginScreen />
    </UserContext.Provider>
  );
};

export function LoginScreen() {
  const user = useContext(UserContext);
}
```

#### custom directive vs jsx

| vue                | react                                                |
| ------------------ | ---------------------------------------------------- |
| v-model            | value / onChange                                     |
| v-show             | style={{ display: show ? "block" : "none" }}         |
| v-if               | &&                                                   |
| v-for="i in items" | items.map((item) => <div>{item}</div>)               |
| v-bind             | :                                                    |
| v-htmld            | dangerouslySetInnerHTML                              |
| v-text="msg"       | {msg}                                                |
| @click.capture     | onClick                                              |
| @submit.prevent    | onSubmit={(e) => e.preventDefault()}                 |
| @keyup.enter       | onKeyUp={(e) => e.key === "Enter" && handleSubmit()} |
| v-bind / :         |                                                      |
| :src               | src                                                  |
| :style             | style={{}}                                           |
| v-slot             | {children}                                           |

#### slot => props.children

```vue
<!-- AppLayout.vue -->
<template>
  <div>
    <div>header</div>
    <slot>
      <!-- fallback content -->
    </slot>
    <div>footer</div>
  </div>
</template>

<!-- App.vue -->
<template>
  <AppLayout>
    <div>content</div>
  </AppLayout>
</template>
```

vs

```tsx
import React from "react";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>header</div>
      {children}
      <div>footer</div>
    </div>
  );
}

function App() {
  return (
    <AppLayout>
      <div>content</div>
    </AppLayout>
  );
}
```

#### hook pattern

```js
import { ref, onMounted, onUnmounted } from "vue";

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function updateMouse(e: MouseEvent) {
    x.value = e.pageX;
    y.value = e.pageY;
  }

  return {
    x,
    y,
  };
}
```

vs

```tsx
import React from "react";
import { useState } from "react";

export function useMouse() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  function updateMouse(e: MouseEvent) {
    setX(e.pageX);
    setY(e.pageY);
  }

  return {
    x,
    y,
  };
}
```

#### fetch data

```vue
<script setup lang="ts">
const data = ref(null);
const error = ref(null);

onMounted(async () => {
  try {
    const res = await fetch("/api/data");
    data.value = await res.json();
  } catch (err) {
    error.value = err;
  }
});
</script>
```

vs

```tsx
import React from "react";
import { useState, useEffect } from "react";

export function LoginScreen() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => setError(err));
  }, []);
}
```
