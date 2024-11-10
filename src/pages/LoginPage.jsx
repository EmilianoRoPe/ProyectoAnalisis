// modulos importados
import React from 'react';
import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Container, Stack, Box, Typography, Input } from '@mui/material';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';

// modulos de iconos
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import CloseIcon from '@mui/icons-material/Close';

// componentes importados
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import LeftImage from '../components/login/LeftImage';

// estilos importados
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import '../css/LoginPage.css';

// elementos de la página
import imgTeotihuacan from '../img/piramides-teotihuacan.webp';
import fuenteTlaloc from '../img/PlacePage/place-img-fuentetlaloc.jpg';
import casaLeon from '../img/PlacePage/place-img-casadeleon.jpg';

function LoginPage() {
  // validacion de correo
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [correoReglas, setCorreoReglas] = useState({
    sinEspacios: false,
    arrobaCaracteres: false,
    dominioConPunto: false,
  });

  const handleCorreoChange = (e) => {
    const correo = e.target.value;
    setCorreo(correo);
    console.log(correo);

    // Validar reglas
    setCorreoReglas({
      sinEspacios: /^[^\s]+$/.test(correo),
      arrobaCaracteres: /^[^@]+@[^@]+$/.test(correo),
      dominioConPunto: /@[^@]+\.[^@]+$/.test(correo),
      noVacio: correo.length > 0,
    });
  };

  const handleContraseñaChange = (e) => {
    setContraseña(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Si ambos campos están llenos, puedes realizar tu lógica de inicio de sesión aquí.
    if (correo && contraseña) {
      // Lógica de inicio de sesión...
      console.log("Iniciando sesión...");
    }
  };


  // visibilidad de la contraseña
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  // redireccionamiento a home
  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate('/');
  };


  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Box className='vh-100 vw-100 login-background'>
        <Navbar
          showingresa={false}
          showRegistrate={false}
          transparentNavbar={false}
          lightLink={false}
          staticNavbar={false}
        />

        <Container maxWidth='md' disableGutters className='my-5' sx={{ borderRadius: '6px', overflow: 'hidden' }}>
          <Grid container>

            {/* lado izquiero imagen con texto */}
            <Grid size={6}>
              <LeftImage
                imageUrl={casaLeon}
                nombreFotografo='Brandon Peso Pluma' />
            </Grid>

            {/* lado derecho formulario */}
            <Grid size={6}>
              <Box className='login-right-form bg-light'>
                <Box className='mx-3 pb-5 pt-3'>
                  <Box className='d-flex justify-content-end'>
                    <IconButton aria-label="cerrar" onClick={handleHomeClick}>
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  <Box className='mx-4'>
                    <Typography variant='h4' className='fw-bold'>Iniciar sesión</Typography>
                    <Typography variant='subtitle1'>Ingresa tus datos para continuar</Typography>

                    <form className='login-form' onSubmit={handleLogin}>
                      <Box className='my-4'>
                        <TextField
                          hiddenLabel
                          id="log-correo"
                          label="Correo electrónico"
                          placeholder='correo@ejemplo.com'
                          size="small"
                          type='email'
                          onChange={handleCorreoChange}
                          fullWidth
                          // errores si no cumple con las reglas
                          error={formSubmitted && !correo}
                          helperText={formSubmitted && !correo ? "El correo no puede estar vacío" : ""}

                        />
                        <Typography variant="body2" color="textSecondary" className='mb-2 ms-2 fw-medium'>
                          El correo debe cumplir con las siguientes reglas:
                        </Typography>
                        <ul>
                          <li className={`lo_pa-rule-input fw-medium ${correoReglas.noVacio ? 'text-success fw-semibold' : ''}`}>No debe estar vacío.</li>
                          <li className={`lo_pa-rule-input fw-medium ${correoReglas.sinEspacios ? 'text-success fw-semibold' : ''}`}>No debe contener espacios.</li>
                          <li className={`lo_pa-rule-input fw-medium ${correoReglas.arrobaCaracteres ? 'text-success fw-semibold' : ''}`}>Debe tener al menos un carácter antes y después del símbolo @.</li>
                          <li className={`lo_pa-rule-input fw-medium ${correoReglas.dominioConPunto ? 'text-success fw-semibold' : ''}`}>Debe incluir un punto en la parte del dominio (por ejemplo, .com, .net).</li>
                        </ul>

                      </Box>

                      <Box className='my-4'>
                        <FormControl variant="outlined" size="small" fullWidth>
                          <InputLabel htmlFor="log-password">Contraseña</InputLabel>
                          <OutlinedInput
                            id="log-password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  onMouseUp={handleMouseUpPassword}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Contraseña"
                          />
                        </FormControl>
                      </Box>


                      <Button variant="contained" type="submit">
                        Iniciar sesión
                      </Button>

                      <Link href="#" underline="hover">
                        <Typography variant='subtitle2' color='dark' className='mt-4 pb-2' sx={{ fontSize: '1rem' }}>¿Olvidaste tu contraseña?</Typography>
                      </Link>

                      <Box className='my-4 d-flex flex-column align-items-center justify-content-center'>
                        <Typography variant='subtitle2' sx={{ fontSize: '1rem' }}>O inicia sesión con:</Typography>
                        <Box className='d-flex justify-content-center'>
                          <IconButton aria-label="google" color='google'>
                            <GoogleIcon />
                          </IconButton>
                          <IconButton aria-label="facebook" color='facebook'>
                            <FacebookRoundedIcon />
                          </IconButton>
                        </Box>
                      </Box>

                    </form>

                    <Box className='mt-5'>
                      <Typography variant='body1'>¿No tienes una cuenta? <Link href="/register" underline="hover">Regístrate aquí</Link></Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>

          </Grid>
        </Container>

        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default LoginPage