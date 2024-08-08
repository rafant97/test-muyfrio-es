import {
  Box,
  Card,
  Page,
  Text,
  BlockStack,
  InlineGrid,
  TextField,
  Button,
  OptionList,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useLoaderData, Form } from "@remix-run/react";
import { json } from "@remix-run/node";

export async function loader() {
  let diaSemanaSet = '0';
  let hora = "20:00";
  return json({ diaSemanaSet, hora });
}

export default function SettingsPage() {
  const { diaSemanaSet, hora } = useLoaderData(); 
  const [formState, setFormState] = useState({ name: hora });
  const [diaSemana, setDiaSemana] = useState([diaSemanaSet]);

  const handleOptionChange = useCallback(
    (selected) => {
      setDiaSemana(selected);
    },
    [setDiaSemana]
  );

  return (
    <Page>
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
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
            <Form method="POST" action="/api/wishlist"> {/* Acción del formulario */}
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
                  selected={diaSemana}
                />
                {/* Input oculto para enviar el valor seleccionado */}
                <input type="hidden" name="diaSemana" value={diaSemana[0]} />
                <Button submit={true}>Save</Button>
              </BlockStack>
            </Form>
          </Card>
        </InlineGrid>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
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
            <Form method="POST" action="/api/wishlist"> {/* Acción del formulario */}
              <BlockStack gap="400">
                <TextField 
                  label="Hora en formato 24h (ejemplo: 20:00)" 
                  value={formState.name}
                  onChange={(value) => setFormState(
                    { ...formState, name: value }
                  )}
                  name="hora"
                />
                <Button submit={true}>Save</Button>
              </BlockStack>
            </Form>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
