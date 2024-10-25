import React from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "line-awesome/dist/line-awesome/css/line-awesome.min.css";
import "./styles/LandingPage.scss"; // Asegúrate de tener este archivo con tus estilos personalizados.

const LandingPage = () => {
  return (
    <Container fluid className="p-0">
      <Container>
        <Row className="space-100">
          <Col lg={6} md={12} xs={12}>
            <div className="contents">
              <h2 className="head-title">Donde el tiempo encuentra su lugar</h2>
              <p>
                El portal de turnos diseñado para aquellos que buscan una
                gestión eficiente y sin estrés de sus citas y compromisos.
              </p>
            </div>
          </Col>
          <Col lg={6} md={12} xs={12} className="p-0">
            <div className="intro-img">
              <img
                src="/assets/img/intro.png"
                alt="Introducción"
                className="img-fluid"
              />
            </div>
          </Col>
        </Row>
      </Container>

      <section id="services" className="section">
        <Container>
          <Row>
            <Col lg={4} md={6} xs={12}>
              <div className="services-item text-center">
                <div className="icon">
                  <i className="las la-hourglass-half"></i>{" "}
                  {/* Icono de Line Icons */}
                </div>
                <h4>Ahorra tiempo</h4>
                <p>
                  Decí adiós a los olvidos y disfruta de un sistema que te ayuda
                  a maximizar tu productividad.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12}>
              <div className="services-item text-center">
                <div className="icon">
                  <i className="las la-smile-beam"></i>{" "}
                  {/* Icono de Line Icons */}
                </div>
                <h4>Calidad de Vida</h4>
                <p>
                  Con una gestión más eficiente de tu tiempo, podrás dedicarte a
                  lo que realmente importa.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12}>
              <div className="services-item text-center">
                <div className="icon">
                  <i className="las la-sliders-h"></i>{" "}
                  {/* Icono de Line Icons */}
                </div>
                <h4>Flexibilidad</h4>
                <p>
                  Personaliza tu oferta de turnos para que se adapten
                  perfectamente a tus necesidades.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sección de Plan de Negocio */}
      <section id="business-plan">
        <Container>
          <Row>
            <Col lg={6} md={12} className="pl-0 pt-70 pr-5">
              <div className="business-item-img">
                <img
                  src="/assets/img/business/business_img.png"
                  className="img-fluid"
                  alt="Business Plan"
                />
              </div>
            </Col>
            <Col lg={6} md={12} className="pl-4">
              <div className="business-item-info">
                <h3>Diseñado para pequeños y grandes emprendedores</h3>
                <p>
                  Dale a tu negocio la ventaja competitiva que merece.
                  <br />
                  Empezá hoy y descubrí cómo la gestión eficiente de turnos
                  puede transformar tu pequeño negocio en un ejemplo de éxito.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="features" className="section">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="features-text section-header text-center">
                <h2 className="section-title">Ventajas clave</h2>
              </div>
            </Col>
          </Row>

          <Row className="featured-bg">
            <Col lg={6} md={6} xs={12} className="p-0">
              <div className="feature-item featured-border1">
                <div className="feature-icon float-left">
                  <i className="las la-laptop"></i>{" "}
                  {/* Line Icon para laptop */}
                </div>
                <div className="feature-info float-left">
                  <h4>Gestión Simplificada</h4>
                  <p>
                    Con solo unos clics,
                    <br />
                    organiza tus turnos de manera rápida y efectiva.
                  </p>
                </div>
              </div>
            </Col>

            <Col lg={6} md={6} xs={12} className="p-0">
              <div className="feature-item featured-border2">
                <div className="feature-icon float-left">
                  <i className="las la-sync"></i>{" "}
                  {/* Line Icon para sincronización */}
                </div>
                <div className="feature-info float-left">
                  <h4>Sincronización en Tiempo Real</h4>
                  <p>
                    Recibe recordatorios instantáneos
                    <br />
                    para que nunca olvides una cita.
                  </p>
                </div>
              </div>
            </Col>

            <Col lg={6} md={6} xs={12} className="p-0">
              <div className="feature-item featured-border1">
                <div className="feature-icon float-left">
                  <i className="las la-user"></i>
                </div>
                <div className="feature-info float-left">
                  <h4>Experiencia de Usuario Intuitiva</h4>
                  <p>
                    La interfaz está diseñada asegurando <br /> el uso de todas
                    las funciones sin complicaciones.
                  </p>
                </div>
              </div>
            </Col>

            <Col lg={6} md={6} xs={12} className="p-0">
              <div className="feature-item featured-border2">
                <div className="feature-icon float-left">
                  <i className="las la-search"></i>{" "}
                  {/* Line Icon para búsqueda */}
                </div>
                <div className="feature-info float-left">
                  <h4>Servicios según tu ubicación</h4>
                  <p>
                    Descubrí los mejores emprendimientos
                    <br />a un paso de donde estás y reservá un turno.
                  </p>
                </div>
              </div>
            </Col>

            <Col lg={6} md={6} xs={12} className="p-0">
              <div className="feature-item featured-border3">
                <div className="feature-icon float-left">
                  <i className="las la-sync"></i>{" "}
                  {/* Line Icon para multiplataforma */}
                </div>
                <div className="feature-info float-left">
                  <h4>Acceso Multiplataforma</h4>
                  <p>
                    Disponible en todos tus dispositivos,
                    <br />
                    para que gestiones tu tiempo donde sea.
                  </p>
                </div>
              </div>
            </Col>

            <Col lg={6} md={6} xs={12} className="p-0">
              <div className="feature-item">
                <div className="feature-icon float-left">
                  <i className="las la-briefcase"></i>{" "}
                  {/* Line Icon para negocios */}
                </div>
                <div className="feature-info float-left">
                  <h4>Adaptabilidad a Necesidades del Negocio</h4>
                  <p>
                    Como empresa, podrás ofrecer tus servicios
                    <br /> sin importar a qué rubro pertenezcas.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="showcase">
        <Container fluid className="right-position p-0">
          <Row className="gradient-bg mx-0">
            <Col lg={12} className="text-center">
              <div className="showcase-text section-header">
                <h2 className="section-title">Rubros que nos eligieron</h2>
                <div className="desc-text">
                  <p>Explorá una diversidad de servicios como nunca antes.</p>
                  <p>
                    Encontrá lo que necesites, cuando lo necesites, donde lo
                    necesites.
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          {/* Carrusel con varios rubros por item */}
          <Row className="justify-content-center showcase-area mx-0">
            <Col lg={12} md={12} xs={12} className="p-0">
              <Carousel className="showcase-slider">
                {/* Carousel item con varias columnas */}
                <Carousel.Item>
                  <Row className="mx-0">
                    <Col md={4} className="p-0">
                      <div className="screenshot-thumb">
                        <img
                          src="/assets/img/showcase/01.jpg"
                          className="img-fluid w-100"
                          alt="Peluquería"
                        />
                        <div className="hover-content text-center d-flex align-items-center justify-content-center">
                          <div className="single-text">
                            <p>Peluquería</p>
                            <h5>Lucho Cosano</h5>
                            <p>
                              Azcuenaga 206
                              <br />
                              Monte Grande
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="p-0">
                      <div className="screenshot-thumb">
                        <img
                          src="/assets/img/showcase/02.jpg"
                          className="img-fluid w-100"
                          alt="Mecánica Integral"
                        />
                        <div className="hover-content text-center d-flex align-items-center justify-content-center">
                          <div className="single-text">
                            <p>Mecánica integral</p>
                            <h5>Lo de Beto</h5>
                            <p>
                              Av. Ejercito de Los Andes 1560
                              <br />
                              Villa Luzuriaga
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="p-0">
                      <div className="screenshot-thumb">
                        <img
                          src="/assets/img/showcase/03.jpg"
                          className="img-fluid w-100"
                          alt="Educación Particular"
                        />
                        <div className="hover-content text-center d-flex align-items-center justify-content-center">
                          <div className="single-text">
                            <p>Educación particular</p>
                            <h5>Instituto Pitágoras</h5>
                            <p>
                              9 de Julio 355
                              <br />
                              Almagro
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Carousel.Item>
                
                <Carousel.Item>
                  <Row className="mx-0">
                    <Col md={4} className="p-0">
                      <div className="screenshot-thumb">
                        <img
                          src="/assets/img/showcase/04.jpg"
                          className="img-fluid w-100"
                          alt="Peluquería"
                        />
                        <div className="hover-content text-center d-flex align-items-center justify-content-center">
                          <div className="single-text">
                          <p>Peluquería canina</p>
                          <h5>Barbudogs</h5>
                          <p>Ameghino 1983<br/>Bahia Blanca</p>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="p-0">
                      <div className="screenshot-thumb">
                        <img
                          src="/assets/img/showcase/05.jpg"
                          className="img-fluid w-100"
                          alt="Mecánica Integral"
                        />
                        <div className="hover-content text-center d-flex align-items-center justify-content-center">
                          <div className="single-text">
                          <p>Masajista</p>
                          <h5>Carla Benitez</h5>
                          <p>Cerros Colorados 949<br/>Lomas de Zamora</p>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="p-0">
                      <div className="screenshot-thumb">
                        <img
                          src="/assets/img/showcase/06.jpg"
                          className="img-fluid w-100"
                          alt="Educación Particular"
                        />
                        <div className="hover-content text-center d-flex align-items-center justify-content-center">
                          <div className="single-text">
                          <p>Vino  +  Cerámica</p>
                          <h5>PAKA: Taller de cerámica</h5>
                          <p>Los Robles 240<br/>Olivos</p>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Carousel.Item>
                <Carousel.Item>
                  <Row className="mx-0">
                    <Col md={4} className="p-0">
                      <div className="screenshot-thumb">
                        <img
                          src="/assets/img/showcase/07.jpg"
                          className="img-fluid w-100"
                          alt="Peluquería"
                        />
                        <div className="hover-content text-center d-flex align-items-center justify-content-center">
                          <div className="single-text">
                            <p>Barbería</p>
                            <h5>Ringo</h5>
                            <p>
                              Hipólito Yrigoyen 1960
                              <br />
                              Ezeiza
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="p-0">
                      <div className="screenshot-thumb">
                        <img
                          src="/assets/img/showcase/08.jpg"
                          className="img-fluid w-100"
                          alt="Mecánica Integral"
                        />
                        <div className="hover-content text-center d-flex align-items-center justify-content-center">
                          <div className="single-text">
                            <p>Lavadero de autos</p>
                            <h5>A todo trapo</h5>
                            <p>
                              Liniers 777
                              <br />
                              Villa Urquiza
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="p-0">
                      <div className="screenshot-thumb">
                        <img
                          src="/assets/img/showcase/09.jpg"
                          className="img-fluid w-100"
                          alt="Educación Particular"
                        />
                        <div className="hover-content text-center d-flex align-items-center justify-content-center">
                          <div className="single-text">
                            <p>Tarot</p>
                            <h5>Horoscopedia</h5>
                            <p>
                              AV. Miguel Santamarina 1609
                              <br />
                              Quilmes
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Carousel.Item>
              </Carousel>
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  );
};

export default LandingPage;
