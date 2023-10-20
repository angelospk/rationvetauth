

<!-- <Button id="b1" class="btn btn-sm variant-ghost-secondary my-40 ">Default popover</Button> -->
<!-- <Popover class="w-64 text-sm font-light bg-gradient-to-br from-transparent to-blue-200 " title="Popover title" triggeredBy="#b1">And here's some amazing content. It's very engaging. Right?</Popover> -->

<script>
  import { Popover, Button, Avatar } from 'flowbite-svelte';
</script>

<Button id="b2" class="-mb-2">User profile</Button>
<Popover triggeredBy="#b2" class=" w-64 text-sm font-light text-gray-500  dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
  <div class="p-3">
    <div class="flex justify-between items-center mb-2">
      <Avatar href="/" src="/images/profile-picture-1.webp" alt="Jese Leos" />
      <Button size="xs">Follow</Button>
    </div>
    <div class="text-base font-semibold leading-none text-gray-900 dark:text-white">
      <a href="/">Jese Leos</a>
    </div>
    <div class="mb-3 text-sm font-normal">
      <a href="/" class="hover:underline">@jeseleos</a>
    </div>
    <div class="mb-4 text-sm font-light">
      Open-source contributor. Building <a href="/" class="text-primary-600 dark:text-primary-500 hover:underline"> flowbite.com </a>
      .
    </div>
    <ul class="flex text-sm font-light">
      <li class="mr-2">
        <a href="/" class="hover:underline">
          <span class="font-semibold text-gray-900 dark:text-white">799</span>
          <span>Following</span>
        </a>
      </li>
      <li>
        <a href="/" class="hover:underline">
          <span class="font-semibold text-gray-900 dark:text-white">3,758</span>
          <span>Followers</span>
        </a>
      </li>
    </ul>
  </div>
</Popover>