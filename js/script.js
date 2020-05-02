// Fixes for IE11
if (!String.prototype.includes) {
  String.prototype.includes = function() {
    'use strict'
    return String.prototype.indexOf.apply(this, arguments) !== -1
  }
}

// Clasess
function Game(board) {
  this.pturn = 'white'
  this.board = board
  this.htmlb = new Array(8)
  this.white = 'KQBBNNRRPPPPPPPP'
  this.black = 'kqbbnnrrpppppppp'

  // stores the coords of the current selected piece
  this.selected = undefined
  // stores the coords of the avaliable moves of the selected piece
  this.selmoves = undefined

  this.fillBoard = function() {
    const htmlboard = document.querySelector('.board')
    const size = 90
    for (let y = 0; y < 8; y++) {
      this.htmlb[y] = new Array(8)
      for (let x = 0; x < 8; x++) {
        const data = this.get({x: x, y: y})
        if (data === '.') continue
        const piece = document.createElement('piece')
        piece.classList.add(getClassColor(data))
        piece.classList.add(getClassPiece(data))
        translate(piece, {x: x * size, y: y * size})
        htmlboard.appendChild(piece)
        this.htmlb[y][x] = piece
      }
    }
  }

  // selects a piece if its an ally piece with valid moves
  this.select = function(coord) {
    console.log('start select')
    if (!this.isAllyPiece(coord)) return false
    console.log('continue select')
    this.selected = coord
    this.selmoves = this.getSelmoves()
    if (!this.selmoves) {
      this.selected = undefined
      console.log('no selected moves')
      return false
    }
    return true
  }

  // returns array of valid moves for selected piece
  this.getSelmoves = function() {
    switch (this.get(this.selected)) {
      case 'P': case 'p': return this.getPawnMoves()
      case 'R': case 'r': return this.getRookMoves()
      case 'N': case 'n': return this.getKnightMoves()
      case 'B': case 'b': return this.getBishopMoves()
      case 'Q': case 'q': return this.getQueenMoves()
      case 'K': case 'k': return this.getKingMoves()
      default: return undefined
    }
  }

  // moves selected piece to argument coords
  this.move = function (coord) {
    if (!this.selected) return false
    if (!this.inSelmoves(coord)) return false

    let movingPiece = this.get(this.selected)
    console.log('moving ' + movingPiece + ' from ', this.selected, ' to ',  coord)

    if (this.isEnemyPiece(coord)) this.capture(coord)

    this.place(this.remove(this.selected), coord)

    this.switchPlayer()

    this.selected = undefined
    this.selmoves = undefined

    return true
  }

  this.capture = function(coord) {
    const piece = this.htmlb[coord.y][coord.x]
    document.querySelector('.board').removeChild(piece)
  }

  this.switchPlayer = function() {
    this.pturn = this.pturn === 'white' ? 'black' : 'white'
  }

  this.getPawnMoves = function() {
    const o = this.selected
    const moves = []
    if (this.pturn === 'white') {
      let front = {x: o.x, y: o.y-1}
      if (this.isValid(front) && !this.isPiece(front)) moves.push(front)
      let front2 = {x: o.x, y: o.y-2}
      if (o.y === 6 && this.isValid(front2) && !this.isPiece(front2)) moves.push(front2)
      let frontl = {x: o.x-1, y: o.y-1}
      if (this.isValid(frontl) && this.isEnemyPiece(frontl)) moves.push(frontl)
      let frontr = {x: o.x+1, y: o.y-1}
      if (this.isValid(frontr) && this.isEnemyPiece(frontr)) moves.push(frontr)
      return moves.length > 0 ? moves : undefined
    } else {
      let front = {x: o.x, y: o.y+1}
      if (this.isValid(front) && !this.isPiece(front)) moves.push(front)
      let front2 = {x: o.x, y: o.y+2}
      if (o.y === 1 && this.isValid(front2) && !this.isPiece(front2)) moves.push(front2)
      let frontl = {x: o.x-1, y: o.y+1}
      if (this.isValid(frontl) && this.isEnemyPiece(frontl)) moves.push(frontl)
      let frontr = {x: o.x+1, y: o.y+1}
      if (this.isValid(frontr) && this.isEnemyPiece(frontr)) moves.push(frontr)
      return moves.length > 0 ? moves : undefined
    }
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
    let move, offs
    for (let i = 0; i < offss.length; i++) {
      offs = offss[i]
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
    let moves1 = this.getRookMoves()
    let moves2 = this.getBishopMoves()
    moves1 = moves1 ? moves1 : []
    moves2 = moves2 ? moves2 : []
    const moves = moves1.concat(moves2)
    return moves.length > 0 ? moves : undefined
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
    return (this.pturn === 'white') ? this.white.includes(this.get(coord)) : this.black.includes(this.get(coord))
  }

  this.isEnemyPiece = function(coord) {
    return (this.pturn === 'white') ? this.black.includes(this.get(coord)) : this.white.includes(this.get(coord))
  }

  // returns if a coord is within the board limits
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

  // returns the piece character of the given coords
  this.get = function(coord) {
    return this.board[coord.y][coord.x]
  }

  // removes the piece from the given coords
  this.remove = function(coord) {
    const piece = this.board[coord.y][coord.x]
    const htmlp = this.htmlb[coord.y][coord.x]
    this.board[coord.y][coord.x] = '.'
    this.htmlb[coord.y][coord.x] = undefined
    return [piece, htmlp]
  }

  // places the given piece to the given coords in the board
  this.place = function(piece, coord) {
    this.board[coord.y][coord.x] = piece[0]
    this.htmlb[coord.y][coord.x] = piece[1]
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
  if (!game.select(getBoardCoords(e))) return
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
  if (game.move(co)) translate(draggedPiece, getFlooredCoords(e))
  else translate(draggedPiece, draggedPieceCoords)
  draggedPiece.style.zIndex = '2'

  draggedPiece = undefined
  draggedPieceCoords = undefined
}

// Event Listeners
board.addEventListener('mousedown', dragStart)
board.addEventListener('mousemove', drag)
board.addEventListener('mouseup', dragEnd)

// Code
game.fillBoard()