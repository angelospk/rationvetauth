// export async function post(request) {
//     const formData = new URLSearchParams(request.body);
//     const selection = formData.get("selection");
  
//     // Handle the received selection data as needed
//     console.log(`Received selection: ${selection}`);
  
//     return {
//       body: {
//         message: `Received selection: ${selection}`
//       }
//     };
//   }

export async function POST(request) {
  const formData = new URLSearchParams(request.body);
    const selection = formData.get("selection");
  
    // Handle the received selection data as needed
    console.log(`Received selection: ${selection}`);
  
    return {
      body: {
        message: `Received selection: ${selection}`
      }
    };
  return new Response();
}