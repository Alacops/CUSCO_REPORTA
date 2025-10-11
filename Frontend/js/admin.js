import {loadReportes, saveReportes, tagClass} from './main.js';

const data = loadReportes();
renderCounters(data);
renderTable(data);

function renderCounters(list){
  const rep = list.filter(r=>r.estado==='REPORTE').length;
  const pro = list.filter(r=>r.estado==='EN_PROCESO').length;
  const sol = list.filter(r=>r.estado==='SOLUCIONADO').length;
  document.getElementById('c_rep').textContent = rep;
  document.getElementById('c_proc').textContent = pro;
  document.getElementById('c_sol').textContent = sol;
}
function renderTable(list){
  const el = document.getElementById('tabla');
  el.innerHTML = `
    <thead><tr>
      <th>ID</th><th>Tipo</th><th>Fecha</th><th>Estado</th><th>Prioridad</th><th>Acciones</th>
    </tr></thead>
    <tbody>
      ${list.map(r=>`
        <tr>
          <td>${r.id}</td>
          <td>${r.tipo}</td>
          <td>${r.fecha}</td>
          <td><span class="${tagClass(r.estado)}">${r.estado.replace('_',' ')}</span></td>
          <td>${r.prioridad}</td>
          <td>
            <select data-id="${r.id}" class="chg">
              <option ${r.estado==='REPORTE'?'selected':''}>REPORTE</option>
              <option ${r.estado==='EN_PROCESO'?'selected':''}>EN_PROCESO</option>
              <option ${r.estado==='SOLUCIONADO'?'selected':''}>SOLUCIONADO</option>
            </select>
          </td>
        </tr>`).join('')}
    </tbody>`;
  el.querySelectorAll('.chg').forEach(sel=>{
    sel.addEventListener('change', e=>{
      const id = Number(e.target.dataset.id);
      const val = e.target.value;
      const idx = data.findIndex(x=>x.id===id);
      data[idx].estado = val;
      saveReportes(data);
      renderCounters(data);
      renderTable(data);
    });
  });
}
