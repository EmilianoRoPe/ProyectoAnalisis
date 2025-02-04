import React, { useState, useEffect, useRef } from 'react';
import '../../css/Perfil.css';

import { Stack, Card, Typography, CardHeader, CardContent, Divider, TextField, Select, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ButtonsMod from '../ButtonsMod';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
// íconos
import {Info as InfoIcon, Cake as CakeIcon, MailOutline as MailOutlineIcon, Badge as BadgeIcon, Transgender as TrasgenderIcon, BrunchDining as BrunchDiningIcon, Accessible as AccessibleIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';

import AlertD from '../alert';
import { handleGuardarDatos } from '../../pagesHandlers/user_handler';
import img from '../../img/Itinerary/turist-for-another.jpg';
import alertImgSuccess from '../../img/alertas/success.webp';

function InformacionPersonal({id, correoElectronico, nombre, apellido, fechaNacimiento, genero, preferenciaAlimenticia, discapacidadMotriz}) {

  const [original, setOriginal] = useState({
    correoElectronico,
    nombre,
    apellido,
    fechaNacimiento,
    genero,
    preferenciaAlimenticia,
    discapacidadMotriz,
  });

  // para editar información personal
  const [ isEditing, setIsEditing] = useState(false);
  const [ formData, setFormData ] = useState({
      correoElectronico,
      nombre,
      apellido,
      fechaNacimiento,
      genero,
      preferenciaAlimenticia,
      discapacidadMotriz,
  });

  // Para la validación del nombre
  const [nombreError, setNombreError] = useState(false);
  const [nombreHelperText, setNombreHelperText] = useState('El nombre debe empezar con una letra mayúscula y tener al menos dos letras válidas');
  // Para la validación del apellido
  const [apellidoError, setApellidoError] = useState(false);
  const [apellidoHelperText, setApellidoHelperText] = useState('El apellido debe empezar con una letra mayúscula y tener al menos dos letras válidas');
  // Para la validación de fecha de nacimiento
  const [fechaError, setFechaError] = useState(false);
  const [fechaHelperText, setFechaHelperText] = useState('La edad debe ser de entre 18 a 65 años');
  // modal
  const alertRef = useRef();
  const alertRefCambios = useRef();
  const alertRefConfirmar = useRef();

  const handleModalCambios = async () => {
    try {
      // Llamar a la función para guardar los datos
      const updatedDatos = await handleGuardarDatos(
        id, // Asume que formData contiene el ID del usuario
        formData.nombre,
        formData.apellido,
        formData.fechaNacimiento,
        formData.genero,
        formData.preferenciaAlimenticia,
        formData.accesibilidad === 'No' ? '0' : '1'
      );
      updatedDatos.correoElectronico = original.correoElectronico;
      // Convertir la cadena a un objeto Date
      const fecha = new Date(updatedDatos.fechaNacimiento);

      // Formatear a DD-MM-YYYY
      const dia = String(fecha.getDate()).padStart(2, '0'); // Asegurar 2 dígitos
      const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
      const anio = fecha.getFullYear();

      // Combinar el formato
      const fechaFormateada = `${dia}-${mes}-${anio}`;
      updatedDatos.fechaNacimiento = fechaFormateada;
      console.log("updated", updatedDatos);
      
      if (updatedDatos) {
        setOriginal(updatedDatos);
        handleClickOpen(3);
        //Swal.fire("¡Guardado!", "", "success");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      Swal.fire("Error", "No se pudieron guardar los datos", "error");
    } 
  }


  const handleClickOpen = (modalId) => {
    if (modalId === 1 && alertRef.current) {
      alertRef.current.handleClickOpen();
    } else if (modalId === 2 && alertRefCambios.current) {
      alertRefCambios.current.handleClickOpen();
    } else if(modalId === 3 && alertRefConfirmar.current) {
      alertRefConfirmar.current.handleClickOpen();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, }));
    // validación nombre completo
    if (name === 'nombre') {
      validarNombre(value);
    } else if (name === 'apellido') {
      validarApellido(value);
    }
  }

  useEffect(() => {
    let accesibilidad = 'No';
    if(discapacidadMotriz === "1") {
      accesibilidad = 'Si';
    }
    setOriginal({
      correoElectronico,
      nombre,
      apellido,
      fechaNacimiento,
      genero,
      preferenciaAlimenticia,
      accesibilidad,
    });
    setFormData({
      correoElectronico,
      nombre,
      apellido,
      fechaNacimiento,
      genero,
      preferenciaAlimenticia,
      accesibilidad,
    });
  }, [correoElectronico, nombre, apellido, fechaNacimiento, genero, preferenciaAlimenticia, discapacidadMotriz]);

  const handleEdit = () => {
      setIsEditing((prev) => !prev);
      
      if (!formData.nombre) {
        setNombreError(false);
        setNombreHelperText('El nombre debe empezar con una letra mayúscula y tener al menos dos letras válidas');
      }
      if (!formData.apellido) {
        setApellidoError(false);
        setApellidoHelperText('El nombre debe empezar con una letra mayúscula y tener al menos dos letras válidas');
      }
  }

  const handleSave = async () => {
    let valid = true;
  
    if (formData.nombre || nombreError) {
      if (!validarNombre(formData.nombre)) valid = false;
    }
    if (formData.apellido || apellidoError) {
      if (!validarApellido(formData.apellido)) valid = false;
    }

    if(!valid) {
      handleClickOpen(1);
    }
    
    if (valid) {
      console.log('Datos guardados: ', formData);
      if( formData.nombre !== original.nombre 
          || formData.apellido != original.apellido 
          || formData.fechaNacimiento != original.fechaNacimiento
          || formData.genero !== original.genero
          || formData.preferenciaAlimenticia !== original.preferenciaAlimenticia
          || formData.accesibilidad !== original.accesibilidad
        ) {
        console.log("?")
        handleClickOpen(2);
        // Swal.fire({
        //   title: "¿Deseas guardar los cambios?",
        //   showDenyButton: true,
        //   showCancelButton: true,
        //   confirmButtonText: "Guardar",
        //   denyButtonText: `No guardar`,
        // }).then(async (result) => {
        //   if (result.isConfirmed) {
        //     try {
        //       // Llamar a la función para guardar los datos
        //       const updatedDatos = await handleGuardarDatos(
        //         id, // Asume que formData contiene el ID del usuario
        //         formData.nombre,
        //         formData.apellido,
        //         formData.fechaNacimiento
        //       );
        //       updatedDatos.correoElectronico = original.correoElectronico;
        //       // Convertir la cadena a un objeto Date
        //       const fecha = new Date(updatedDatos.fechaNacimiento);

        //       // Formatear a DD-MM-YYYY
        //       const dia = String(fecha.getDate()).padStart(2, '0'); // Asegurar 2 dígitos
        //       const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
        //       const anio = fecha.getFullYear();

        //       // Combinar el formato
        //       const fechaFormateada = `${dia}-${mes}-${anio}`;
        //       updatedDatos.fechaNacimiento = fechaFormateada;
        //       console.log("updated", updatedDatos);
              
        //       if (updatedDatos) {
        //         setOriginal(updatedDatos);
        //         Swal.fire("¡Guardado!", "", "success");
        //         setIsEditing(false);
        //       }
        //     } catch (error) {
        //       console.error("Error al guardar los datos:", error);
        //       Swal.fire("Error", "No se pudieron guardar los datos", "error");
        //     }
        //   } else if (result.isDenied) {
        //     setFormData(original); // Restablecer valores originales
        //     Swal.fire("Los cambios no fueron guardados", "", "info");
        //     setIsEditing(false); // Salir del modo edición
        //   }
        // });
      }
      else {
        setIsEditing(false);
      }
    } else {
      console.log('Formulario no válido');
    } 
  }

  // Validación - Nombre
  const validarNombre = (nombre) => {
    const trimmedNombre = nombre.trim();
  
    // Si está vacío, no se muestra un error
    if (trimmedNombre === '') {
      setNombreError(true);
      setNombreHelperText('Este campo es obligatorio');
      return false;
    }
  
    // Si pone otros caracteres inválidos
    if (/[^a-zA-ZÀ-ÿ\s]/.test(trimmedNombre)) {
      setNombreError(true);
      setNombreHelperText('El campo contiene caracteres no permitidos');
      return false;
    }
  
    // Para que empiece con una letra mayúscula válida
    if (!/^[A-ZÀ-Ÿ]/.test(trimmedNombre)) {
      setNombreError(true);
      setNombreHelperText('El nombre debe empezar con una letra mayúscula');
      return false;
    }
  
    // Número de caracteres (entre 2 y 60)
    if (trimmedNombre.length < 2 || trimmedNombre.length > 20) {
      setNombreError(true);
      setNombreHelperText('El nombre debe tener entre 2 y 20 caracteres');
      return false;
    }

    // Que el nombre tenga al menos una letra válida además de la inicial
    if (!/^[A-ZÀ-Ÿ][a-zA-ZÀ-ÿ\s]{1,}$/.test(trimmedNombre)) {
      setNombreError(false); // Información, no error
      setNombreHelperText('Falta al menos una letra válida para el nombre');
      return false;
    }
  
    // Si todo es válido
    setNombreError(false);
    setNombreHelperText('');
    return true;
  }
  
  // Validación - Apellido
  const validarApellido = (apellido) => {
    const trimmedApellido = apellido.trim();
  
    // Si está vacío, no se muestra un error
    if (trimmedApellido === '') {
      setApellidoError(true);
      setApellidoHelperText('Este campo es obligatorio');
      return false;
    }
  
    // Si pone otros caracteres inválidos
    if (/[^a-zA-ZÀ-ÿ\s]/.test(trimmedApellido)) {
      setApellidoError(true);
      setApellidoHelperText('El campo contiene caracteres no permitidos');
      return false;
    }
  
    // Para que empiece con una letra mayúscula válida
    if (!/^[A-ZÀ-Ÿ]/.test(trimmedApellido)) {
      setApellidoError(true);
      setApellidoHelperText('El apellido debe empezar con una letra mayúscula');
      return false;
    }
  
    // Número de caracteres (entre 2 y 60)
    if (trimmedApellido.length < 2 || trimmedApellido.length > 20) {
      setApellidoError(true);
      setApellidoHelperText('El apellido debe tener entre 2 y 20 caracteres');
      return false;
    }

    // Que el nombre tenga al menos una letra válida además de la inicial
    if (!/^[A-ZÀ-Ÿ][a-zA-ZÀ-ÿ\s]{1,}$/.test(trimmedApellido)) {
      setApellidoError(false); // Información, no error
      setApellidoHelperText('Falta al menos una letra válida para el apellido');
      return false;
    }
  
    // Si todo es válido
    setApellidoError(false);
    setApellidoHelperText('');
    return true;
  }

  // Validación - Fecha de nacimiento
  const handleFechaNacimientoChange = (nuevaFecha) => {
    if (!nuevaFecha) {
      setFechaError(true);
      setFechaHelperText('La edad debe ser de entre 18 a 65 años');
      setFormData((prev) => ({
        ...prev,
        fechaNacimiento: null,
      }))
      return;
    }

    const fechaNacimientoActual = dayjs();
    const edad = fechaNacimientoActual.diff(nuevaFecha, 'year');

    if (edad < 18 || edad > 65) {
      setFechaError(true);
      setFechaHelperText('Edad fuera del rango permitido (18 a 65 años)')
    } else {
      setFechaError(false);
      setFechaHelperText('');
    }

    setFormData((prev) => ({
      ...prev,
      fechaNacimiento: nuevaFecha.format('DD-MM-YYYY'),
    }));
  }

  const isFormValid = () => {
    return !nombreError || !apellidoError || !fechaError;
  }

  const handleSexoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, }));
  }

  const handleAlimenticiaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, }));
  }

  const handleAccesibilidadChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, }));
  }

    return (
      <Card
        className='perfil-usuario-card-informacion-personal'
        sx={{ padding: '1%', }}>
        <CardHeader
            avatar={
              <InfoIcon sx={{ backgroundColor: '#E4007C', color: '#FFF', borderRadius: '50%' }} />
            }
            title='Información Personal'
            titleTypographyProps={{
              sx: {
                fontSize: '1.2rem',
                fontWeight: 'medium',
              }
            }}
            action={
              <ButtonsMod
                variant='secundario'
                textCont={isEditing ? 'Guardar' : 'Editar'}
                width='auto'
                height='auto'
                
                clickEvent={() => {
                  // Si no estás editando, cambia a editar
                  if (!isEditing) { 
                    setIsEditing(!isEditing);
                  }
                  // Si estás editando y el formato no es válido, no te deja guardar
                  else if (isEditing) {
                    handleSave();
                  }
                }}
              />
            }
          />

        <Divider variant='middle' sx={{borderColor: 'rgb(0 0 0)'}}/>
        { /* Card - Correo, Nombre, Apellido, FechaNacimiento, Género */}
        <CardContent>
            <Stack direction='column' sx={{width: '100%'}}>
              {/* Correo electrónico */}
              <Stack direction={{xs: 'row', sm: 'column'}} spacing={5} className='perfil-informacion-personal-items'>
                <Grid container sx={{width: '100%'}}>
                  <Grid size={{xs: 12, sm: 5, md: 4}}>
                      <Stack direction='row' spacing={1} className='perfil-informacion-personal-header-items'>
                        <MailOutlineIcon fontSize='small' sx={{ color: '#73C2FB' }} />
                        <Typography variant='body1' color='#777777'> 
                        Correo Electrónico
                        </Typography>
                      </Stack>
                  </Grid>              
                  <Grid size={{xs: 12, sm: 7, md: 8}} sx={{paddingTop: '0'}}>
                      {/* EDITAR CORREO ELECTRÓNICO */}
                        {isEditing ? (
                            <TextField
                              disabled
                              variant='outlined'
                              size='small'
                              name='correoElectronico'
                              value={formData.correoElectronico}
                              onChange={handleInputChange}
                              sx={{ width:'100%' }}
                            />
                        ) : (
                            <Typography variant='body1'>{formData.correoElectronico}</Typography>
                        )}
                  </Grid>
                </Grid>
              </Stack>
              { /* Nombre completo */}
              <Stack direction={{xs: 'row', sm: 'column'}} spacing={5} className='perfil-informacion-personal-items'>
                <Grid container sx={{width: '100%'}}>
                  <Grid size={{xs: 12, sm: 5, md: 4}}>
                      <Stack direction='row' spacing={1} className='perfil-informacion-personal-header-items'>
                        <BadgeIcon fontSize='small' sx={{ color: '#73C2FB' }} />
                        <Typography variant='body1' color='#777777'> 
                          Nombre
                        </Typography>
                      </Stack>
                  </Grid>              
                  <Grid size={{xs: 12, sm: 7, md: 8}} sx={{paddingTop: '0'}}>
                    { /* EDITAR NOMBRE */}
                    {isEditing ? (
                      <TextField
                        fullWidth
                        required
                        variant='outlined'
                        size='small'
                        name='nombre'
                        value={formData.nombre}
                        onChange={handleInputChange}
                        error={nombreError}
                        helperText={nombreHelperText}
                      />
                    ) : (
                    <Typography variant='body1'>{formData.nombre || 'Sin especificar'}</Typography>
                    )}
                  </Grid>
                </Grid>
              </Stack>
              { /* Apellido */}
              <Stack direction={{xs: 'row', sm: 'column'}} spacing={5} className='perfil-informacion-personal-items'>
                <Grid container sx={{width: '100%'}}>
                  <Grid size={{xs: 12, sm: 5, md:4}}>
                      <Stack direction='row' spacing={1} className='perfil-informacion-personal-header-items'>
                        <BadgeIcon fontSize='small' sx={{ color: '#73C2FB' }} />
                        <Typography variant='body1' color='#777777'> 
                          Apellido
                        </Typography>
                      </Stack>
                  </Grid>              
                  <Grid size={{xs: 12, sm: 7, md:8}} sx={{paddingTop: '0'}}>
                    { /* EDITAR APELLIDO */}
                    {isEditing ? (
                      <TextField
                        fullWidth
                        required
                        variant='outlined'
                        size='small'
                        name='apellido'
                        value={formData.apellido}
                        onChange={handleInputChange}
                        error={apellidoError}
                        helperText={apellidoHelperText}
                      />
                    ) : (
                    <Typography variant='body1'>{formData.apellido || 'Sin especificar'}</Typography>
                    )}
                  </Grid>
                </Grid>
              </Stack>
              { /* Fecha de nacimiento */}
              <Stack direction={{xs: 'row', sm: 'column'}} spacing={5} className='perfil-informacion-personal-items'>
                <Grid container sx={{width: '100%'}}>
                  <Grid size={{xs: 12, sm: 5, md: 4}}>
                      <Stack direction='row' spacing={1} alignItems='center'>
                        <CakeIcon fontSize='small' sx={{ color: '#73C2FB' }} />
                        <Typography variant='body1' color='#777777'> 
                        Fecha de Nacimiento
                        </Typography>
                      </Stack>
                  </Grid>              
                  <Grid size={{xs: 12, sm: 7, md: 8}} sx={{paddingTop: '0'}}>
                    {/* EDITAR FECHA DE NACIMIENTO */}
                    {isEditing ? (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>               
                            <DatePicker 
                              sx={{ width: '100%' }}
                              format='DD-MM-YYYY'
                              margin='dense'
                              value={formData.fechaNacimiento ? dayjs(formData.fechaNacimiento, 'DD-MM-YYYY') : null}
                              /* maxDate y minDate ayudan para solo seleccionar una fecha
                                 dentro del rango permitido (18 - 65 años) */
                              maxDate={dayjs().subtract(18, 'year')}
                              minDate={dayjs().subtract(65, 'year')}
                              onChange={handleFechaNacimientoChange}
                              slotProps={{
                                textField: {
                                  error: fechaError,
                                  helperText: fechaHelperText,
                                }
                              }}
                            />
                        </LocalizationProvider>
                    ) : (
                    <Typography variant='body1'>{formData.fechaNacimiento ? dayjs(formData.fechaNacimiento, 'DD-MM-YYYY').format('DD-MM-YYYY') : 'Sin especificar'}</Typography>
                    )}
                  </Grid>
                </Grid>
              </Stack>
              { /* Género */}
              <Stack direction={{xs: 'row', sm: 'column'}} spacing={5} className='perfil-informacion-personal-items'>
                <Grid container sx={{width: '100%'}}>
                  <Grid size={{xs: 12, sm: 5, md:4}}>
                    <Stack direction='row' spacing={1} className='perfil-informacion-personal-header-items'>
                      <TrasgenderIcon fontSize='small' sx={{ color: '#73C2FB' }} />
                      <Typography variant='body1' color='#777777'> 
                        Género
                      </Typography>
                    </Stack>
                  </Grid>              
                  <Grid size={{xs: 12, sm: 7, md:8}} sx={{paddingTop: '0'}}>
                    { /* EDITAR GÉNERO */}
                    {isEditing ? (
                        <Select
                          id='genero'
                          value={formData.genero}
                          name='genero'
                          onChange={handleSexoChange}
                          sx={{ width: '100%', height: '3rem' }}
                        >
                          <MenuItem value='Masculino'>Masculino</MenuItem>
                          <MenuItem value='Femenino'>Femenino</MenuItem>
                          <MenuItem value='Prefiero no decirlo'>Prefiero no decirlo</MenuItem>
                        </Select>
                    ) : (
                      <Typography variant='body1'>{formData.genero || 'Sin especificar'}</Typography>
                    )}
                  </Grid>
                </Grid>
              </Stack>
              { /* Preferencia Alimenticia */}
              <Stack direction={{xs: 'row', sm: 'column'}} spacing={5} className='perfil-informacion-personal-items'>
                <Grid container sx={{width: '100%'}}>
                  <Grid size={{xs: 12, sm: 5, md:4}}>
                    <Stack direction='row' spacing={1} className='perfil-informacion-personal-header-items'>
                      <BrunchDiningIcon fontSize='small' sx={{ color: '#73C2FB' }} />
                      <Typography variant='body1' color='#777777'> 
                        Preferencia Alimenticia
                      </Typography>
                    </Stack>
                  </Grid>              
                  <Grid size={{xs: 12, sm: 7, md:8}} sx={{paddingTop: '0'}}>
                    { /* EDITAR PREFERENCIA ALIMENTICIA */}
                    {isEditing ? (
                        <Select
                          id='preferenciaAlimenticia'
                          value={formData.preferenciaAlimenticia}
                          name='preferenciaAlimenticia'
                          onChange={handleAlimenticiaChange}
                          sx={{ width: '100%', height: '3rem' }}
                        >
                          <MenuItem value='Ninguno'>Ninguno</MenuItem>
                          <MenuItem value='Vegetariano(a)'>Vegetariano(a)</MenuItem>
                        </Select>
                    ) : (
                      <Typography variant='body1'>{formData.preferenciaAlimenticia || 'Sin especificar'}</Typography>
                    )}
                  </Grid>
                </Grid>
              </Stack>
              {/* Discapacidad Motriz  */}
              <Stack direction={{xs: 'row', sm: 'column'}} spacing={5} className='perfil-informacion-personal-items'>
                <Grid container sx={{width: '100%'}}>
                  <Grid size={{xs: 12, sm: 5, md:4}}>
                    <Stack direction='row' spacing={1} className='perfil-informacion-personal-header-items'>
                      <AccessibleIcon fontSize='small' sx={{ color: '#73C2FB' }} />
                      <Typography variant='body1' color='#777777'> 
                        Discapacidad Motriz
                      </Typography>
                    </Stack>
                  </Grid>              
                  <Grid size={{xs: 12, sm: 7, md:8}} sx={{paddingTop: '0'}}>
                    { /* EDITAR DISCAPACIDAD MOTRIZ */}
                    {isEditing ? (
                        <Select
                          id='discapacidadMotriz'
                          value={formData.accesibilidad}
                          name='accesibilidad'
                          onChange={handleAccesibilidadChange}
                          sx={{ width: '100%', height: '3rem' }}
                        >
                          <MenuItem value='Si'>Sí</MenuItem>
                          <MenuItem value='No'>No</MenuItem>
                        </Select>
                    ) : (
                      <Typography variant='body1'>{formData.accesibilidad || 'Sin especificar'}</Typography>
                    )}
                  </Grid>
                </Grid>
              </Stack>

            </Stack>
      
        </CardContent>

        <AlertD
          ref={alertRef}
          titulo="Rellena los campos"
          mensaje="Por favor, rellena correctamente todos los campos antes de continuar."
          imagen={img}
          boton2="Aceptar"
          onConfirm={handleClickOpen}
        />

        <AlertD
          ref={alertRefCambios}
          titulo="¿Desea guardar los cambios?"
          mensaje="Haz click en el botón de ACEPTAR para confirmar los cambios."
          imagen={img}
          boton1='Aceptar'
          boton2="Cancelar"
          onConfirm={handleModalCambios}
        />

        <AlertD
          ref={alertRefConfirmar}
          titulo="¡Cambios guardados!"
          mensaje="Tus cambios se han guardado correctamente."
          imagen={alertImgSuccess}
          boton2="Aceptar"
          onConfirm={handleClickOpen}
        />
      </Card>
      
    );
  }

  export default InformacionPersonal;