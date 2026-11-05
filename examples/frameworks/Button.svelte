<!-- Svelte 5 usage adapter; load styles/app.css once in the consuming app. -->
<script lang="ts">
import type { Snippet } from 'svelte';
let {busy=false,disabled=false,children,onclick}:{busy?:boolean;disabled?:boolean;children:Snippet;onclick?:(event:MouseEvent)=>void}=$props();
</script>
<button type="button" class="pl-button pl-button--strong pl-button--lg" disabled={disabled || busy} aria-busy={busy || undefined} {onclick}>{@render children()}{#if busy}<span> — in progress</span>{/if}</button>
