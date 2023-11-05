
import { fetchXLSXdata } from "../../../getdata";
import type { RequestHandler } from './$types';
import { pb } from "$lib/pocketbase";
let cachedData = null;
let cacheTime = null;
export const GET = (async () =>{
  
  if (cachedData && cacheTime && (new Date() - cacheTime) < 60000) {
    return new Response(JSON.stringify({ cached:true,success: true, d:cachedData}), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate'
      }
    })
  }
  const pub=await pb.collection('publicFeeds').getFullList();
  const orologies=await pb.collection('orologies').getFullList();
  const data={pub,orologies}
  // const url ="https://docs.google.com/spreadsheets/d/e/2PACX-1vQZgeWvH90ABtyAGIgCmdIx8AdoLskM2EP6kotSQBxEbGpA3QkyZKOUXNP3-4Akwe4YbbIItaI-X-LV/pub?output=xlsx";
	// let data= await fetchXLSXdata(url);
  if (pub && orologies) {
    
    // This caches the data in CDN for 1 hour
    cachedData = data;
    cacheTime = new Date();
    return new Response(JSON.stringify({cached:false, success: true, d:data}), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600'
      }
    })

  } else {
    return new Response(JSON.stringify({ success:false }));
  }
}) satisfies RequestHandler;