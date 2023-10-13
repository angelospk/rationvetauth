<script>
    import { currentUser } from "$lib/pocketbase";
</script>

<h1>Αρχική</h1>
<p class="w-full overflow-visible">{JSON.stringify($currentUser)}</p>