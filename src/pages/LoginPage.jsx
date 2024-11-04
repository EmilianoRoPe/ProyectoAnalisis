import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import imgFormulario from '../img/piramides-teotihuacan.webp';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { handleLogin, successGoogleHandler, errorGoogleHandler, responseFacebook } from '../pagesHandlers/login-handler';
import { validateEmail, validatePasswordNotEmpty } from '../schemas/validacionLogin';

function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setCorreo(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      correo: validateEmail(value),
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setContraseña(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      contraseña: validatePasswordNotEmpty(value),
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const emailError = validateEmail(correo);
    const passwordError = validatePasswordNotEmpty(contraseña);

    if (!emailError && !passwordError) {
      handleLogin(e, correo, contraseña);
    } else {
      setErrors({
        correo: emailError,
        contraseña: passwordError,
      });
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: successGoogleHandler,
    onError: errorGoogleHandler,
  });

  return (
    <div className='vh-100 vw-100'>
      <Navbar
        showingresa={false}
        showRegistrate={true}
        transparentNavbar={false}
        lightLink={false}
        staticNavbar={false}
      />

      <div className='login-background vh-100 vw-100 d-flex justify-content-center align-items-center'>
        <div className='login-box d-flex flex-column rounded'>
          <div className='close-icon' onClick={handleHomeClick}>✕</div>

          <div className='login-content d-flex'>
            <div className='login-left'>
              <img src={imgFormulario} alt='Login background' className='login-left-image' />
              <div className='login-left-overlay text-start d-flex flex-column justify-content-center pb-5'>
                <h4 className='fw-semibold fs-2 fontMontserrat'>Bienvenido a la aventura que cambiará tu historia</h4>
                <small className='fw-light'>Únete a una comunidad vibrante donde florece la creatividad, se forjan conexiones y cada paso te acerca a experiencias inolvidables. Sumérgete y encuentra la inspiración.</small>

                <div className='photo-credit'>
                  Fotografía de
                  <p><span className='fw-bold'>Nombre del Fotógrafo</span></p>
                </div>
              </div>
            </div>

            <div className='login-right d-flex flex-column justify-content-center'>
              <h3 className='fw-normal mb-3 pb-3 fontMontserrat fw-semibold'>Iniciar sesión</h3>

              <form className='login-form' onSubmit={handleFormSubmit}>
                <div className='mb-3'>
                  <label htmlFor='logInputEmail' className='form-label'>Correo electrónico</label>
                  <input
                    type='text'
                    className='form-control'
                    id='logInputEmail'
                    value={correo}
                    onChange={handleEmailChange}
                  />
                  {errors.correo && <p className="error-text">{errors.correo}</p>}
                </div>

                <div className='mb-3'>
                  <label htmlFor='logInputPassword' className='form-label'>Contraseña</label>
                  <input
                    type='password'
                    className='form-control'
                    id='logInputPassword'
                    value={contraseña}
                    onChange={handlePasswordChange}
                  />
                  {errors.contraseña && <p className="error-text">{errors.contraseña}</p>}
                </div>

                <div className='pt-1 mb-4 mt-4'>
                  <button type='submit' className='btn btn-primary'>Iniciar sesión</button>
                </div>

                <div className='mb-3'>
                  <small><Link className='text-muted' to='/forgot-password'>¿Olvidaste tu contraseña?</Link></small>
                </div>

                <div className='text-center mt-4 mb-5'>
                  <p>o inicia sesión con:</p>
                  <button type='button' className='btn btn-link btn-floating mx-1' onClick={() => handleGoogleLogin()}>
                    <i className='bi bi-google'></i>
                  </button>
                  <FacebookLogin
                    appId="1276060800080687"
                    autoLoad={false}
                    callback={responseFacebook}
                    render={(renderProps) => (
                      <button type="button" className="btn btn-link btn-floating mx-1" onClick={renderProps.onClick}>
                        <i className="bi bi-facebook"></i>
                      </button>
                    )}
                  />
                </div>

                <p>¿No tienes una cuenta? <Link to='/register' className='fontRosaMexicano'>Regístrate aquí</Link></p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer showIncorporaLugar={false} />
    </div>
  );
}

export default LoginPage;