// api/wishlist.jsx
import { json } from "@remix-run/node";
import * as fs from 'node:fs';



// Simulación de base de datos en memoria (solo para fines de demostración)
let wishListData = {};

export async function action({ request }) {
  const formData = await request.formData();

  const diaSemana = formData.get("diaSemana");
  const hora = formData.get("hora");
  const vacaciones = formData.getAll("vacaciones");

  // Almacena los datos en memoria
  wishListData = { diaSemana, hora, vacaciones };

  const applicationUrl = process.env.SHOPIFY_APP_URL ?? null;

  console.log("Datos guardada:", 
    { diaSemana, hora, vacaciones }, { applicationUrl }
  );

  //Modificar la base de datos
  const dataPath = './data.json';
  const data = fs.readFileSync('./data.json', 'utf8');
  const jsonData = JSON.parse(data);
  jsonData.diaSemana = diaSemana;
  jsonData.hora = hora;
  jsonData.vacaciones = vacaciones;
  console.log("jsonData: ", jsonData);
  fs.writeFileSync(dataPath, JSON.stringify(jsonData));

  const response = json({ 
    message: "Datos guardada", 
    diaSemana, hora, applicationUrl
  });
  return json(response);
}

export async function loader() {
  
  return json({message: "Datos guardados"});
}
