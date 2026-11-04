<!-- Vue 3 usage adapter; load styles/app.css once in the consuming app. -->
<script setup lang="ts">
withDefaults(defineProps<{busy?:boolean;disabled?:boolean}>(),{busy:false,disabled:false});
</script>
<template><button type="button" class="pl-button pl-button--strong pl-button--lg" :disabled="disabled || busy" :aria-busy="busy || undefined"><template v-if="busy">Working…</template><slot v-else /></button></template>
