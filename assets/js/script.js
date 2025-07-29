let graficoFinanzas = null;
const moneda = "CLP";

// Funciones de cálculo
function calcularGastosTotales(renta, comida, transporte) {
  return renta + comida + transporte;
}

function calcularAhorroMensual(ingresos, gastos) {
  return ingresos - gastos;
}

// Función para formatear moneda
function formatearMoneda(valor) {
  return valor.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  });
}

// Configuración del formulario
document.getElementById('finanzasForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Obtener valores
  const ingresos = parseInt(document.getElementById('ingresos').value.replace(/\./g, '').trim()) || 0;
  const renta = parseInt(document.getElementById('renta').value.replace(/\./g, '').trim()) || 0;
  const comida = parseInt(document.getElementById('comida').value.replace(/\./g, '').trim()) || 0;
  const transporte = parseInt(document.getElementById('transporte').value.replace(/\./g, '').trim()) || 0;

  // Validaciones
  if (ingresos <= 0 || renta < 0 || comida < 0 || transporte < 0) {
    alert("Por favor ingresa valores válidos (mayores o iguales a 0).");
    return;
  }

  // Cálculos
  const gastos = calcularGastosTotales(renta, comida, transporte);
  const ahorro = calcularAhorroMensual(ingresos, gastos);

  // Mostrar resultados
  mostrarResultados(ingresos, renta, comida, transporte, gastos, ahorro);
});

// Función para mostrar resultados
function mostrarResultados(ingresos, renta, comida, transporte, gastos, ahorro) {
  // Mostrar/ocultar secciones
  document.getElementById('finanzasForm').classList.add('hidden');
  document.getElementById('resultadoPanel').classList.remove('hidden');
  const detalleEl = document.getElementById('detalleResumen');
  detalleEl.classList.remove('hidden');

  detalleEl.innerHTML = `
  <div class="card bg-info text-white mb-3 p-3 text-center shadow-sm">
    <h4 class="mb-0">Detalle Financiero</h4>
  </div>

  <div class="card bg-white text-dark mb-3 p-3 shadow-sm text-center">
    <h5>Ingresos Totales</h5>
    <p class="amount mb-0">${formatearMoneda(ingresos)}</p>
  </div>

  <div class="card bg-white text-dark mb-3 p-3 shadow-sm text-center">
    <h5>Gastos Totales</h5>
    <p class="amount mb-0">${formatearMoneda(gastos)}</p>
  </div>

  <div class="d-flex justify-content-between gap-3 mb-3">
    <div class="card flex-fill text-center p-3 shadow-sm">
      <h6 class="mb-1">Renta</h6>
      <p class="amount mb-0">${formatearMoneda(renta)}</p>
    </div>
    <div class="card flex-fill text-center p-3 shadow-sm">
      <h6 class="mb-1">Comida</h6>
      <p class="amount mb-0">${formatearMoneda(comida)}</p>
    </div>
    <div class="card flex-fill text-center p-3 shadow-sm">
      <h6 class="mb-1">Transporte</h6>
      <p class="amount mb-0">${formatearMoneda(transporte)}</p>
    </div>
  </div>

  <div class="card ${
    ahorro <= 0 ? 'bg-danger text-white' : 'bg-success text-white'
  } p-3 text-center shadow-sm mb-4">
    <h5 class="mb-1">${ahorro <= 0 ? 'Tienes un déficit de:' : 'Tu ahorro es:'}</h5>
    <p class="amount mb-0">${formatearMoneda(Math.abs(ahorro))}</p>
  </div>

  <div class="text-center">
    <button onclick="volver()" class="btn btn-detalle px-4 py-2">Nuevo cálculo</button>
  </div>
`;

  // Mensaje de ahorro o déficit
  const textoAhorro = document.getElementById("textoAhorro");
  textoAhorro.classList.remove("alerta");
  if (ahorro <= 0) {
    textoAhorro.textContent = `Déficit: ${formatearMoneda(Math.abs(ahorro))}`;
    textoAhorro.classList.add("alerta");
  } else {
    textoAhorro.textContent = `Ahorro: ${formatearMoneda(ahorro)}`;
  }

  // Crear gráfico
  crearGrafico(ingresos, renta, comida, transporte, ahorro);

  // Función anidada (registro en consola)
  gestionarFinanzas(ingresos, gastos);
}

// Función para crear el gráfico
function crearGrafico(ingresos, renta, comida, transporte, ahorro) {
  // Mostrar el canvas antes de dibujar
  const ctx = document.getElementById('graficoFinanzas').getContext('2d');

  // Destruir gráfico anterior
  if (graficoFinanzas) {
    graficoFinanzas.destroy();
  }

  // Configurar datos según ahorro
  let chartLabels, chartData, chartColors;
  if (ahorro <= 0) {
    chartLabels = ['Gastos', 'Déficit'];
    chartData = [ingresos, Math.abs(ahorro)];
    chartColors = ['#ff6b6b', '#d90429'];
  } else {
    chartLabels = ['Renta', 'Comida', 'Transporte', 'Ahorro'];
    chartData = [renta, comida, transporte, ahorro];
    chartColors = ['#ff6b6b', '#51cf66', '#339af0', '#f59f00'];
  }

  // Crear gráfico
  graficoFinanzas = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: chartLabels,
      datasets: [{
        data: chartData,
        backgroundColor: chartColors,
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '65%',
      animation: {
        animateScale: true,
        animateRotate: true
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: { size: 14 }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${formatearMoneda(context.raw)}`;
            }
          }
        }
      }
    }
  });
}

// Función para volver al formulario
function volver() {
  document.getElementById('finanzasForm').reset();
  document.getElementById('resultadoPanel').classList.add('hidden');
  document.getElementById('finanzasForm').classList.remove('hidden');

  // Destruir gráfico al volver
  if (graficoFinanzas) {
    graficoFinanzas.destroy();
    graficoFinanzas = null;
  }

  // Ocultar detalle financiero
  document.getElementById('detalleResumen').classList.add('hidden');
}

// Funciones adicionales del ejercicio
function verificarSaldo() {
  const saldoSeguro = 1000;
  console.log("Saldo seguro dentro:", saldoSeguro);
}

let descuento = 100;
function calcularDescuento() {
  let descuento = 50;
  console.log("Descuento dentro:", descuento);
}

function gestionarFinanzas(ingresos, gastos) {
  function imprimirResumen() {
    console.log(`Resumen: Gastos ${gastos} CLP | Ahorro ${ingresos - gastos} CLP`);
  }
  imprimirResumen();
}

// Ejecución inicial para demostración
console.log("Descuento global:", descuento);
calcularDescuento();
console.log("Descuento global tras función:", descuento);
