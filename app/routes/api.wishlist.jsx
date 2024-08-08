// api/wishlist.jsx
import { json } from "@remix-run/node";

export async function action({ request }) {
  const data = await request.formData();
  const parsedData = Object.fromEntries(data);

  // Aquí se hace el console.log de los datos recibidos
  console.log('Datos recibidos:', parsedData);

  // Devolver los datos recibidos como JSON
  return json(parsedData);
}

export default function WishlistAPI() {
  // Este componente no se renderiza, pero es necesario para Remix
  return null;
}
