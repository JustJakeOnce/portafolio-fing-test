/* FUNCIONAMIENTO DEL SITIO — navegación, códigos QR, catálogos, prueba diagnóstica y modo kiosco.
   Normalmente no hace falta tocar este archivo: el contenido se edita en la carpeta datos/. */
(function(){
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var VISTAS=['inicio','pregrados','posgrados','portafolio','ava'];
var FUENTES=Object.assign({},ENLACES,{avaPreinscripcion:AVA.preinscripcion,ava:AVA.informacionOficial,posInscripcion:POS_INFO.urlInscripcion});

/* ---------- Textos desde datos/ ---------- */
function txt(sel,v){var el=$(sel); if(el) el.textContent=v==null?'':v}
function contar(nivel){return POSGRADOS.filter(function(p){return p.nivel===nivel}).length}
function plural(n,s,p){return n+' '+(n===1?s:p)}
txt('#ini-ante',SITIO.antetitulo); txt('#ini-titulo',SITIO.titulo); txt('#ini-desc',SITIO.descripcion); txt('#ini-cita',SITIO.cita);
$('#ini-cifras').innerHTML=[[PROGRAMAS.length,'programas de pregrado'],[POSGRADOS.length,'especializaciones, maestrías y doctorados'],[SITIO.acreditacionHasta,'acreditación institucional vigente hasta']]
  .map(function(c){return '<div class="cifra"><b>'+esc(c[0])+'</b><span>'+esc(c[1])+'</span></div>'}).join('');
txt('#banda-ante',AVA.portada.antetitulo); txt('#banda-titulo',AVA.portada.titulo); txt('#banda-texto',AVA.portada.texto);
txt('#acc-ava','Preuniversitario virtual y una prueba diagnóstica de '+PREGUNTAS.length+' preguntas.');
txt('#acc-pos',plural(contar('Especialización'),'especialización','especializaciones')+', '+plural(contar('Maestría'),'maestría','maestrías')+' y '+plural(contar('Doctorado'),'doctorado','doctorados')+' con su plan de estudios.');
txt('#ava-ante',AVA.antetitulo); txt('#ava-nombre',AVA.nombre); txt('#ava-desc',AVA.descripcion); txt('#ava-dirigido',AVA.dirigidoA); txt('#ava-modalidad',AVA.modalidad);
$('#ava-hechos').innerHTML=AVA.datosClave.map(function(d){return '<div class="hecho"><b>'+esc(d.valor)+'</b><span>'+esc(d.texto)+'</span></div>'}).join('');
$('#ava-rasgos').innerHTML=AVA.caracteristicas.map(function(r){return '<div class="rasgo"><span class="circ"><img src="img/'+esc(r.icono)+'.png" alt=""></span><div><b>'+esc(r.titulo)+'</b><span>'+esc(r.texto)+'</span></div></div>'}).join('');
$('#ava-aviso').innerHTML='<span><b>'+esc(AVA.aviso.titulo)+'</b> '+esc(AVA.aviso.texto)+'</span>';
$('#ava-aviso').hidden=!AVA.aviso.texto;
txt('#pos-insc',POS_INFO.inscripcionesHasta); txt('#pos-per',POS_INFO.periodo); txt('#pos-der',POS_INFO.derechos); txt('#pos-desc',POS_INFO.descuentoEgresados); txt('#pos-fecha',POS_INFO.fechaConsulta);

/* ---------- QR ---------- */
function qr(el,url,size){
  el.innerHTML='';
  if(!window.QRCode){el.textContent='QR no disponible';return}
  try{new QRCode(el,{text:url,width:size||260,height:size||260,colorDark:'#0c4d66',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.L})}catch(e){el.textContent='QR no disponible'}
}
function abrirQR(titulo,url){
  $('#modal-t').textContent=titulo;
  $('#modal-url').textContent=url;
  $('#modal-abrir').href=url;
  qr($('#modal-qr'),url,520);
  $('#modal').hidden=false;
  $('#modal-cerrar').focus();
}
function cerrarQR(){$('#modal').hidden=true}
$('#modal-cerrar').addEventListener('click',cerrarQR);
$('#modal').addEventListener('click',function(e){if(e.target===this)cerrarQR()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')cerrarQR()});
function pintarMinis(raiz){
  $$('[data-mini]',raiz).forEach(function(el){var u=FUENTES[el.dataset.mini]||el.dataset.url; if(u) qr(el,u,340)});
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-qr]'); if(!b) return;
  var u=FUENTES[b.dataset.qr]||b.dataset.qr; abrirQR(b.dataset.t||'Escanee con su celular',u);
});

/* ---------- Navegación ---------- */
function ir(v,push){
  if(VISTAS.indexOf(v)<0) v='inicio';
  VISTAS.forEach(function(x){$('#v-'+x).hidden=(x!==v)});
  $$('#nav button').forEach(function(b){ if(b.dataset.v===v) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current')});
  if(v==='pregrados') PRE.cerrar();
  if(v==='posgrados') POS.cerrar();
  $('#lienzo').scrollTop=0;
  if(push!==false){try{history.replaceState(null,'','#'+v)}catch(e){}}
}
$('#nav').addEventListener('click',function(e){var b=e.target.closest('button[data-v]'); if(b) ir(b.dataset.v)});
document.addEventListener('click',function(e){var b=e.target.closest('[data-ir]'); if(!b) return;
  if(b.dataset.ir==='virtual'){ir('pregrados');PRE.filtrar('virtual');return}
  ir(b.dataset.ir)});

/* ---------- Planes de estudio (compartido) ---------- */
function sinTildes(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
function claseCurso(n){
  var t=n.toLowerCase();
  if(/^(inglés|english)/.test(t)) return 'ing';
  if(/práctica|tesis|trabajo de (grado|investigación)|monografía/.test(t)) return 'pra';
  if(/electiv|línea de profund|énfasis|profundización/.test(t)) return 'ele';
  return '';
}
function chipCurso(c){var n=c[0],cr=c[1];
  return '<div class="curso '+claseCurso(n)+'"><span>'+esc(n)+'</span>'+(cr===null||cr===undefined?'':'<em>'+cr+'</em>')+'</div>'}
function barras(tot,etq){
  var max=Math.max.apply(null,tot)||1;
  return '<p class="barras-tit">'+(etq||'Créditos por semestre')+'</p><div class="barras" style="--n:'+tot.length+'">'+tot.map(function(v){return '<div class="barra" style="height:'+Math.max(4,v/max*100)+'%"><span>'+v+'</span></div>'}).join('')+'</div>'+
    '<div class="barras-eje" style="--n:'+tot.length+'">'+tot.map(function(_,i){return '<span>S'+(i+1)+'</span>'}).join('')+'</div>';
}
var COLORES=['#0c4d66','#07769a','#40b6a7','#ace639','#8cbf44','#009999'];
function componentes(comp){
  var tot=comp.reduce(function(a,c){return a+c[1]},0);
  return '<div class="comp"><div class="comp-barra" role="img" aria-label="Distribución de créditos">'+comp.map(function(c,i){return '<i style="width:'+(c[1]/tot*100)+'%;background:'+COLORES[i%6]+'"></i>'}).join('')+'</div>'+
   '<div class="comp-lista">'+comp.map(function(c,i){return '<div><i style="background:'+COLORES[i%6]+'"></i><span>'+esc(c[0])+'</span><b>'+c[1]+'</b></div>'}).join('')+'</div></div>';
}
function leyenda(pos){return '<div class="leyenda"><span><i></i>Obligatorio</span>'+(pos?'':'<span><i style="background:var(--menta)"></i>Inglés</span>')+'<span><i style="background:var(--lima-suave)"></i>Electiva o profundización</span><span><i style="background:var(--azul-prof)"></i>'+(pos?'Trabajo final':'Práctica')+'</span><span>Número = créditos</span></div>'}

function vistaPensum(p){
  var s=p.pensum,h='',pos=!!p.nivel;
  h+='<div class="pensum-cab">'+(s.total?'<div class="total"><b>'+s.total+'</b><span>créditos</span></div>':'')+(s.version?'<span class="version">'+esc(s.version)+'</span>':'')+'</div>';
  if(p.lineas){h+='<p class="subt">'+(p.nivel==='Doctorado'||p.tipoM==='Investigación'?'Líneas de investigación':'Énfasis y líneas')+'</p><div class="lin">'+p.lineas.map(function(l){return '<span>'+esc(l)+'</span>'}).join('')+'</div>'}
  if(s.tipo==='grid'){
    if(s.totSem) h+=barras(s.totSem);
    h+=leyenda(pos);
    h+='<div class="malla-scroll"><div class="malla" style="--n:'+s.sem.length+'">'+s.sem.map(function(cs,i){
      return '<div class="sem"><h4><span>Semestre '+(i+1)+'</span><span>'+(s.totSem?s.totSem[i]:'')+'</span></h4>'+cs.map(chipCurso).join('')+'</div>'}).join('')+'</div></div>';
  } else {
    if(s.componentes){h+='<p class="subt">Distribución de créditos</p>'+componentes(s.componentes)}
    if(s.totSem){h+=barras(s.totSem)}
    if(s.lineas){h+='<p class="subt">Líneas de profundización</p><div class="lineas">'+s.lineas.map(function(l){return '<div class="linea"><b>'+esc(l[0])+'</b><span>'+esc(l[1])+'</span></div>'}).join('')+'</div>'}
    if(s.grupos){h+='<p class="subt">Cursos del plan</p>'+leyenda()+s.grupos.map(function(g){
      return '<div class="grupo"><h4>'+esc(g[0])+'</h4><div class="cursos">'+g[1].map(function(c){return chipCurso(typeof c==='string'?[c,null]:c)}).join('')+'</div></div>'}).join('')}
    if(s.cursos){h+='<p class="subt">Algunos cursos del plan</p><div class="cursos" style="margin-bottom:18px">'+s.cursos.map(function(c){return chipCurso([c,null])}).join('')+'</div>'}
    if(s.tipo==='docs'){h+='<div class="aviso"><span><b>Plan en documento oficial.</b> El plan de estudios de este programa se publica como documento, imagen o en CURSUM. Abra la pestaña <b>Documentos oficiales</b> y escanee el código para verlo completo en su celular.</span></div>'}
  }
  if(s.notas) h+='<p class="nota">'+esc(s.notas)+'</p>';
  return h;
}
function vistaDocs(p){
  return '<div class="docs">'+p.docs.map(function(d,i){
    return '<div class="doc"><span class="ic"><img src="img/i-documento.png" alt=""></span><span class="txt"><b>'+esc(d[0])+'</b><small>'+esc(d[1].replace(/^https?:\/\//,'').slice(0,90))+(d[1].length>98?'…':'')+'</small></span>'+
      '<button class="btn" data-doc="'+i+'">Ver QR</button></div>'}).join('')+'</div>'+
    '<p class="nota" style="margin-top:14px">Enlaces tomados de las páginas oficiales del programa en udea.edu.co, consultadas el 8 de octubre de 2026.</p>';
}
function fila(t,v){return v?'<div><dt>'+t+'</dt><dd>'+esc(v)+'</dd></div>':''}

/* ---------- Catálogo (pregrados y posgrados) ---------- */
function catalogo(o){
  var filtro='todos', actual=null, raiz=$(o.raiz), lista=$(o.lista), det=$(o.detalle), grid=$(o.grid), buscar=$(o.buscar);
  function tarjeta(p){
    var mods=p.modal.map(function(m){return '<span class="etq'+(m==='Virtual'?' v':'')+'">'+m+'</span>'}).join('');
    return '<button class="prog" data-id="'+p.id+'">'+(p.nivel?'<span class="pie"><span class="etq n">'+p.nivel+'</span>'+(p.acred?'<span class="etq a">Alta calidad</span>':'')+'</span>':'')+
      '<h3>'+esc(p.nombre)+'</h3><span class="meta">'+p.dur+' semestres'+(p.sedes.length?' · '+esc(p.sedes.join(', ')):'')+(p.tipoM?' · '+esc(p.tipoM):'')+'</span>'+
      '<span class="pie">'+mods+(p.pensum.tipo==='grid'?'<span class="etq m">Plan por semestre</span>':'')+'</span></button>';
  }
  function pintar(){
    var q=sinTildes((buscar.value||'').trim());
    var l=o.datos.filter(function(p){
      if(filtro!=='todos'&&!o.filtro(p,filtro)) return false;
      if(q&&sinTildes(p.nombre+' '+p.sedes.join(' ')+' '+(p.nivel||'')).indexOf(q)<0) return false;
      return true;
    });
    grid.innerHTML=l.length?l.map(tarjeta).join(''):'<p class="vacio">Ningún programa coincide con la búsqueda. Pruebe con otra palabra o quite el filtro.</p>';
    $(o.conteo).textContent=l.length+(l.length===1?' programa':' programas');
  }
  function filtrar(f){filtro=f;$$('.chip',$(o.filtros)).forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.f===f))});pintar()}
  $$('.chip',$(o.filtros)).forEach(function(c){c.addEventListener('click',function(){filtrar(c.dataset.f)})});
  buscar.addEventListener('input',pintar);
  grid.addEventListener('click',function(e){var b=e.target.closest('.prog'); if(b) abrir(b.dataset.id)});
  det.addEventListener('click',function(e){
    var b=e.target.closest('[data-doc]'); if(b&&actual){var d=actual.docs[+b.dataset.doc]; abrirQR(d[0],d[1]); return}
    if(e.target.closest('.volver')) cerrar();
    var t=e.target.closest('.tab'); if(t){$$('.tab',det).forEach(function(x){x.setAttribute('aria-selected',String(x===t))});
      $('.tab-pensum',det).hidden=t.dataset.tab!=='pensum'; $('.tab-docs',det).hidden=t.dataset.tab!=='docs';}
  });
  function abrir(id){
    var p=o.datos.filter(function(x){return x.id===id})[0]; if(!p) return; actual=p;
    det.innerHTML='<button class="volver">← '+o.volver+'</button>'+
     '<div class="detalle"><div class="panel"><span class="ante">'+(p.nivel||'Pregrado')+' · '+p.dur+' semestres</span><h2>'+esc(p.nombre)+'</h2><p>'+esc(p.desc)+'</p>'+
     '<dl class="datos">'+fila('Título',p.titulo)+fila('Sede',p.sedes.length?p.sedes.join(', '):'Consultar en la página oficial')+fila('Modalidad',p.modal.join(' y '))+fila('Tipo de formación',p.tipoM)+
       fila('Horario',p.horario)+fila('Inversión',p.inv)+fila('SNIES',p.snies)+fila('Registro calificado',p.reg)+fila('Acreditación',p.acred)+'</dl>'+
     '<button class="qr-mini" data-qr="'+esc(p.url)+'" data-t="'+esc(p.nombre)+'"><span class="q" data-url="'+esc(p.url)+'" data-mini></span><span><b>Página oficial del programa</b><span>Escanee para leer perfiles, admisión y contacto.</span></span></button></div>'+
     '<div style="min-width:0"><div class="tabs" role="tablist"><button class="tab" role="tab" aria-selected="true" data-tab="pensum">Plan de estudios</button><button class="tab" role="tab" aria-selected="false" data-tab="docs">Documentos oficiales ('+p.docs.length+')</button></div>'+
     '<div class="tab-pensum">'+vistaPensum(p)+'</div><div class="tab-docs" hidden>'+vistaDocs(p)+'</div></div></div>';
    lista.hidden=true; det.hidden=false; $('#lienzo').scrollTop=0;
    pintarMinis(det); $('.volver',det).focus();
  }
  function cerrar(){det.hidden=true;det.innerHTML='';lista.hidden=false;actual=null}
  function reset(){buscar.value='';filtrar('todos');cerrar()}
  pintar();
  return {filtrar:filtrar,cerrar:cerrar,reset:reset};
}
var PRE=catalogo({datos:PROGRAMAS,lista:'#pre-lista',detalle:'#pre-detalle',grid:'#grid-prog',buscar:'#buscar',conteo:'#conteo',filtros:'#pre-filtros',volver:'Todos los pregrados',
  filtro:function(p,f){
    if(f==='medellin') return p.sedes.indexOf('Medellín')>=0;
    if(f==='regiones') return p.sedes.some(function(s){return s!=='Medellín'});
    if(f==='virtual') return p.modal.indexOf('Virtual')>=0;
    return true;}});
var POS=catalogo({datos:POSGRADOS,lista:'#pos-lista',detalle:'#pos-detalle',grid:'#pos-grid',buscar:'#pos-buscar',conteo:'#pos-conteo',filtros:'#pos-filtros',volver:'Todos los posgrados',
  filtro:function(p,f){ if(f==='virtual') return p.modal.indexOf('Virtual')>=0; return p.nivel===f; }});

/* ---------- Portafolio ---------- */
$('#port').innerHTML=PORTAFOLIO.map(function(it){
  var cuerpo='<span class="circ"><img src="img/'+it.ic+'.png" alt=""></span><span><b>'+esc(it.n)+'</b><span>'+esc(it.d)+'</span>';
  if(it.ir) return '<button class="item" data-ir="'+it.ir+'">'+cuerpo+'<i>Ver ahora</i></span></button>';
  if(it.url) return '<button class="item" data-qr="'+esc(it.url)+'" data-t="'+esc(it.n)+'">'+cuerpo+'<i>Escanear enlace</i></span></button>';
  return '<div class="item">'+cuerpo+'</span></div>';
}).join('');
$('#redes').innerHTML=REDES.map(function(r){return '<button class="pil s" data-qr="'+esc(r[2])+'" data-t="'+esc(r[0]+' '+r[1])+'">'+esc(r[0])+' · '+esc(r[1])+'</button>'}).join('')+
  '<button class="pil s" data-qr="facultad" data-t="Facultad de Ingeniería">Sitio web de la Facultad</button>';

/* ---------- Prueba diagnóstica ---------- */
var P={i:-1,res:[]};
var LETRAS=['A','B','C','D'];
function puntos(){return '<div class="puntos" aria-hidden="true">'+PREGUNTAS.map(function(_,k){var c=P.res[k]===true?'ok':P.res[k]===false?'no':(k===P.i?'act':'');return '<i class="'+c+'"></i>'}).join('')+'</div>'}
function pintarPrueba(){
  var el=$('#prueba');
  if(P.i<0){
    el.innerHTML='<div class="prueba-cab"><span class="ante">Prueba diagnóstica</span></div>'+
     '<p class="preg">¿Qué tan listo está para el examen de admisión?</p>'+
     '<p class="cuerpo">Ocho preguntas de práctica en las dos áreas del examen de admisión UdeA: razonamiento lógico y competencia lectora. Toma unos 5 minutos.</p>'+
     '<p class="nota">Preguntas elaboradas para esta feria a modo de práctica. No son preguntas del examen oficial.</p>'+
     '<div class="acciones"><button class="btn osc" id="p-ini">Empezar la prueba</button></div>';
    $('#p-ini').addEventListener('click',function(){P.i=0;P.res=[];pintarPrueba()});
    return;
  }
  if(P.i>=PREGUNTAS.length){
    var ok=P.res.filter(Boolean).length, rl=0,rlT=0,cl=0,clT=0;
    PREGUNTAS.forEach(function(q,k){if(q.lec){clT++;if(P.res[k])cl++}else{rlT++;if(P.res[k])rl++}});
    var msg=ok>=7?'Muy buen nivel. Con los simulacros de AVA puede afinar el manejo del tiempo.':ok>=5?'Buen punto de partida. Las clases en vivo y los simulacros de AVA le ayudan a ganar seguridad.':'Hay camino por recorrer. AVA le acompaña durante 12 semanas con clases, simulacros y orientación vocacional.';
    el.innerHTML='<div class="prueba-cab"><span class="ante">Resultado</span>'+puntos()+'</div>'+
     '<div class="res-num"><b>'+ok+'</b><span>de '+PREGUNTAS.length+' correctas</span></div>'+
     '<div class="res-areas"><div class="res-area"><b>'+rl+' / '+rlT+'</b>Razonamiento lógico</div><div class="res-area"><b>'+cl+' / '+clT+'</b>Competencia lectora</div></div>'+
     '<p class="cuerpo">'+msg+'</p>'+
     '<div class="acciones"><button class="btn osc" data-qr="avaPreinscripcion" data-t="Preinscripción AVA">Preinscribirme en AVA</button><button class="btn" id="p-otra">Repetir la prueba</button></div>';
    $('#p-otra').addEventListener('click',function(){P.i=-1;P.res=[];pintarPrueba()});
    return;
  }
  var q=PREGUNTAS[P.i], resp=P.res[P.i];
  el.innerHTML='<div class="prueba-cab"><span class="ante">'+esc(q.a)+' · Pregunta '+(P.i+1)+' de '+PREGUNTAS.length+'</span>'+puntos()+'</div>'+
   (q.lec?'<div class="lectura">'+esc(LECTURA)+'</div>':'')+
   '<p class="preg">'+esc(q.q)+'</p><div class="opciones">'+q.o.map(function(o,k){return '<button class="op" data-k="'+k+'"><span class="l">'+LETRAS[k]+'</span><span>'+esc(o)+'</span></button>'}).join('')+'</div><div id="p-retro"></div>';
  $$('.op',el).forEach(function(b){b.addEventListener('click',function(){responder(+b.dataset.k)})});
}
function responder(k){
  var q=PREGUNTAS[P.i]; if(P.res[P.i]!==undefined) return;
  P.res[P.i]=(k===q.c);
  $$('#prueba .op').forEach(function(b){var j=+b.dataset.k;b.disabled=true;if(j===q.c)b.classList.add('correcta');else if(j===k)b.classList.add('mala')});
  $('#prueba .puntos').outerHTML=puntos();
  $('#p-retro').innerHTML='<div class="retro"><b>'+(k===q.c?'Correcto.':'La respuesta es '+LETRAS[q.c]+'.')+'</b> '+esc(q.e)+'</div>'+
    '<div class="acciones" style="margin-top:12px"><button class="btn osc" id="p-sig">'+(P.i===PREGUNTAS.length-1?'Ver resultado':'Siguiente pregunta')+'</button></div>';
  $('#p-sig').addEventListener('click',function(){P.i++;pintarPrueba();$('#prueba').scrollIntoView({block:'start'})});
  $('#p-sig').focus();
}

/* ---------- Modo kiosco ---------- */
var t0=null, ESPERA=(SITIO.reinicioSegundos||0)*1000;
function reiniciar(){cerrarQR();P.i=-1;P.res=[];pintarPrueba();PRE.reset();POS.reset();ir('inicio')}
function actividad(){clearTimeout(t0);if(!ESPERA) return;t0=setTimeout(function(){if(!$('#v-inicio').hidden&&$('#modal').hidden&&P.i<0) return;reiniciar()},ESPERA)}
['pointerdown','keydown','wheel','touchstart'].forEach(function(ev){document.addEventListener(ev,actividad,{passive:true})});
$('#btn-pantalla').addEventListener('click',function(){
  try{ if(!document.fullscreenElement){var r=document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen(); if(r&&r.catch) r.catch(function(){})} else {document.exitFullscreen()} }catch(e){}
  try{ if(navigator.wakeLock) navigator.wakeLock.request('screen').catch(function(){}) }catch(e){}
});

/* ---------- Arranque ---------- */
pintarPrueba(); pintarMinis(document); actividad();
var h=(location.hash||'').replace('#',''); if(VISTAS.indexOf(h)>=0) ir(h,false);
})();
