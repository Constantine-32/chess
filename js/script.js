// Fixes for IE11
if (!String.prototype.includes) {
  String.prototype.includes = function() {
    'use strict'
    return String.prototype.indexOf.apply(this, arguments) !== -1
  }
}

// Clasess
function Game(board) {
  this.pturn = true
  this.cturn = 'white'
  this.board = board
  this.paren = document.querySelector('.board')
  this.htmlb = new Array(8)
  this.white = 'KQBBNNRRPPPPPPPP'
  this.black = 'kqbbnnrrpppppppp'
  this.selel = []

  // stores the coords of the current selected piece
  this.selected = undefined
  // stores the coords of the avaliable moves of the selected piece
  this.selmoves = undefined

  this.fillBoard = function() {
    const size = 90
    for (let y = 0; y < 8; y++) {
      this.htmlb[y] = new Array(8)
      for (let x = 0; x < 8; x++) {
        const data = this.get({x: x, y: y})
        if (data === '.') continue
        const piece = document.createElement('piece')
        piece.classList.add(this.getClassColor(data))
        piece.classList.add(this.getClassPiece(data))
        translate(piece, {x: x * size, y: y * size})
        this.paren.appendChild(piece)
        this.htmlb[y][x] = piece
      }
    }
  }

  this.getClassColor = function(data) {
    return 'A' <= data && data <= 'Z' ? 'white' : 'black'
  }

  this.getClassPiece = function(data) {
    data = data.toLowerCase()
    return {p: 'pawn', r: 'rook', n: 'knight', b: 'bishop', q: 'queen', k: 'king'}[data]
  }

  // selects a piece if its an ally piece with valid moves
  this.select = function(coord) {
    if (!this.pturn || !this.isAllyPiece(coord)) return false
    this.selected = coord
    this.selmoves = this.getSelmoves()

    const seldiv = document.createElement('div')
    seldiv.classList.add('selected')
    this.translate(seldiv, coord)
    this.selel.push(seldiv)
    this.paren.appendChild(seldiv)

    if (!this.selmoves) {
      this.selmoves = []
      return true
    }

    for (let i = 0; i < this.selmoves.length; i++) {
      let dotdiv = document.createElement('div')
      dotdiv.classList.add('movedots')
      if (this.isEnemyPiece(this.selmoves[i])) dotdiv.classList.add('capture')
      this.translate(dotdiv, this.selmoves[i])
      this.selel.push(dotdiv)
      this.paren.appendChild(dotdiv)
    }

    return true
  }

  this.unselect = function() {
    if (!this.selected) return false
    this.selected = undefined
    this.selmoves = undefined
    for (let i = 0; i < this.selel.length; i++) {
      this.paren.removeChild(this.selel[i])
    }
    this.selel = []
  }

  // returns array of valid moves for selected piece
  this.getSelmoves = function() {
    const piece = this.get(this.selected).toLowerCase()
    switch (piece) {
      case 'p': return this.getPawnMoves()
      case 'r': return this.getRookMoves()
      case 'n': return this.getKnightMoves()
      case 'b': return this.getBishopMoves()
      case 'q': return this.getQueenMoves()
      case 'k': return this.getKingMoves()
      default: return undefined
    }
  }

  // moves selected piece to argument coords
  this.move = function(coord) {
    if (!this.pturn || !this.selected || !this.inSelmoves(coord)) return false

    if (this.isEnemyPiece(coord)) this.capture(coord)

    this.place(this.remove(this.selected), coord)

    this.unselect()
    this.switchPlayer()

    return this.coordNotation(coord)
  }

  this.moveAI = function() {
    if (this.pturn) return false
    // select a random piece that can move giving priority to the ones that can capture
    const pieces = []
    const capturepices = []
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        this.selected = {x: x, y: y}
        if (this.isAllyPiece(this.selected)) {
          if (this.getSelmoves()) {
            pieces.push(this.selected)
            if (this.anyCapture(this.getSelmoves())) {
              capturepices.push(this.selected)
            }
          }
        }
      }
    }

    if (pieces.length === 0) {
      console.log('AI: no avaliable moves!')
      return false
    }

    this.selected = this.randomItem(capturepices.length ? capturepices : pieces)

    // select a random move of the selected piece
    this.selmoves = this.getSelmoves()

    const capturemoves = []
    for (let i = 0; i < this.selmoves.length; i++) {
      if (this.isEnemyPiece(this.selmoves[i]))
        capturemoves.push(this.selmoves[i])
    }
    const move = this.randomItem(capturemoves.length ? capturemoves : this.selmoves)

    if (this.isEnemyPiece(move)) this.capture(move)

    const htmlp = this.gethtml(this.selected)
    this.place(this.remove(this.selected), move)
    htmlp.style.transform = 'translate('+move.x*90+'px, '+move.y*90+'px)'

    this.switchPlayer()

    this.selected = undefined
    this.selmoves = undefined

    return this.coordNotation(move)
  }

  this.capture = function(coord) {
    const piece = this.htmlb[coord.y][coord.x]
    this.paren.removeChild(piece)
  }

  this.switchPlayer = function() {
    this.cturn = this.cturn === 'white' ? 'black' : 'white'
    this.pturn = !this.pturn
  }

  this.getPawnMoves = function() {
    const o = this.selected
    const moves = []
    if (this.cturn === 'white') {
      let front = {x: o.x, y: o.y-1}
      if (this.isValid(front) && !this.isPiece(front)) moves.push(front)
      let front2 = {x: o.x, y: o.y-2}
      if (o.y === 6 && this.isValid(front2) && !this.isPiece(front) && !this.isPiece(front2)) moves.push(front2)
      let frontl = {x: o.x-1, y: o.y-1}
      if (this.isValid(frontl) && this.isEnemyPiece(frontl)) moves.push(frontl)
      let frontr = {x: o.x+1, y: o.y-1}
      if (this.isValid(frontr) && this.isEnemyPiece(frontr)) moves.push(frontr)
      return moves.length > 0 ? moves : undefined
    } else {
      let front = {x: o.x, y: o.y+1}
      if (this.isValid(front) && !this.isPiece(front)) moves.push(front)
      let front2 = {x: o.x, y: o.y+2}
      if (o.y === 1 && this.isValid(front2) && !this.isPiece(front) && !this.isPiece(front2)) moves.push(front2)
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
    return (this.cturn === 'white') ? this.white.includes(this.get(coord)) : this.black.includes(this.get(coord))
  }

  this.isEnemyPiece = function(coord) {
    return (this.cturn === 'white') ? this.black.includes(this.get(coord)) : this.white.includes(this.get(coord))
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

  this.gethtml = function (coord) {
    return this.htmlb[coord.y][coord.x]
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
    if (piece[0].toLowerCase() === 'p') {
      if (this.getClassColor(piece[0]) === 'white' && coord.y === 0) {
        this.board[coord.y][coord.x] = 'Q'
        this.paren.removeChild(this.htmlb[coord.y][coord.x])
        const queen = document.createElement('piece')
        queen.classList.add(this.getClassColor(piece[0]))
        queen.classList.add(this.getClassPiece('Q'))
        translate(queen, {x: coord.x * 90, y: coord.y * 90})
        this.paren.appendChild(queen)
        this.htmlb[coord.y][coord.x] = queen
      }
      if (this.getClassColor(piece[0]) === 'black' && coord.y === 7) {
        this.board[coord.y][coord.x] = 'q'
        this.paren.removeChild(this.htmlb[coord.y][coord.x])
        const queen = document.createElement('piece')
        queen.classList.add(this.getClassColor(piece[0]))
        queen.classList.add(this.getClassPiece('q'))
        translate(queen, {x: coord.x * 90, y: coord.y * 90})
        this.paren.appendChild(queen)
        this.htmlb[coord.y][coord.x] = queen
      }
    }
  }

  this.randomInt = function(n) {
    return Math.floor(Math.random() * n)
  }

  this.randomItem = function(array) {
    return array[this.randomInt(array.length)]
  }

  this.anyCapture = function(moves) {
    for (let i = 0; i < moves.length; i++)
      if (this.isEnemyPiece(moves[i])) return true
    return false
  }

  this.coordNotation = function (coord) {
    const piece = this.get(coord).toLowerCase()
    return {p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔'}[piece] + 'abcdefgh'[coord.x] + (coord.y+1)
  }

  this.translate = function(element, coord) {
    element.style.transform = 'translate(' + (coord.x * 90) + 'px, ' + (coord.y * 90) + 'px)'
  }

}

// Global variables
const game = new Game([
  ['.','.','.','.','.','.','.','.'],
  ['.','.','.','.','.','.','.','.'],
  ['P','P','P','P','P','P','P','P'],
  ['.','.','.','.','.','.','.','.'],
  ['.','.','.','.','.','.','.','.'],
  ['p','p','p','p','p','p','p','p'],
  ['.','.','.','.','.','.','.','.'],
  ['.','.','.','.','.','.','.','.']
])
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
const board = document.querySelector('.board')

let draggedPiece = undefined
let draggedPieceCoords = undefined

let moves = 1
let alreadyselected = false

// Functions
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

function mousedown(e) {
  if (game.selected) game.unselect()
  if (!game.select(getBoardCoords(e))) return
  if (alreadyselected) alreadyselected = false
  draggedPiece = e.target
  draggedPiece.style.zIndex = '4'
  draggedPieceCoords = getFlooredCoords(e)
  const c = getRelativeCoords(e)
  translate(draggedPiece, {x: c.x - 45, y: c.y - 45})
}

function mousemove(e) {
  if (!draggedPiece) return
  e.preventDefault()
  const c = getRelativeCoords(e)
  translate(draggedPiece, {x: c.x - 45, y: c.y - 45})
}

function mouseup(e) {
  if (!draggedPiece) return
  const co = getBoardCoords(e)
  const move = game.move(co)
  if (move) {
    translate(draggedPiece, getFlooredCoords(e))
    addMove(move)
    document.title = 'Waiting for opponent'
  } else {
    if (alreadyselected) game.unselect()
    else alreadyselected = true
    translate(draggedPiece, draggedPieceCoords)
  }
  draggedPiece.style.zIndex = '2'

  draggedPiece = undefined
  draggedPieceCoords = undefined

  if (move) setTimeout(function () {
    addMove(game.moveAI())
    document.title = 'Your turn'
  }, 300)
}

function addMove(move) {
  const container = document.querySelector('.moves')
  if (moves % 1 === 0) {
    const index = document.createElement('div')
    index.classList.add('index')
    index.textContent = moves.toString()
    container.appendChild(index)
    container.scrollTop = container.scrollHeight
  }
  const movediv = document.createElement('div')
  movediv.classList.add('move')
  movediv.textContent = move
  container.appendChild(movediv)
  moves += .5
}

// Event Listeners
board.addEventListener('mousedown', mousedown)
board.addEventListener('mousemove', mousemove)
board.addEventListener('mouseup', mouseup)

// Code
game.fillBoard()