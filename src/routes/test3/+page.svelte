<!-- src/routes/+page.svelte -->
<script>
  import { Content, RenderContent } from '@builder.io/sdk-svelte';
  
  // Add your Public API Key
  const BUILDER_PUBLIC_API_KEY = "1bd42cccd65c4da3ae7374ed4a11db1c"; 

  export let content;
</script>

<main>
  <h1>
    Welcome to your Builder-integrated Svelte app
  </h1>
  <div>Below is your Builder Content:</div>

  {#if data.content || isPreviewing()}
    <!-- Render builder content with all required props -->
    <Content
      model="page"
      {content}
      apiKey={YOUR_API_KEY}
    />
  {:else}
    <p>Loading...</p>
  {/if}
</main>