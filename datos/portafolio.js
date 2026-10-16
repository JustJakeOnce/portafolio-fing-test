/* PORTAFOLIO Y REDES
   Cada tarjeta: n (nombre) · d (descripción) · ic (ícono de la carpeta img, sin .png)
   y una de estas acciones: ir:'pregrados' | 'posgrados' | 'virtual' (abre esa sección)
                            url:'https://...' (muestra un código QR)   · sin ir ni url: tarjeta informativa
   REDES: [red, usuario, enlace] */
window.PORTAFOLIO=[
 {n:'Pregrados',d:'Programas en Medellín, regiones y modalidad virtual.',ir:'pregrados',ic:'i-carpeta'},
 {n:'Posgrados',d:'Especializaciones, maestrías y doctorados con su plan de estudios.',ir:'posgrados',ic:'i-cerebro'},
 {n:'Educación Continua',d:'Formación a lo largo de la vida para profesionales.',url:'https://www.udea.edu.co/wps/portal/udea/web/inicio/unidades-academicas/ingenieria/servicios-extension/educacion-continua',ic:'i-documento'},
 {n:'Campus Digital',d:'Pregunte por esta línea al equipo del stand. La Facultad también ofrece pregrados virtuales.',ir:'virtual',ic:'i-robot'},
 {n:'Universidad Corporativa',d:'Pregunte por esta línea al equipo del stand.',url:null,ic:'i-engranaje-red'},
 {n:'Innovación y emprendimiento',d:'Directorio que da visibilidad a emprendedores de la Facultad.',url:'https://www.udea.edu.co/wps/portal/udea/web/generales/interna/Unidades+Acad%21c3%21a9micas/Ingenier%21c3%21ada/asContenidos/listado-noticia/apoya-emprendedores-ingenieros-UdeA',ic:'i-cerebro'},
 {n:'Investigación',d:'Grupos de investigación, centro de investigación y semilleros.',url:'https://www.udea.edu.co/wps/portal/udea/web/inicio/unidades-academicas/ingenieria/investigacion/grupos-investigacion',ic:'i-lupa'},
 {n:'Laboratorios',d:'Oferta de servicios de laboratorio para la industria y la academia.',url:'https://www.udea.edu.co/wps/portal/udea/web/inicio/unidades-academicas/ingenieria/servicios-extension/oferta-laboratorio/',ic:'i-engranaje-mano'},
 {n:'Consultoría',d:'Asesoría y consultoría para terceros, con el apoyo del CESET.',url:'https://www.udea.edu.co/wps/portal/udea/web/inicio/unidades-academicas/ingenieria/servicios-extension/asesorias-consultorias',ic:'i-documento'},
 {n:'Bienestar Académico',d:'Unidad de Bienestar, galería de arte virtual y Comité de Género.',url:'https://www.udea.edu.co/wps/portal/udea/web/inicio/unidades-academicas/ingenieria/bienestar/conoce-unidad-bienestar',ic:'i-ubicacion'}
];

window.REDES=[['Instagram','@fingenieriaudea','https://www.instagram.com/fingenieriaudea/'],['X','@FIngenieriaUdeA','https://twitter.com/FIngenieriaUdeA'],['Facebook','FacultadIngenieriaUdeA','https://www.facebook.com/FacultadIngenieriaUdeA']];
