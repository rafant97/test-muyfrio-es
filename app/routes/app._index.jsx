import {
  Box,
  Card,
  InlineGrid,
  Text,
  BlockStack,
  TextField,
  Button,
  OptionList,
  Page
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import * as fs from 'node:fs';

export async function loader() {
  try {
    const data = fs.readFileSync('./data.json', 'utf8'); // Lee el archivo
    const jsonData = JSON.parse(data); // Convierte el contenido del archivo a JSON
    return json(jsonData); // Envía los datos al frontend
  } catch (err) {
    console.error("Error al leer el archivo JSON:", err);
    return json({ hora: '', diaSemana: '' }); // En caso de error, retornar valores por defecto
  }
}

export default function SettingsPage() {
  const data = useLoaderData();
  const { hora, diaSemana } = data;
  const fetcher = useFetcher();

  const [formState, setFormState] = useState({ hora });
  const [selectedDiaSemana, setSelectedDiaSemana] = useState([diaSemana]);
  const [showMessage, setShowMessage] = useState(false);

  // Actualizar el estado cuando los datos del loader cambian
  useEffect(() => {
    setFormState({ hora });
    setSelectedDiaSemana([diaSemana]); // Actualiza el estado cuando los datos cambien
  }, [diaSemana, hora]);

  const handleOptionChange = useCallback((selected) => {
    setSelectedDiaSemana(selected);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetcher.submit(event.target, { method: "post" });
  };

  useEffect(() => {
    if (fetcher.data) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [fetcher.data]);

  return (
    <Page>
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <fetcher.Form method="post" action="/api/wishlist" onSubmit={handleSubmit}>
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box as="section" paddingInlineStart={{ xs: 400, sm: 0 }} paddingInlineEnd={{ xs: 400, sm: 0 }}>
              <BlockStack gap="400">
                <Text as="h3" variant="headingMd">
                  Añadir recargo
                </Text>
                <Text as="p" variant="bodyMd">
                  ¿Qué día de la semana quieres añadir tu recargo?
                </Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <BlockStack gap="400">
                <OptionList
                  title="Día de la semana"
                  onChange={handleOptionChange}
                  options={[
                    { label: 'Lunes', value: '1' },
                    { label: 'Martes', value: '2' },
                    { label: 'Miércoles', value: '3' },
                    { label: 'Jueves', value: '4' },
                    { label: 'Viernes', value: '5' },
                    { label: 'Sábado', value: '6' },
                    { label: 'Domingo', value: '0' },
                  ]}
                  selected={selectedDiaSemana}
                />
                <input type="hidden" name="diaSemana" value={selectedDiaSemana[0]} />
              </BlockStack>
            </Card>
          </InlineGrid>
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box as="section" paddingInlineStart={{ xs: 400, sm: 0 }} paddingInlineEnd={{ xs: 400, sm: 0 }}>
              <BlockStack gap="400">
                <Text as="h3" variant="headingMd">
                  Hora de corte
                </Text>
                <Text as="p" variant="bodyMd">
                  ¿A partir de qué hora quieres dejar de recibir pedidos?
                  (Se aplica a todos los días de la semana)
                </Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <BlockStack gap="400">
                <TextField
                  label="Hora en formato 24h (ejemplo: 20:00)"
                  value={formState.hora}
                  onChange={(value) => setFormState({ ...formState, hora: value })}
                  name="hora"
                />
              </BlockStack>
            </Card>
          </InlineGrid>
          <BlockStack gap="400" marginTop="400">
            <Button submit={true}>Guardar</Button>
          </BlockStack>
        </fetcher.Form>
        {showMessage && (
          <div style={{
            backgroundColor: 'green',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            marginTop: '20px',
            textAlign: 'center'
          }}>
            Datos guardados
          </div>
        )}
      </BlockStack>
    </Page>
  );
}