// Clasess
function Game(board) {
  this.color = 'w'
  this.board = board
  this.white = 'KQBBNNRRPPPPPPPP'
  this.black = 'kqbbnnrrpppppppp'

  // stores the coords of the current selected piece
  this.selected = undefined
  // stores the coords of the avaliable moves of the selected piece
  this.selmoves = undefined

  this.select = function(coord) {
    if (!this.isAllyPiece(coord)) return false
    this.selected = coord
    this.selmoves = this.getSelmoves()
    if (!this.selmoves) {
      this.selected = undefined
      return false
    }
    return true
  }

  this.getSelmoves = function() {
    switch (this.get(this.selected)) {
      case 'P': return this.getPawnMoves()
      case 'R': return this.getRookMoves()
      case 'N': return this.getKnightMoves()
      case 'B': return this.getBishopMoves()
      case 'Q': return this.getQueenMoves()
      case 'K': return this.getKingMoves()
      default: return undefined
    }
  }

  this.getPawnMoves = function() {
    const o = this.selected
    const moves = []
    let front = {x: o.x, y: o.y-1}
    if (this.isValid(front) && !this.isPiece(front)) moves.push(front)
    let frontl = {x: o.x-1, y: o.y-1}
    if (this.isValid(frontl) && this.isEnemyPiece(frontl)) moves.push(frontl)
    let frontr = {x: o.x+1, y: o.y-1}
    if (this.isValid(frontr) && this.isEnemyPiece(frontr)) moves.push(frontr)
    return moves.length > 0 ? moves : undefined
  }

  this.getRookMoves = function() {
    const o = this.selected
    const moves = []
    // North
    let i = 1
    let move = {x: o.x, y: o.y - i}
    while (this.isValid(move) && !this.isPiece(move)) {
      moves.push(move)
      i++
      move = {x: o.x, y: o.y - i}
    }
    // South
    i = 1
    move = {x: o.x, y: o.y + i}
    while (this.isValid(move) && !this.isPiece(move)) {
      moves.push(move)
      i++
      move = {x: o.x, y: o.y + i}
    }
    // West
    i = 1
    move = {x: o.x - i, y: o.y}
    while (this.isValid(move) && !this.isPiece(move)) {
      moves.push(move)
      i++
      move = {x: o.x - i, y: o.y}
    }
    // Est
    i = 1
    move = {x: o.x + i, y: o.y}
    while (this.isValid(move) && !this.isPiece(move)) {
      moves.push(move)
      i++
      move = {x: o.x + i, y: o.y}
    }
    return moves.length > 0 ? moves : undefined
  }

  this.getKnightMoves = function() {
    const o = this.selected
    const moves = []
    const offss = [[1, 2], [2, 1], [1, -2], [2, -1], [-1, 2], [-2, 1], [-1, -2], [-2, -1]]
    let move
    for (const offs of offss) {
      move = {x: o.x + offs[0], y: o.y + offs[1]}
      if (this.isValid(move) && !this.isAllyPiece(move)) moves.push(move)
    }
    return moves.length > 0 ? moves : undefined
  }

  this.getBishopMoves = function() {
    const o = this.selected
    const moves = []
    // North East
    let i = 1
    let move = {x: o.x + i, y: o.y - i}
    while (this.isValid(move) && !this.isPiece(move)) {
      moves.push(move)
      i++
      move = {x: o.x + i, y: o.y - i}
    }
    // South East
    i = 1
    move = {x: o.x + i, y: o.y + i}
    while (this.isValid(move) && !this.isPiece(move)) {
      moves.push(move)
      i++
      move = {x: o.x + i, y: o.y + i}
    }
    // North West
    i = 1
    move = {x: o.x - i, y: o.y - i}
    while (this.isValid(move) && !this.isPiece(move)) {
      moves.push(move)
      i++
      move = {x: o.x - i, y: o.y - i}
    }
    // South West
    i = 1
    move = {x: o.x - i, y: o.y + i}
    while (this.isValid(move) && !this.isPiece(move)) {
      moves.push(move)
      i++
      move = {x: o.x - i, y: o.y + i}
    }
    return moves.length > 0 ? moves : undefined
  }

  this.getQueenMoves = function() {
    const moves1 = this.getRookMoves()
    const moves2 = this.getBishopMoves()
    return moves1.concat(moves2)
  }

  this.getKingMoves = function() {
    const o = this.selected
    const moves = []
    let move
    for (let x0 = -1; x0 <= 1; x0++) {
      for (let y0 = -1; y0 <= 1; y0++) {
        move = {x: o.x + x0, y: o.y + y0}
        if (this.isValid(move) && !this.isAllyPiece(move)) {
          moves.push(move)
        }
      }
    }
    return moves.length > 0 ? moves : undefined
  }

  this.isPiece = function(coord) {
    return this.isAllyPiece(coord) || this.isEnemyPiece(coord)
  }

  this.isAllyPiece = function(coord) {
    return this.white.includes(this.get(coord))
  }

  this.isEnemyPiece = function(coord) {
    return this.black.includes(this.get(coord))
  }

  this.isValid = function(coord) {
    return 0 <= coord.x && coord.x < 8 && 0 <= coord.y && coord.y < 8
  }

  this.get = function(coord) {
    return this.board[coord.y][coord.x]
  }
}

// Global variables
// const game = new Game([
//   ['r','n','b','q','k','b','n','r'],
//   ['p','p','p','p','p','p','p','p'],
//   ['.','.','.','.','.','.','.','.'],
//   ['.','.','.','.','.','.','.','.'],
//   ['.','.','.','.','.','.','.','.'],
//   ['.','.','.','.','.','.','.','.'],
//   ['P','P','P','P','P','P','P','P'],
//   ['R','N','B','Q','K','B','N','R']
// ])

const game = new Game([
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  ['.','.','.','.','.','P','.','.'],
  ['.','.','.','Q','.','.','p','.'],
  ['.','p','.','.','.','.','.','.'],
  ['.','.','.','.','P','.','.','.'],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R']
])

game.select({y: 3, x: 3})

console.log(game.selmoves)