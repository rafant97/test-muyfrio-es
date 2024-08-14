import { authenticate } from "~/shopify.server";
import { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import * as fs from 'node:fs';

export const action: ActionFunction = async ({ request }) => {
    try {
      console.log("-----------hit app proxy POST--------");
  
      const { session } = await authenticate.public.appProxy(request);
  
      if (!session) {
        return json({ error: "Authentication failed" }, { status: 401 });
      }
  
      console.log("session: ", session);

      if(request.method === "POST") {
          //Modificar archivo json
      } else {
        // Consultar archivo json
      }
  
      // Responder con un mensaje de éxito
      return json(
        { message: "Data saved successfully" }, 
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (error) {
      console.error("Error in action function:", error);
      return json({ error: "An error occurred while processing your request" }, { status: 500 });
    }
  };
  

