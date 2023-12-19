import React from 'react';
import { XYPlot, MarkSeries, LineSeries } from 'react-vis';

import './GrafoReact.css';

class GrafoReact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.generarDatosGrafo(),
      matrizAdyacencia: null,
      filaSeleccionada: null,
    };
  }

  generarDatosGrafo() {
    const nodos = 12;
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

  generarMatrizAdyacencia() {
    const tamano = 12;
    const matriz = [];

    for (let i = 0; i < tamano; i++) {
      const fila = [];
      for (let j = 0; j < tamano; j++) {
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

    for (let i = 0; i < tamano; i++) {
      for (let j = i + 1; j < tamano; j++) {
        matriz[j][i] = matriz[i][j];
      }
    }

    return matriz;
  }

  componentDidMount() {
    const matrizAdyacencia = this.generarMatrizAdyacencia();
    this.setState({ matrizAdyacencia });
  }

  handleFilaSeleccionada = (event) => {
    const filaSeleccionada = parseInt(event.target.value, 10);
    this.setState({ filaSeleccionada });
  };

  render() {
    const { nodos, conexiones } = this.state.data;
    const { matrizAdyacencia, filaSeleccionada } = this.state;

    return (
      <div className="App">
        <h1>Grafo React</h1>
        <XYPlot width={400} height={400}>
          <MarkSeries
            className="mark-series-example"
            size={5}
            data={nodos}
          />
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
  }
}

export default GrafoReact;
