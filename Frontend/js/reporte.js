import {loadReportes, saveReportes, newId} from './main.js';

const $ = id => document.getElementById(id);
$('#btnEnviar').addEventListener('click', ()=>{
  const tipo = $('#tipo').value.trim();
  const direccion = $('#direccion').value.trim();
  const descripcion = $('#descripcion').value.trim();
  if(!tipo || !direccion) return alert('Completa tipo y dirección.');

  const list = loadReportes();
  const nuevo = {
    id: newId(list), tipo, estado:'REPORTE', prioridad:'MEDIA',
    fecha: new Date().toISOString().slice(0,10),
    direccion, lat: -13.5169, lng: -71.9780, descripcion, fotos: [],
    ciudadano: {nombre:'ANÓNIMO', dni:'', telefono:''}
  };
  list.push(nuevo);
  saveReportes(list);
  alert('Reporte enviado. ID: '+nuevo.id);
  location.href = 'estado.html';
});
