const pieceMap = {
  'a8': '♜', 'b8': '♞', 'c8': '♝', 'd8': '♛', 'e8': '♚', 'f8': '♝', 'g8': '♞', 'h8': '♜',
  'a7': '♟', 'b7': '♟', 'c7': '♟', 'd7': '♟', 'e7': '♟', 'f7': '♟', 'g7': '♟', 'h7': '♟'
};

const boardElement = document.getElementById('chessBoard');
if (boardElement) {
  const files = ['a','b','c','d','e','f','g','h'];
  const rows = [8,7,6,5,4,3,2,1];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const square = document.createElement('div');
      const file = files[c];
      const rank = rows[r];
      const squareName = file + rank;
      const light = (r + c) % 2 === 0;
      square.className = (light ? 'square light' : 'square dark') + ' chess-square';
      square.dataset.square = squareName;
      square.dataset.piece = pieceMap[squareName] || '';
      square.textContent = pieceMap[squareName] || '';
      square.setAttribute('title', squareName);
      boardElement.appendChild(square);
    }
  }

  MissingPawnBridge.init(boardElement);
}
