import {loadReportes, tagClass} from './main.js';

const $ = id => document.getElementById(id);
$('#btnBuscar').addEventListener('click', ()=>{
  const id = Number($('#idreporte').value.trim());
  const out = $('#resultado');
  if(!id){ alert('Ingresa un ID válido.'); return; }
  const r = loadReportes().find(x=>x.id===id);
  out.style.display='block';
  out.innerHTML = r ? `
    <h3>Reporte #${r.id}</h3>
    <p><b>Tipo:</b> ${r.tipo}</p>
    <p><b>Fecha:</b> ${r.fecha}</p>
    <p><b>Estado:</b> <span class="${tagClass(r.estado)}">${r.estado.replace('_',' ')}</span></p>
    <p><b>Dirección:</b> ${r.direccion}</p>
  ` : `<p>No se encontró el reporte ${id}.</p>`;
});
