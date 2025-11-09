let cantidad = 0;
let datos = [];

function iniciarIngreso() {
  cantidad = parseInt(document.getElementById("cantidad").value);
  if (isNaN(cantidad) || cantidad <= 0) {
    alert("Ingrese una cantidad válida de datos (mínimo 1).");
    return;
  }
  document.getElementById("paso1").style.display = "none";
  document.getElementById("paso2").style.display = "block";
  document.getElementById("labelDato").innerText = `Ingrese dato #1 (entre 21 y 100):`;
}

function agregarDato() {
  const input = document.getElementById("dato");
  const valor = parseFloat(input.value);

  if (isNaN(valor)) {
    alert("Debe ingresar un número.");
    return;
  }
  if (valor < 21 || valor > 100) {
    alert("Solo se permiten números entre 21 y 100.");
    return;
  }

  datos.push(valor);
  input.value = "";
  input.focus();

  if (datos.length < cantidad) {
    document.getElementById("labelDato").innerText = `Ingrese dato #${datos.length + 1} (entre 21 y 100):`;
  } else {
    mostrarResultados();
  }
}

function mostrarResultados() {
  document.getElementById("paso2").style.display = "none";
  document.getElementById("resultados").style.display = "block";

  // Mostrar lista completa separada por comas
  document.getElementById("listaDatosFinal").innerText = 
    `Datos ingresados: ${datos.join(", ")}`;

  datos.sort((a, b) => a - b);

  const min = Math.min(...datos);
  const max = Math.max(...datos);
  const k = Math.ceil(Math.sqrt(cantidad));
  const rango = max - min;
  const amplitud = Math.ceil(rango / k);

  let intervalos = [];
  let inicio = min;
  for (let i = 0; i < k; i++) {
    const fin = inicio + amplitud - 1;
    const marca = (inicio + fin) / 2;
    const count = datos.filter(x => x >= inicio && x <= fin).length;
    intervalos.push({ rango: `${inicio}-${fin}`, marca, count });
    inicio += amplitud;
  }

  const total = datos.length;
  let acum = 0;
  const cuerpo = document.querySelector("#tablaFrecuencias tbody");
  cuerpo.innerHTML = "";

  intervalos.forEach(obj => {
    acum += obj.count;
    const frecRel = (obj.count / total).toFixed(2);
    const frecPorc = (frecRel * 100).toFixed(0);
    const fila = `
      <tr>
        <td>${obj.rango}</td>
        <td>${obj.marca}</td>
        <td>${obj.count}</td>
        <td>${acum}</td>
        <td>${frecRel}</td>
        <td>${frecPorc}%</td>
      </tr>`;
    cuerpo.innerHTML += fila;
  });

  // Medidas estadísticas
  const media = (datos.reduce((a, b) => a + b, 0) / total).toFixed(2);
  const mediana = datos[Math.floor(total / 2)];
  const moda = datos.sort((a,b) =>
    datos.filter(v => v===a).length - datos.filter(v => v===b).length
  ).pop();

  const desvMedia = (
    datos.reduce((sum, v) => sum + Math.abs(v - media), 0) / total
  ).toFixed(2);

  const desvEstandar = Math.sqrt(
    datos.reduce((sum, v) => sum + Math.pow(v - media, 2), 0) / total
  ).toFixed(2);

  document.getElementById("media").innerText = `Media aritmética: ${media}`;
  document.getElementById("mediana").innerText = `Mediana: ${mediana}`;
  document.getElementById("moda").innerText = `Moda: ${moda}`;
  document.getElementById("desvMedia").innerText = `Desviación media: ${desvMedia}`;
  document.getElementById("desvEstandar").innerText = `Desviación estándar: ${desvEstandar}`;

  const ctx = document.getElementById("grafico").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: intervalos.map(x => x.rango),
      datasets: [{
        label: "Frecuencia absoluta",
        data: intervalos.map(x => x.count),
        backgroundColor: "#00ffff80",
        borderColor: "#00ffff",
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function reiniciar() {
  location.reload();
}
