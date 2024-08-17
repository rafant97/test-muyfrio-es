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

      //Leer el archivo JSON
      const data = fs.readFileSync('./data.json', 'utf8');
      const jsonData = JSON.parse(data);
      console.log("jsonData: ", jsonData);
  
      // Responder con un mensaje de éxito
      return json(
        { jsonData }, 
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
  
