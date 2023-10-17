<script>
    let rationName = '';
    let producerName = '';
    let currentDate = new Date().toLocaleDateString();
</script>

<div class="space-y-4 text-lg my-4">
    <div class="flex flex-col space-y-2">
        <label for="ration_name" class="underline">Τίτλος: </label>
        <input id="ration_name" class="border p-2 rounded" type="text" bind:value={rationName} placeholder="Τίτλος" />
    </div>

    <div class="flex flex-col space-y-2">
        <label for="producer_name" class="underline">Δημιουργός: </label>
        <input id="producer_name" class="border p-2 rounded" type="text" bind:value={producerName} placeholder="Δημιουργός" />
    </div>

    <div class="flex flex-col space-y-2">
        <label for="entry_date" class="underline">Ημερομηνία: </label>
        <span id="entry_date" class="p-2 bg-gray-200 rounded">{currentDate}</span>
    </div>
</div>