import {
  Box,
  Card,
  InlineGrid,
  Text,
  BlockStack,
  TextField,
  Button,
  OptionList,
  Page,
  Popover,
  Icon,
  DatePicker
} from "@shopify/polaris";
import {
  CalendarIcon
} from '@shopify/polaris-icons';
import { useState, useCallback, useEffect, useRef } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import * as fs from 'node:fs';


export async function loader() {
  try {
    const data = fs.readFileSync('./data.json', 'utf8'); 
    const jsonData = JSON.parse(data);
    
    return json({ hora: jsonData.hora, diaSemana: jsonData.diaSemana, vacaciones: jsonData.vacaciones }); // Agrega las vacaciones aquí
  } catch (err) {
    console.error("Error al leer el archivo JSON:", err);
    return json({ hora: '', diaSemana: '', vacaciones: [] }); // Valores por defecto
  }
}


export default function SettingsPage() {

  const data = useLoaderData();
  const { hora, diaSemana, vacaciones } = data;
  //const vacacionesArray = Object.values(vacaciones);
  //const prueba = vacaciones.map(date => new Date(date))
  
  const fetcher = useFetcher();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState(vacaciones);

  const [formState, setFormState] = useState({ hora });
  const [selectedDiaSemana, setSelectedDiaSemana] = useState([diaSemana]);
  const [showMessage, setShowMessage] = useState(false);
  const [showMessageDate, setShowMessageDate] = useState(false);

  const [{ month, year }, setDate] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });
  const [visible, setVisible] = useState(false);

  const formattedValueArray = selectedDates
  const formattedValue = selectedDate.toLocaleDateString('es-ES'); // Formato YYYY-MM-DD
  const datePickerRef = useRef(null);
  function isNodeWithinPopover(node) {
    return datePickerRef?.current
      ? nodeContainsDescendant(datePickerRef.current, node)
      : false;
  }

  function handleInputValueChange() {
    console.log("handleInputValueChange");
  }
  function handleOnClose({ relatedTarget }) {
    setVisible(false);
  }
  function handleMonthChange(month, year) {
    setDate({ month, year });
  }
  function handleDateSelection({ end: newSelectedDate }) {
    if(selectedDates.includes(newSelectedDate.toLocaleDateString('es-ES'))){
      setShowMessageDate(true);
      setTimeout(() => {
        setShowMessageDate(false);
      }, 5000);
      return
    }
    const newSelectedDateFormatted = newSelectedDate.toLocaleDateString('es-ES');
    setSelectedDates([...selectedDates, newSelectedDateFormatted]);
    // setSelectedDate(newSelectedDate);
    // setVisible(false);
  }

  // Actualizar el estado cuando los datos del loader cambian
  useEffect(() => {
    setFormState({ hora });
    setSelectedDiaSemana([diaSemana]); // Actualiza el estado cuando los datos cambien
  }, [diaSemana, hora]);

  useEffect(() => {
    if (selectedDate) {
      setDate({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
      });
    }
  }, [selectedDate]);

  useEffect(() => {
    console.log("selectedDates:", selectedDates);
  }, [selectedDates]);

  useEffect(() => {
    if (fetcher.data) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [fetcher.data]);

  const handleOptionChange = useCallback((selected) => {
    setSelectedDiaSemana(selected);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetcher.submit(event.target, { method: "post" });
  };

  

  function handleOnClose({ relatedTarget }) {
    setVisible(false);
  }

  function handleRemoveValue(value) {
    console.log(value)
    setSelectedDates(selectedDates.filter((date) => date !== value));
  }

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
          <br></br>
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
            <br></br>
            <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
              <Box as="section" paddingInlineStart={{ xs: 400, sm: 0 }} 
                paddingInlineEnd={{ xs: 400, sm: 0 }}
              >
                <BlockStack gap="400">
                  <Text as="h3" variant="headingMd">
                        Vacaciones
                  </Text>
                  <Text as="p" variant="bodyMd">
                    ¿Que días quieres marcar como no disponibles?
                  </Text>
                </BlockStack>
              </Box>
              <Card roundedAbove="sm">
                <Box>
                  <BlockStack gap="400">
                    <div style={{ display: "flex", flexWrap: "wrap", 
                      gap: "10px", width: "100%", overflow: "hidden" }}>
                      {selectedDates.map((value, index) => (
                        <div style={{ display: "flex", 
                          flexDirection: "row", marginRight: "20px", 
                          gap: "5px", border: "1px solid black", padding: "5px",
                          borderRadius: "5px", borderColor: "gray"
                        }}>
                          <p>
                            {value}
                          </p>
                          <p onClick={() => handleRemoveValue(value)} 
                          style={{ cursor: "pointer" }}>X</p>
                        </div>
                      ))}
                      
                    </div>
                    <Popover
                      active={visible}
                      autofocusTarget="none"
                      preferredAlignment="left"
                      fullWidth
                      preferInputActivator={false}
                      preferredPosition="below"
                      preventCloseOnChildOverlayClick
                      onClose={handleOnClose}
                      activator={
                        <TextField
                          role="combobox"
                          label={"Selecciona las fechas que no se pueden realizar pedidos"}
                          prefix={<Icon source={CalendarIcon} />}
                          value={formattedValue}
                          onFocus={() => setVisible(true)}
                          onChange={handleInputValueChange}
                          autoComplete="off"
                        />
                      }
                    >
                      <Card ref={datePickerRef}>
                      {showMessageDate ? <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>Fecha ya seleccionada</p> : null}
                        <DatePicker
                          month={month}
                          year={year}
                          selected={selectedDate}
                          onMonthChange={handleMonthChange}
                          onChange={handleDateSelection}
                        />
                      </Card>
                    </Popover>
                  
                  </BlockStack>
                </Box>
                </Card>
              </InlineGrid>
            <br></br>
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