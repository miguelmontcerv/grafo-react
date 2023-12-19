import React from 'react';
import { XYPlot, MarkSeries, LineSeries } from 'react-vis';

import './GrafoReact.css';

class GrafoReact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cantidadNodosTemp: 12,
      limite: 10, // Nuevo estado para almacenar el límite
      data: this.generarDatosGrafo(12),
      matrizAdyacencia: null,
      filaSeleccionada: null,
    };
    
  }

  generarDatosGrafo(nodos) {
    let nodosData = [];
    let conexionesData = [];

    for (let i = 0; i < nodos; i++) {
      nodosData.push({ x: Math.random(), y: Math.random() });
    }

    for (let i = 0; i < nodos; i++) {
      for (let j = i + 1; j < nodos; j++) {
        conexionesData.push({
          x: [nodosData[i].x, nodosData[j].x],
          y: [nodosData[i].y, nodosData[j].y],
        });
      }
    }

    return { nodos: nodosData, conexiones: conexionesData };
  }

  generarMatrizAdyacencia(nodos) {
    const matriz = [];

    for (let i = 0; i < nodos; i++) {
      const fila = [];
      for (let j = 0; j < nodos; j++) {
        if (i === j) {
          fila.push(null);
        } else {
          const primerValor = Math.floor(Math.random() * 101);
          const segundoValor = Math.min(5, Math.max(1, Math.floor(primerValor / 20) + 1));
          fila.push([primerValor, segundoValor]);
        }
      }
      matriz.push(fila);
    }

    for (let i = 0; i < nodos; i++) {
      for (let j = i + 1; j < nodos; j++) {
        matriz[j][i] = matriz[i][j];
      }
    }

    return matriz;
  }

  componentDidMount() {
    const { cantidadNodosTemp } = this.state;
    const matrizAdyacencia = this.generarMatrizAdyacencia(cantidadNodosTemp);
    this.setState({ matrizAdyacencia });
  }

  handleCantidadNodosChange = (event) => {
    const cantidadNodosTemp = parseInt(event.target.value, 10);
    this.setState({ cantidadNodosTemp });
  };

  handleGenerarGrafo = () => {
    const { cantidadNodosTemp } = this.state;
    if (cantidadNodosTemp >= 1) {
      this.setState({
        cantidadNodos: cantidadNodosTemp,
        data: this.generarDatosGrafo(cantidadNodosTemp),
        matrizAdyacencia: this.generarMatrizAdyacencia(cantidadNodosTemp),
        filaSeleccionada: null,
      });
    }
  };

  handleFilaSeleccionada = (event) => {
    const filaSeleccionada = parseInt(event.target.value, 10);
    this.setState({ filaSeleccionada }, () => {
      this.enviarValoresNoNulos();
    });
  };
  
  enviarValoresNoNulos() {
    const { filaSeleccionada, matrizAdyacencia } = this.state;
    const valoresNoNulos = matrizAdyacencia[filaSeleccionada]
      .filter((valor) => valor !== null)
      .map((valor) => `(${valor[0]}, ${valor[1]})`);
  
    // Enviar los valores a la URL proporcionada
    this.realizarPeticion(valoresNoNulos);
  }
  
  realizarPeticion(valores) {
    const { limite } = this.state;

    // Construir el objeto de datos
    const data = {
      array: `[${valores.join(", ")}]`,
      limit: limite.toString()
    };
  
    console.log("VALORES A MANDAR", data);
  
    // Realizar la petición a la URL
    fetch("https://artificiallove.azurewebsites.net/api/corazones?code=WybpZ3EPEt1b95QJGGC2JAe1HSOertD9CAoDa42kdwCAAzFuJ3_2zw%3D%3D", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        const formattedResult = `Resultado del servidor:\n` +
          `Sumatoria de similitud: ${result.resultado_valor}\n` +
          `Usuarios: [${result.resultado_elementos.join(', ')}]\n` +
          `Tiempo: ${result.tiempo} segundos`;

        alert(formattedResult);
      })
      .catch((error) => {
        console.error("Error al realizar la petición:", error);
      });
  }

  handleLimiteChange = (event) => {
    const limite = parseInt(event.target.value, 10);
    this.setState({ limite });
  };
  

  render() {
    const { nodos, conexiones } = this.state.data;
    const { matrizAdyacencia, filaSeleccionada, cantidadNodosTemp, limite } = this.state;

    return (
      <div className="App">
        <h1>Grafo React</h1>

        <div>
          <label htmlFor="cantidadNodos">Cantidad de Nodos:</label>
          <input
            type="number"
            id="cantidadNodos"
            value={cantidadNodosTemp}
            onChange={this.handleCantidadNodosChange}
          />
          <label htmlFor="limite">Límite:</label>
          <input
            type="number"
            id="limite"
            value={limite}
            onChange={this.handleLimiteChange}
          />
          <button onClick={this.handleGenerarGrafo}>Generar Grafo</button>
        </div>


        <XYPlot width={400} height={400}>
          <MarkSeries className="mark-series-example" size={5} data={nodos} />
          {conexiones.map((conexion, index) => (
            <LineSeries key={index} data={conexion.x.map((x, i) => ({ x, y: conexion.y[i] }))} />
          ))}
        </XYPlot>

        {matrizAdyacencia && (
          <div>
            <h2>Matriz de Adyacencia</h2>
            <table className="matriz-table">
              <tbody>
                {matrizAdyacencia.map((fila, i) => (
                  <tr key={i}>
                    {fila.map((valor, j) => (
                      <td key={j}>{valor !== null ? `${valor[0]}, ${valor[1]}` : 'null'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {matrizAdyacencia && (
          <div>
            <h2>Seleccione un usuario</h2>
            <select onChange={this.handleFilaSeleccionada}>
              <option value={null}>Selecciona un usuario</option>
              {matrizAdyacencia.map((fila, i) => (
                <option key={i} value={i}>
                  Usuario {i + 1}
                </option>
              ))}
            </select>

            {filaSeleccionada !== null && (
              <table className="matriz-table">
                <tbody>
                  <tr>
                    {matrizAdyacencia[filaSeleccionada].map((valor, j) => (
                      <td key={j}>{valor !== null ? `${valor[0]}, ${valor[1]}` : 'null'}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    );
  } //Render

}

export default GrafoReact;
