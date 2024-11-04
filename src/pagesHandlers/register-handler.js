import axios from 'axios';
import Swal from 'sweetalert2';

const enviarCorreoVerificacion = async (nombre, correo) => {
  try {
    const response = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: nombre, 
        email: correo 
      })
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message); // Muestra el mensaje de confirmación
    } else {
      alert('Hubo un error al enviar el correo de verificación');
    }
  } catch (error) {
    console.error('Error al enviar la solicitud de verificación:', error);
  }
};

const handleRegistro = async (e, nombre, correo, contraseña, contraseña2) => {
  e.preventDefault();
  // setError('');

  if (!nombre || !correo || !contraseña || !contraseña2) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Todos los campos son obligatorios',
      timer: 2000,
      showConfirmButton: false
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, ingrese un correo electrónico válido',
      timer: 2000,
      showConfirmButton: false
    });
    return;
  }
  
  if(contraseña != contraseña2) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Las contraseñas no coinciden',
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  try {
    
    const response = await axios.post('http://localhost:3001/registro', {
      nombre,
      correo,
      contraseña,
    });
    console.log(response.data);

    if(response.data !== 'El correo ya está registrado.'){
      await enviarCorreoVerificacion(nombre, correo);
      Swal.fire({
        icon: 'success',
        title: 'Registro iniciado correctamente',
        text: 'El siguiente paso es aceptar el correo de confirmación.',
        timer: 3000,
        showConfirmButton: false,
        willClose: () => {
          window.location.href = '/'
        }
      });
    }
    // navigate('/');
  } catch (err) {
    const errorMsg = err.response?.data?.error || 'Error de conexión';
    // setError('Error al registrar usuario: ' + errorMsg);
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Inicio de sesión fallido',
      text: 'Algo falló en la solicitud',
      timer: 2000,
      showConfirmButton: false
    });
  }
};

const handleRegistroGoogle = async (correo, nombre, imagen, token) => {
  try {
    const response = await axios.post('http://localhost:3001/registroGoogle', {
      correo,
      nombre,
      imagen,
      token,
    });

    console.log(response);

    if(response.data !== 'El correo ya está registrado.'){
      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: '¡Bienvenido! Has registrado tu cuenta de Google correctamente.',
        timer: 2000,
        showConfirmButton: false,
        willClose: () => {
          window.location.href = '/'
        }
      })
    } else {
      console.log("OwO")
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      console.error("Error:", error.response.data.error);
      Swal.fire({
        icon: 'error',
        title: 'Inicio de sesión fallido',
        text: error.response.data.error,
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      console.error("Error al intentar iniciar sesión:", error);
      Swal.fire({
        icon: 'error',
        title: 'Inicio de sesión fallido',
        text: 'Algo falló en la solicitud',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }
};

// VERIFICACIÓN CON GOOGLE
const successGoogleHandler = async (tokenResponse) => {
  //console.log('Token de Google:', tokenResponse);
  const accessToken = tokenResponse.access_token;
  //console.log('Token de acceso:', accessToken);
  
  // Llama a Google UserInfo API para obtener los datos del usuario
  try {
    const userInfo = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    //console.log('Información del usuario:', userInfo.data);

    await handleRegistroGoogle(
      userInfo.data.email,
      userInfo.data.name,
      userInfo.data.picture,
      userInfo.data.sub);

  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
  }
};

const errorGoogleHandler = () => {
  console.log('Error al autenticar con Google');
};

// VERIFICACIÓN CON FACEBOOK
const responseFacebook = (response) => {
  console.log(response); // Maneja la respuesta de autenticación aquí
};

// Exports
export {
  handleRegistro,
  successGoogleHandler,
  errorGoogleHandler,
  responseFacebook
};
