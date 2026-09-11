const MissingPawnBridge = {
  enginePath: 'assets/MissingPawn.exe',
  board: [],
  activeColor: 'white',
  selected: null,

  init(boardElement) {
    this.board = boardElement;
    this.listenForSquareClicks();
  },

  listenForSquareClicks() {
    const squares = Array.from(this.board.querySelectorAll('.square'));
    squares.forEach((square) => {
      square.addEventListener('click', () => {
        const from = square.getAttribute('data-square');
        const piece = square.getAttribute('data-piece');
        if (!this.selected) {
          if (piece) {
            this.selected = { square: from, piece };
            square.classList.add('selected-square');
          }
          return;
        }

        const to = from;
        if (piece && piece !== this.selected.piece) {
          this.selected = { square: from, piece };
          square.classList.add('selected-square');
          return;
        }

        const legalMove = {
          command: 'MOVE',
          engine: 'MissingPawn.exe',
          from: this.selected.square,
          to,
          piece: this.selected.piece,
          note: 'placeholder bridge: move requested only'
        };

        console.log('[MissingPawnBridge]', JSON.stringify(legalMove));
        this.movePiece(this.selected.square, to);
        this.selected = null;
        squares.forEach(item => item.classList.remove('selected-square'));
      });
    });
  },

  movePiece(from, to) {
    const fromSquare = this.board.querySelector('[data-square="' + from + '"]');
    const toSquare = this.board.querySelector('[data-square="' + to + '"]');
    if (!fromSquare || !toSquare) return;

    const piece = fromSquare.getAttribute('data-piece');
    const captured = toSquare.getAttribute('data-piece');
    fromSquare.setAttribute('data-piece', '');
    fromSquare.innerText = '';
    toSquare.setAttribute('data-piece', piece);
    toSquare.innerText = piece;

    console.log('[MissingPawnBridge]', 'moved', piece, 'from', from, 'to', to, 'captured=', captured || 'empty');
  }
};
