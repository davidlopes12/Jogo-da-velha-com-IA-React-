import { useState, useEffect } from "react"
import Square from "./Square"

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  
  const [isNext, setIsNext] = useState(true);
  const winner = calculateWinner(squares);
  
  const [aiIsThinking, setAiIsThinking] = useState(false);

  const handleClick = (i) => {
    if (squares[i] || winner || aiIsThinking) return;

    const newSquares = squares.slice();

    newSquares[i] = isNext ? 'X' : 'O';
    setSquares(newSquares);

    setIsNext(!isNext);
  }

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsNext(true);
  }

  useEffect(() => {

    if(!isNext && !winner) {
      setAiIsThinking(true);

      setTimeout(() => {
        aiMove(squares, setSquares, setIsNext)

        setAiIsThinking(false);
      },1000)
    }

  },[isNext, squares, winner])

  return (
    <div className="App">
      <h1>Jogo da Velha</h1>
      <div className="status">
        Status:
          {winner 
            ? <p className="winner">O vencedor é: {winner}!</p> 
            : (`Proximo a jogar: ${isNext ? 'X' : 'O'}`)}
      </div>
      <div className="board-row">
      <Square values={squares[0]} onClick={() => handleClick(0)}/>
      <Square values={squares[1]} onClick={() => handleClick(1)}/>
      <Square values={squares[2]} onClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
      <Square values={squares[3]} onClick={() => handleClick(3)}/>
      <Square values={squares[4]} onClick={() => handleClick(4)}/>
      <Square values={squares[5]} onClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
      <Square values={squares[6]} onClick={() => handleClick(6)}/>
      <Square values={squares[7]} onClick={() => handleClick(7)}/>
      <Square values={squares[8]} onClick={() => handleClick(8)}/>
      </div>
        <button className="reset-button" onClick={() => resetGame()}>Reiniciar Jogo</button>
    </div>
  )
}

const calculateWinner = (squares) => {
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
  for(let i = 0; i < lines.length; i++) {
    const [a, b , c] = lines[i]

    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

const checkForWinningMove = (squares, player) => {
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

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if ((squares[a] === player && squares[b] === player && squares[c] === null) ||
        (squares[a] === null && squares[b] === player && squares[c] === player) ||
        (squares[a] === player && squares[b] === null && squares[c] === player)) {
      if (squares[a] === null) return a;
      if (squares[b] === null) return b;
      if (squares[c] === null) return c;
    }
  }

  return null;
};


const aiMove = (squares, setSquares, setIsNext) => {
  const availableMoves = [];
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      availableMoves.push(i);
    }
  }

  if (availableMoves.length > 0) {
    const winningMove = checkForWinningMove(squares, 'O');
    if (winningMove !== null) {
      const newSquares = squares.slice(); // Criar um novo array para evitar mutações diretas no estado
      newSquares[winningMove] = 'O';
      setSquares(newSquares);
      setIsNext(true);
    } else {
      const blockingMove = checkForWinningMove(squares, 'X');
      if (blockingMove !== null) {
        squares[blockingMove] = 'O';
      } else {
        if (squares[4] === null) {
          squares[4] = 'O';
        } else {
          const availableCorners = [0, 2, 6, 8].filter(i => squares[i] === null);
          if (availableCorners.length > 0) {
            const cornerMove = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            squares[cornerMove] = 'O';
          } else {
            const availableSides = [1, 3, 5, 7].filter(i => squares[i] === null);
            const sideMove = availableSides[Math.floor(Math.random() * availableSides.length)];
            squares[sideMove] = 'O';
          }
        }
      }

      setIsNext(true);
    }
  }
};


export default Board