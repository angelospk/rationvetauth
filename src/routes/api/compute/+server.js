import testSolver from "$lib/testSolver";


export async function GET() {
    const result = await testSolver();
;
    return new Response(JSON.stringify(result));
}