import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square"
      onClick={() => props.onClick()}
      style={props.style}>
      {props.square}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winner = calculateWinner(this.props.squares)
    const highlight = winner ? calculateWinner(this.props.squares, true) : null
    console.log(Boolean(highlight))
    return <Square square={this.props.squares[i]}
      onClick={() => this.props.onClick(i)} key={i}
      style={highlight ? highlight.indexOf(i) !== -1 ? {backgroundColor: 'red'} : null : null}/>;
  }

  render() {
    const board = []
    for(let i = 0; i < 3; i++) {
      const squares = []
      for(let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(j + i * 3))
      }
      board.push(<div key={i} className="board-row">{squares}</div>)
    }

    return (
      <div>
        {board}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor() {
    super()
    this.state = {
      history: [{ squares: Array(9).fill(null), }],
      xIsNext: true,
      historyStep: [[0, 0]],
      historyReverse: false
    }
  }

  handleClick(i) {
    const history = this.state.history
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    const winner = calculateWinner(squares)
    if (squares[i] || winner) return
    squares[i] = this.state.xIsNext ? 'X' : 'O'

    let x = parseInt(((i + 1) + 2) / 3)
    let y = parseInt(((i + 1) + 3) % 3)
    y = y ? y : 3
    let historyStep = this.state.historyStep
    historyStep.push([x, y])
    this.setState({
      history: history.concat({ squares: squares }),
      xIsNext: !this.state.xIsNext,
      historyStep
    })
  }

  jumpTo(step) {
    const history = this.state.history.slice(0, step + 1)

    const historyStep = this.state.historyStep.slice(0, step + 1)
    this.setState({
      history,
      historyStep,
      xIsNext: step % 2 === 0
    })
  }

  handleReverse() {
    this.setState({
      historyReverse: !this.state.historyReverse
    })
  }

  render() {
    const history = this.state.history
    const current = history[history.length - 1]
    const squares = current.squares.slice()

    const winner = calculateWinner(squares)
    let status = winner ? 'Winner is: ' + winner : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    if(history.length === 10 && !winner) {
      status = 'No player win'
    }

    const moves = this.state.historyReverse ? history.map((moves, step) => {
      return (
        <li key={step}>
          <button onClick={() => this.jumpTo(step)}
            style={step === history.length - 1 ? { fontWeight: 'bold' } : null}>
            {step === 0 ? 'Go to game start' : 'Go to step #' + step + ' ' + this.state.historyStep[step]}
          </button>
        </li>
      )
    }).reverse() : history.map((moves, step) => {
      return (
        <li key={step}>
          <button onClick={() => this.jumpTo(step)}
            style={step === history.length - 1 ? { fontWeight: 'bold' } : null}>
            {step === 0 ? 'Go to game start' : 'Go to step #' + step + ' ' + this.state.historyStep[step]}
          </button>
        </li>
      )
    })

    return (
      <div className="game">
        <div className="game-board">
          <div className="status">{status}</div>
          <Board squares={squares}
            onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div><button onClick={() => this.handleReverse()}>倒序结果</button></div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares, highlight) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i in lines) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      if(highlight) return lines[i]
      return squares[a]
    }
  }
  return null
}