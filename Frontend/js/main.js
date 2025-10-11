const KEY = 'CUSCO_REPORTA_v1';

export function loadReportes(){
  const raw = localStorage.getItem(KEY);
  if(!raw){
    const seed = [
      { id:1001, tipo:"Accidente", estado:"REPORTE", prioridad:"ALTA", fecha:"2025-10-02", direccion:"Av. El Sol 500",
        lat:-13.5169, lng:-71.9780, fotos:[], ciudadano:{nombre:"Luis Pérez",dni:"12345678",telefono:"987654321"} },
      { id:1002, tipo:"Semáforo dañado", estado:"EN_PROCESO", prioridad:"MEDIA", fecha:"2025-10-05", direccion:"Av. de la Cultura 2100",
        lat:-13.5230, lng:-71.9558, fotos:[], ciudadano:{nombre:"Ana Quispe",dni:"45678912",telefono:"912345678"} }
    ];
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw);
}
export function saveReportes(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
export function newId(list){ return (Math.max(...list.map(r=>r.id), 1000) + 1); }
export function tagClass(estado){
  return estado==='REPORTE' ? 'tag red' :
         estado==='EN_PROCESO' ? 'tag yellow' : 'tag green';
}
