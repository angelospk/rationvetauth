
import { fetchXLSXdata } from "../../../getdata";
import type { RequestHandler } from './$types';
let cachedData = null;
let cacheTime = null;
export const GET = (async () =>{
  
  if (cachedData && cacheTime && (new Date() - cacheTime) < 60000) {
    return new Response(JSON.stringify({ success: true, d:cachedData}), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate'
      }
    })
  }
  const url ="https://docs.google.com/spreadsheets/d/e/2PACX-1vQZgeWvH90ABtyAGIgCmdIx8AdoLskM2EP6kotSQBxEbGpA3QkyZKOUXNP3-4Akwe4YbbIItaI-X-LV/pub?output=xlsx";
	let data= await fetchXLSXdata(url);
  // const response = await fetch("https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/pub?output=csv");
  if (data) {
    // res.(JSON.stringify(data))
    
    // Set caching headers
    // This caches the data in CDN for 1 hour
    cachedData = data;
    cacheTime = new Date();
    return new Response(JSON.stringify({ success: true, d:data}), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600'
      }
    })
    // res.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    // // Return the data
    // res.headers.set('Content-Type', 'application/json');
    // res.end(JSON.stringify(data));
  } else {
    return new Response(JSON.stringify({ success:false }));
  }
}) satisfies RequestHandler;