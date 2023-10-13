<script lang="ts">

	import { currentUser } from "$lib/pocketbase";
    let username:String;
    let password:String;
</script>
{#if $currentUser}
    <p>Είσαι ήδη εγγεργραμμένος!</p>
    <a href="/" class="my-3 btn btn-lg w-full variant-ghost-surface hover:underline hover:variant-filled-primary">Επιστροφή στην Αρχική</a>
    {:else}
    <div class="flex items-center w-full max-w-lg px-6 mx-auto ">
        <div class="flex-1">
            <div class="text-center">
                
                <h1 class="mt-3 text-gray-500 dark:text-gray-300">Δημιουργία Λογαριασμού</h1>
            </div>

            <div class="mt-8">
                <form>
                    <div>
                        <label for="email" class="block mb-2 text-sm text-gray-600 dark:text-gray-200 text-left">Email</label>
                        <input type="email" bind:value={username} name="email" id="email" placeholder="example@example.com" class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                    </div>

                    <div class="mt-6">
                        <div class="flex justify-between mb-2">
                            <label for="password" class="text-sm text-gray-600 dark:text-gray-200">Κωδικός</label>
                        </div>

                        <input type="password" bind:value={password} name="password" id="password" placeholder="Your Password" class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                    </div>

                    <div class="mt-6">
                        <button 
                            class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                            Είσοδος
                        </button>
                    </div>

                </form>

                <p class="mt-6 text-sm text-center text-gray-400">Έχεις λογαριασμό; <a href="/login" class="text-blue-500 focus:outline-none focus:underline hover:underline">Κάνε σύνδεση</a>.</p>
            </div>
        </div>
    </div>
{/if}
