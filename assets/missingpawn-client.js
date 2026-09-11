const MissingPawnClient = {
  engineName: 'MissingPawn.exe',
  createMoveCommand(from, to, piece) {
    return {
      command: 'MOVE',
      engine: this.engineName,
      from,
      to,
      piece,
      legal: 'not-checked-yet',
      note: 'placeholder move transfer for MissingPawn.exe'
    };
  },
  sendMoveToBoard(from, to, piece, board) {
    const command = this.createMoveCommand(from, to, piece);
    console.log('[MissingPawnClient]', JSON.stringify(command));
    return command;
  }
};
