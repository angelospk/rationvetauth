<script>
import { pb } from "$lib/pocketbase";
	import Input from "postcss/lib/input";
    
    let email = '';
let res;
    const handleSubmit = async () => {
        try {
            // res=await pb.collection('users').requestPasswordReset(email);
            // console.log(res);
            pb.collection('feeds').subscribe("35vfbj3kx5akeoa", (data) => {
                console.log(data);
            });
            alert('Password reset email sent!');
        } catch (error) {
            console.error(error);
            alert('Error resetting password. Please try again later.');
        }
    };
</script>

<main>
    <h1>Forgot Password</h1>
    <form on:submit|preventDefault={handleSubmit}>
        <label>
            Email:
            <input type="email" bind:value={email} required />
        </label>
        <button class="koumpi my-2" type="submit">Reset Password</button>

    </form>
</main>
