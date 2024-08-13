// api/wishlist.jsx
import { json } from "@remix-run/node";

// Simulación de base de datos en memoria (solo para fines de demostración)
let wishListData = {};

export async function action({ request }) {
  const formData = await request.formData();
  const diaSemana = formData.get("diaSemana");
  const hora = formData.get("hora");

  // Almacena los datos en memoria
  wishListData = { diaSemana, hora };

  const applicationUrl = process.env.SHOPIFY_APP_URL ?? null;

  console.log("Datos guardada:", { diaSemana, hora }, { applicationUrl });

  const response = json({ message: "Datos guardada", diaSemana, hora, applicationUrl});
  return(response);
}

export async function loader() {
  
  return json(wishListData);
}
