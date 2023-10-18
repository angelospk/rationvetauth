export async function load({ params, url }) {
    let ration_id = url.searchParams.get('id');
    return { ration_id };}