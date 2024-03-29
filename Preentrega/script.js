
const contenido_general = document.getElementById("contenido_general")

contenido_general.innerHTML = `<header>
<h1>Controlador de Gastos</h1>
<div class="contenido_principal  contenido">
    <div class="row">
        <div id="pregunta">
            <h2>Presupuesto</h2>
            <div id="msj_error_pregunta"></div>
            <form>
                <input type="number" id="presupuesto_inicial" 
                 class="u-full-width" 
                 placeholder="Ingresá tu presupuesto"/>
                <input type="button" onclick="guardar_presupuesto()" 
                 class="button-primary  u-full-width"
                 value="Generar Presupuesto"
                 />
            </form>
        </div>
        <div id="div_gastos">
            <div class="one-half  column">
                <div id="div_crear_gasto">
                    <form id="form_gastos">
                        <h2>Gastos</h2>
                        <div id="msj_error_creargasto"></div>
                        <div class="campo">
                            <label>Nombre Gasto</label>
                            <input type="text" class="u-full-width"
                             placeholder="Ej. Combustible"
                             id="tipo_gasto"
                             />
                        </div>
                        <div class="campo">
                            <label>Valor Gasto</label>
                            <input type="number" class="u-full-width"
                             placeholder="Ej. 2000"
                             id="cantidad_gasto">
                        </div>
                        <input type="button" onclick="agregar_gasto()" 
                         class="button-primary  u-full-width"
                         value="Agregar Gasto"
                         />
                    </form>
                </div>
            </div>
            <div class="one-half  column" id="div_control_gastos">

            </div>

        </div>
        

    </div>
</div>
</header>`




var restante = 0;
const guardar_presupuesto = () =>{
    let presupuesto = parseInt(document.querySelector("#presupuesto_inicial").value);
    

    if(presupuesto<1 || isNaN(presupuesto)){
      mostrar_error("#msj_error_pregunta", "CANTIDAD NO PERMITIDA");
      return
    }

    localStorage.setItem("presupuesto",presupuesto);
    localStorage.setItem("gastos", JSON.stringify([]))
    actualizar_vista();
  } 
  
const actualizar_vista =() => {
  let presupuesto = localStorage.getItem("presupuesto");
  restante = presupuesto;

  let div_pregunta = document.querySelector("#pregunta");
  let div_gastos = document.querySelector("#div_gastos");
  let div_control_gastos = document.querySelector("#div_control_gastos");
  div_pregunta.style.display = "none";
  div_gastos.style.display = "none";

  let control_gastos = `<div class="gastos_realizados">
                                 <h2>Lista de Gastos</h2>
                                 <div class="alert alert_primary"> Presupuesto:$ ${presupuesto} </div>
                                 <div class="alert alert_succes"> Restante:$ ${presupuesto} </div>
                        </div>`;  

  if(!presupuesto){
    div_pregunta.style.display = "block";
  }else{
    div_pregunta.style.display = "none";
    div_gastos.style.display = "block";
    div_control_gastos.innerHTML = control_gastos;
    refrescar_listado();

  }
}



const agregar_gasto = () => {
  let tipo = document.querySelector("#tipo_gasto").value;
  let cantidad = parseInt(document.querySelector("#cantidad_gasto").value);

  if(cantidad<1 || isNaN(cantidad) || tipo.trim()===''){
    mostrar_error("#msj_error_creargasto", "ERROR EN CAMPOS");
    return;
  }

  if(cantidad>restante){
    mostrar_error("#msj_error_creargasto", "CANTIDAD MAYOR A RESTANTE");
    return;
  }

  let nuevo_gasto = {
    tipo,
    cantidad
  }

  let gastos = JSON.parse(localStorage.getItem("gastos"));
  gastos.push(nuevo_gasto);
  localStorage.setItem("gastos", JSON.stringify(gastos));
  refrescar_listado();

  document.querySelector("#form_gastos").reset();
}

const refrescar_listado=()=>{
   let presupuesto=localStorage.getItem("presupuesto");
   let gastos=JSON.parse(localStorage.getItem("gastos"));

   let total_gastos = 0
   let listado_HTML = ``;
   gastos.map(gasto=>{
    listado_HTML+=`<li class="gastos">
                     <p> ${gasto.tipo}
                     <span class="gasto"> $ ${gasto.cantidad}</span>
                     </p>
                    </li>`;
    total_gastos+=parseInt(gasto.cantidad);                 
   })
   console.log("Total de Gastos: "+total_gastos);

   restante = presupuesto-total_gastos;

   let div_control_gastos = document.querySelector("#div_control_gastos");

   div_control_gastos.innerHTML =``;

   if((presupuesto/4)>restante){
    clase = "alert  alert_danger";
   }else if((presupuesto/2)>restante){
    clase = "alert  alert_warning";
   }else{
    clase = "alert  alert_succes";
   }

   div_control_gastos.innerHTML = `<div class="gastos_realizados">
                                        <h2> Listado de Gastos </h2>
                                        ${listado_HTML}
                                        <div class="alert alert_primary"> Presupuesto:$ ${presupuesto} </div>
                                        <div class="${clase}">
                                        Restante:$ ${restante} </div>

                                        <button
                                        onclick="reiniciar_presupuesto()"
                                        class="button  u-full-width"> Reiniciar Presupuesto </button>
                                   </div>`;    
}

const reiniciar_presupuesto = () => {
  localStorage.clear();
  location.reload(true);
}





const mostrar_error=(elemento, mensaje)=>{
  div_error = document.querySelector(elemento);
  div_error.innerHTML = `<p class="alert  alert_danger   error"> ${mensaje} </p>`;
  setTimeout(() => { div_error.innerHTML = ``; }, 2000);
}





