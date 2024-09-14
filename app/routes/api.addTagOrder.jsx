// api/wishlist.jsx
import { json } from "@remix-run/node";


export async function action({ request }) {
  
  return json({message: "Tag añadida"});
}

export async function loader() {
  
  return json({message: "Datos guardados"});
}
