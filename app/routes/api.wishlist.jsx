// api/wishlist.jsx
import { json } from "@remix-run/node";
import { cors } from "remix-utils";

// Simulación de base de datos en memoria (solo para fines de demostración)
let wishListData = {};

export async function action({ request }) {
  const formData = await request.formData();
  const diaSemana = formData.get("diaSemana");
  const hora = formData.get("hora");

  // Almacena los datos en memoria
  wishListData = { diaSemana, hora };

  console.log("Datos guardada:", { diaSemana, hora });

  const response = json({ message: "Datos guardada", diaSemana, hora });
  return cors(request, response);
}

export async function loader() {
  // Devuelve los datos almacenados
  return json(wishListData);
}
