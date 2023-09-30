<script>
    let isTextVisible = false;
  
    function toggleTextVisibility() {
      isTextVisible = !isTextVisible;
    }
  </script>
  
  <style>
    .hidden {
      display: none;
    }
  </style>
  
  <div class="text-center">
    <button
      class="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
      on:click={toggleTextVisibility}
    >
      Toggle Text
    </button>
  
    {#if isTextVisible}
      <p class="mt-4 text-gray-700">This is the text that appears when the button is clicked.</p>
    {/if}
  </div>
  