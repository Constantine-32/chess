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

  // selects a piece if its an ally piece with valid moves
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

  // returns array of valid moves for selected piece
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

  // moves selected piece to argument coords
  this.move = function (coord) {
    if (!this.selected) return false
    if (!this.inSelmoves(coord)) return false

    let movingPiece = this.get(this.selected)
    console.log('moving ' + movingPiece + ' from ', this.selected, ' to ',  coord)

    if (this.isEnemyPiece(coord)) {
      console.log('captured: ' + this.get(coord))
    }

    this.remove(this.selected)
    this.place(movingPiece, coord)

    this.selected = undefined
    this.selmoves = undefined

    return true
  }

  this.getPawnMoves = function() {
    const o = this.selected
    const moves = []
    let front = {x: o.x, y: o.y-1}
    if (this.isValid(front) && !this.isPiece(front)) moves.push(front)
    let front2 = {x: o.x, y: o.y-2}
    if (o.y === 6 && this.isValid(front2) && !this.isPiece(front2)) moves.push(front2)
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
    if (this.isValid(move) && this.isEnemyPiece(move))
      moves.push(move)
    // South
    i = 1
    move = {x: o.x, y: o.y + i}
    while (this.isValid(move) && !this.isPiece(move)) {
      moves.push(move)
      i++
      move = {x: o.x, y: o.y + i}
    }
    if (this.isValid(move) && this.isEnemyPiece(move))
      moves.push(move)
    // West
    i = 1
    move = {x: o.x - i, y: o.y}
    while (this.isValid(move) && !this.isPiece(move)) {
      moves.push(move)
      i++
      move = {x: o.x - i, y: o.y}
    }
    if (this.isValid(move) && this.isEnemyPiece(move))
      moves.push(move)
    // Est
    i = 1
    move = {x: o.x + i, y: o.y}
    while (this.isValid(move) && !this.isPiece(move)) {
      moves.push(move)
      i++
      move = {x: o.x + i, y: o.y}
    }
    if (this.isValid(move) && this.isEnemyPiece(move))
      moves.push(move)
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
    if (this.isValid(move) && this.isEnemyPiece(move))
      moves.push(move)
    // South East
    i = 1
    move = {x: o.x + i, y: o.y + i}
    while (this.isValid(move) && !this.isPiece(move)) {
      moves.push(move)
      i++
      move = {x: o.x + i, y: o.y + i}
    }
    if (this.isValid(move) && this.isEnemyPiece(move))
      moves.push(move)
    // North West
    i = 1
    move = {x: o.x - i, y: o.y - i}
    while (this.isValid(move) && !this.isPiece(move)) {
      moves.push(move)
      i++
      move = {x: o.x - i, y: o.y - i}
    }
    if (this.isValid(move) && this.isEnemyPiece(move))
      moves.push(move)
    // South West
    i = 1
    move = {x: o.x - i, y: o.y + i}
    while (this.isValid(move) && !this.isPiece(move)) {
      moves.push(move)
      i++
      move = {x: o.x - i, y: o.y + i}
    }
    if (this.isValid(move) && this.isEnemyPiece(move))
      moves.push(move)
    return moves.length > 0 ? moves : undefined
  }

  this.getQueenMoves = function() {
    const moves1 = this.getRookMoves()
    const moves2 = this.getBishopMoves()
    return moves1 ? moves1.concat(moves2 ? moves2 : []) : undefined
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

  // check if argument coords is in selmoves array
  this.inSelmoves = function(coord) {
    for (let i = 0; i < this.selmoves.length; i++) {
      let c = this.selmoves[i]
      if (coord.x === c.x && coord.y === c.y) return true
    }
    return false
  }

  this.get = function(coord) {
    return this.board[coord.y][coord.x]
  }

  this.remove = function(coord) {
    this.board[coord.y][coord.x] = '.'
  }

  this.place = function(piece, coord) {
    this.board[coord.y][coord.x] = piece
  }
}

// Global variables
const game = new Game([
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  ['.','.','.','.','.','.','.','.'],
  ['.','.','.','.','.','.','.','.'],
  ['.','.','.','.','.','.','.','.'],
  ['.','.','.','.','.','.','.','.'],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R']
])

const board = document.querySelector('.board')

let draggedPiece = undefined
let draggedPieceCoords = undefined

// Functions
function fillBoard() {
  const size = 90
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const data = game.get({x: x, y: y})
      if (data === '.') continue
      const piece = document.createElement('piece')
      piece.classList.add(getClassColor(data))
      piece.classList.add(getClassPiece(data))
      translate(piece, {x: x * size, y: y * size})
      board.appendChild(piece)
    }
  }
}

function getClassColor(data) {
  return 'A' <= data && data <= 'Z' ? 'white' : 'black'
}

function getClassPiece(data) {
  data = data.toLowerCase()
  return {p: 'pawn', r: 'rook', n: 'knight', b: 'bishop', q: 'queen', k: 'king'}[data]
}

function translate(piece, coord) {
  piece.style.transform = 'translate('+coord.x+'px, '+coord.y+'px)'
}

function getRelativeCoords(e) {
  return {x: e.clientX - board.offsetLeft, y: e.clientY - board.offsetTop}
}

function getFlooredCoords(e) {
  const co = this.getRelativeCoords(e)
  return {x: co.x - co.x % 90, y: co.y - co.y % 90}
}

function getBoardCoords(e) {
  const co = getRelativeCoords(e)
  return {x: Math.floor(co.x / 90), y: Math.floor(co.y / 90)}
}

function dragStart(e) {
  const co = getBoardCoords(e)
  if (!game.select(co)) return
  draggedPiece = e.target
  draggedPiece.style.zIndex = '4'
  draggedPieceCoords = getFlooredCoords(e)
  const c = getRelativeCoords(e)
  translate(draggedPiece, {x: c.x - 45, y: c.y - 45})
}

function drag(e) {
  if (!draggedPiece) return
  e.preventDefault()
  const c = getRelativeCoords(e)
  translate(draggedPiece, {x: c.x - 45, y: c.y - 45})
}

function dragEnd(e) {
  if (!draggedPiece) return
  const co = getBoardCoords(e)
  if (!game.move(co)) translate(draggedPiece, draggedPieceCoords)
  else translate(draggedPiece, getFlooredCoords(e))
  draggedPiece.style.zIndex = '2'

  draggedPiece = undefined
  draggedPieceCoords = undefined
}

// Event Listeners
board.addEventListener('mousedown', dragStart)
board.addEventListener('mousemove', drag)
board.addEventListener('mouseup', dragEnd)

// Code
fillBoard()