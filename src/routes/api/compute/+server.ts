import solveLP from "$lib/testSolver";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export async function GET() {
    // const result = await testSolver();
    const result="Λάθος διεύθυνση"
    return new Response(JSON.stringify(result));
}
// export const POST= async (request)=> {
//     let a=request.request.json()
//     console.log(a)
//     // console.log(b)
//     // const result = await solveLP();
// ;
//     return new Response(JSON.stringify(a));
// }
export const POST: RequestHandler = async ({ request }) => {
	const a:{selected:object, requirements:object}= await request.json();
    const res=await solveLP(a.selected, a.requirements)
	return json(res);
};