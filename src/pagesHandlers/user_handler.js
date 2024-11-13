import axios from 'axios';

const handleDeseados = async (id) => {

  try {
    const response = await axios.post('http://localhost:3001/user_deseados', { id });
    if(response.data.resultado.deseados) {
      const deseados = response.data.resultado.deseados;
      console.log(deseados);
      return deseados;
    }
    
  }
  catch (error) {
    // Mostrar el mensaje de error específico
    if (error.response && error.response.data && error.response.data.error) {
      console.error("Error:", error.response.data.error);
    } else {
      console.error("Error al intentar iniciar sesión:", error);
    }
  }

}

export {
  handleDeseados,
}