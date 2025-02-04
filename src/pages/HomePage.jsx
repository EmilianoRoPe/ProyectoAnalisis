import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import NavBarHome from '../components/NavBar';
import Footer from '../components/Footer';
import { useLoadScript } from "@react-google-maps/api";
import Mapa from '../components/Mapa';
import PreguntaRegistro from '../components/preguntaRegistro';
import { useNavigate } from 'react-router-dom';
import ButtonsMod from '../components/ButtonsMod';
import { isLogged } from '../schemas/isLogged';
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import { ThemeProvider } from '@mui/material/styles';


// import css
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/HomePage.css';

import CatHome from '../components/categories/CategoryHome';
import CardAlcaldia from '../components/home/CardAlcaldia';
import datosTarjetas from '../components/home/datosTarjetas';

const libraries = ["places"];
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

const HomePage = () => {

  const [id, setId] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);

  const navigate = useNavigate();

  const handlePlacePageClick = () => {
    navigate('/generar-itinerario');
  };

  const handlePlaceAlcaldiasClick = () => {
    navigate('/alcaldias');
  }

  useEffect(() => {
    const fetchLoginStatus = async () => {
      try {
        const loggedIn = await isLogged();
        setIsRegistered(loggedIn.logged);
        if(loggedIn.logged) {
          const idLocal = loggedIn.data.id;
          setId(idLocal);
        }
        else
          console.log('El usuario no ha iniciado sesión');
      } catch (error) {
        console.log('El usuario no ha iniciado sesión', error);
      }
    };

    fetchLoginStatus();
  }, []);

  const settings = {
    className: "center",
    dots: true,
    centerMode: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    centerPadding: "15%",
    slidesToShow: 1,
    speed: 1000,
    responsive: [{
      breakpoint: 1300,
      settings: {
        centerPadding: "20px",
        slidesToShow: 1,
        fade: true,
      }
    }]
  };

  //HACER QUE LAS TARJETAS SEAN ALEATORIAS
  //hace un arreglo con las tarjetas y las desordena para que cuando se muestren en la página sean aleatorias
  useEffect(() => {
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const shuffledCards = shuffleArray([...datosTarjetas]);
    setSelectedCards(shuffledCards.slice(0, 4));
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  if (loadError) return <div>Error al cargar Google Maps</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <ThemeProvider theme={ThemeMaterialUI}>
    <div>
      <NavBarHome
        showingresa={true}
        showRegistrate={true}
        transparentNavbar={false}
        lightLink={false} />

      <section className='home'>
        <div className='home-text'>
          <h5 className='home-h5'>Planea tu próximo <strong>viaje</strong> con nosotros a la</h5>
          <h1 className='home-h1'>Ciudad de México</h1>
          <ButtonsMod
            variant='principal'
            textCont='Comienza ahora'
            clickEvent={handlePlacePageClick}
          />
        </div>
      </section>

      <section className='cardAlcaldias'>
        <h2 className='home-h2'>Conoce las alcaldías de la CDMX</h2>
        <p className='home-p'>Infinitas posibilidades x 16 alcaldías</p>

        <div className='container slider'>
          <Slider {...settings}>
            {selectedCards.map((datos) => (
              <CardAlcaldia
                key={datos.id}
                nombreAlcaldia={datos.nombreAlcaldia}
                nombreLugar={datos.nombreLugar}
                nombreImagen={datos.nombreImagen}
              />
            ))}
          </Slider>
        </div>

        {/* Agregar boton de ver mas que redirige a ver todas las alcaldias*/}
        <div className='alc-vermas'>
          <ButtonsMod
            variant='principal'
            textCont='Ver más'
            clickEvent={handlePlaceAlcaldiasClick}
          />
        </div>
      </section>




      {/* SECCIÓN DE CESAR - EXPLORAR CATEGORÍAS*/}
      <br></br>
      <section>
        <div className='home-text'>
          <h3>
            <strong>
              {isRegistered
                ? 'Lugares que te podrían interesar'
                : 'Explora nuestras categorías'}
            </strong>
          </h3>
        </div>
        <CatHome
          isLogged={isRegistered}
          id={id}
        />
      </section>

      {/* SECCIÓN DE CESAR - EXPLORAR LUGARES CERCANOS */}

      <section>
        <div className='mapa'>
          <h2>¡Sorpréndete con lo que te rodea!</h2>
          <Mapa isLoaded={isLoaded} />
        </div>
      </section>

      <br></br>

      <section>
        <PreguntaRegistro />
      </section>
      <br></br>

      <Footer
        showIncorporaLugar={false} />
    </div>
    </ThemeProvider>
  );
};

export default HomePage;