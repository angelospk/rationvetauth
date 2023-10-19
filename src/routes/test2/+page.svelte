<script>
	import Logo from '$lib/Logo.svelte'
</script>
<style>
    .header-bg {
        background-color: #4CAF50;
        color: white;
    }
    .sub-header-bg {
        background-color: #81C784;
        color: white;
    }
    .even-row {
        background-color: #F5F5F5;
    }
</style>
<Logo cl="w-10 h-10" />
<img src="https://media.discordapp.net/attachments/1123335980074663936/1164377792868257812/minilogo.webp?ex=6542fe52&is=65308952&hm=2f07892f63b5c8ae0547f6e32b9367c858f877856a65a4baa9aea5fc8e45f2be&=&width=497&height=497" alt="logo">

<table class="w-full border-collapse">
    <thead>
        <tr class="header-bg">
            <th colspan="2"></th>
            <th colspan="8" class="text-center">Μονάδες</th>
        </tr>
        <tr class="sub-header-bg">
            <th class="p-2 border">Όνομα</th>
            <th class="p-2 border">Βάρος</th>
            <th class="p-2 border">ΞΟ</th>
            <th class="p-2 border">ΟΛΟ</th>
            <th class="p-2 border">ΟΚ</th>
            <th class="p-2 border">Τέφρα</th>
            <th class="p-2 border">Ca</th>
            <th class="p-2 border">P</th>
            <th class="p-2 border">ΟΛΟ</th>
        </tr>
    </thead>
    <tbody>
        <tr class="even-row">
            <td class="p-2 border">Σύνολο</td>
            <td class="p-2 border">0</td>
            <td class="p-2 border">0</td>
            <td class="p-2 border">0</td>
            <td class="p-2 border">0</td>
            <td class="p-2 border">0</td>
            <td class="p-2 border">0</td>
            <td class="p-2 border">0</td>
            <td class="p-2 border">0</td>
        </tr>
        <tr>
            <td class="p-2 border">Ποσοστό</td>
            <td class="p-2 border">NaN</td>
            <td class="p-2 border">NaN</td>
            <td class="p-2 border">NaN</td>
            <td class="p-2 border">NaN</td>
            <td class="p-2 border">NaN</td>
            <td class="p-2 border">NaN</td>
            <td class="p-2 border">NaN</td>
            <td class="p-2 border">NaN</td>
        </tr>
    </tbody>
</table>