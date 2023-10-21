<script>
  import { onMount } from 'svelte';

  function handleClick() {
    console.log('Button clicked');
  }

  onMount(() => {
    console.log('Component mounted');
  });
</script>

<div class="flex-col overflow-hidden relative flex min-h-[1080px] px-5">
  <img loading="lazy" srcset="https://cdn.builder.io/api/v1/image/assets/TEMP/fca2f016-ce8f-4e1d-85ce-8ab3fae274b5?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/fca2f016-ce8f-4e1d-85ce-8ab3fae274b5?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fca2f016-ce8f-4e1d-85ce-8ab3fae274b5?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/fca2f016-ce8f-4e1d-85ce-8ab3fae274b5?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/fca2f016-ce8f-4e1d-85ce-8ab3fae274b5?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fca2f016-ce8f-4e1d-85ce-8ab3fae274b5?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/fca2f016-ce8f-4e1d-85ce-8ab3fae274b5?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/fca2f016-ce8f-4e1d-85ce-8ab3fae274b5?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&"class="absolute z-[-1] h-full w-full object-cover object-center inset-0" />
  <div class="relative self-center flex w-full max-w-[1662px] flex-col mt-24 mb-72 max-md:max-w-full">
    <div class="items-start flex w-[930px] max-w-full justify-between gap-5 max-md:flex-wrap max-md:justify-center">
      <button class="text-[color(display-p3_1_1_1_/_0.84)] text-5xl font-bold self-stretch" on:click={handleClick}>3rd</button>
      <img loading="lazy" srcset="https://cdn.builder.io/api/v1/image/assets/TEMP/00eb16de-f5b7-4a8f-9521-290ecc37309a?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/00eb16de-f5b7-4a8f-9521-290ecc37309a?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/00eb16de-f5b7-4a8f-9521-290ecc37309a?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/00eb16de-f5b7-4a8f-9521-290ecc37309a?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/00eb16de-f5b7-4a8f-9521-290ecc37309a?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/00eb16de-f5b7-4a8f-9521-290ecc37309a?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/00eb16de-f5b7-4a8f-9521-290ecc37309a?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/00eb16de-f5b7-4a8f-9521-290ecc37309a?apiKey=1bd42cccd65c4da3ae7374ed4a11db1c&"class="aspect-[0.14] object-cover object-center w-1 rotate-90 fill-[color(display-p3_1_1_1_/_0.41)] overflow-hidden self-center shrink-0 my-auto" />
      <h1 class="text-[color(display-p3_1_1_1_/_0.84)] text-5xl font-bold opacity-40 self-stretch w-44">DESIGN</h1>
      <h1 class="text-[color(display-p3_1_1_1_/_0.84)] text-5xl font-bold self-stretch w-[214px]">CULTURE</h1>
      <h1 class="text-[color(display-p3_1_1_1_/_0.84)] text-5xl font-bold opacity-40 max-w-[336px] self-stretch grow shrink-0 basis-auto">EXPLORATION</h1>
    </div>
    <h1 class="text-[color(display-p3_1_1_1)] text-center text-8xl font-bold self-center w-[1643px] max-w-[1643px] ml-2.5 mt-52 max-md:max-w-full max-md:mt-52">더욱 많은 구성원, 제품<br />임팩트 기반<br />공유 장려</h1>
  </div>
</div>