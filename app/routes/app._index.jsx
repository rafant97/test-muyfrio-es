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

export async function loader() {
  let diaSemanaSet = '0';
  let hora = "20:00";
  return { diaSemanaSet, hora };
}

export default function SettingsPage() {
  const { diaSemanaSet, hora } = useLoaderData();
  const fetcher = useFetcher();
  const [formState, setFormState] = useState({ hora });
  const [diaSemana, setDiaSemana] = useState([diaSemanaSet]);
  const [showMessage, setShowMessage] = useState(false);

  const handleOptionChange = useCallback(
    (selected) => {
      setDiaSemana(selected);
    },
    [setDiaSemana]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    fetcher.submit(event.target, { method: "post" });
  };

  useEffect(() => {
    if (fetcher.data) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000); // El mensaje desaparecerá después de 5 segundos

      return () => clearTimeout(timer); // Limpiar el temporizador al desmontar el componente
    }
  }, [fetcher.data]);

  return (
    <Page>
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <fetcher.Form method="post" action="/app/proxy" onSubmit={handleSubmit}>
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"  º
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
                <input type="hidden" name="diaSemana" value={diaSemana[0]} />
              </BlockStack>
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
            <Button submit={true}>Save</Button>
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
