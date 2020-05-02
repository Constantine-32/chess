// Clasess
function State(board) {
  this.board = board

  this.get = function (coord) {
    return this.board[coord.y][coord.x]
  }
}

function Game(board) {
  this.color = 'w'
  this.state = new State(board)
  this.states = [this.state]

  this.pieceSelected = undefined
  this.pieceD = undefined
  this.pieceDPos = undefined

  this.generateBoard = function () {
    const colors = {w: 'white', b: 'black'}
    const pieces = {p: 'pawn', r: 'rook', h: 'knight', b: 'bishop', q: 'queen', k: 'king'}
    const board = document.querySelector('.board')
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const data = this.get({x: x, y : y})
        if (!data) continue
        const piece = document.createElement('piece')
        piece.classList.add(colors[data[0]])
        piece.classList.add(pieces[data[1]])
        this.translate(piece, {x: x * 90, y: y * 90}, false)
        board.appendChild(piece)
      }
    }
  }

  this.select = function (coord) {
    this.pieceSelected = coord
  }

  this.move = function (coord) {
    console.log('move from ', this.pieceSelected, ' to ', coord)
  }

  this.get = function (coord) {
    return this.state.get(coord)
  }

  this.dragStart = function (e) {
    if (e.target.tagName !== 'PIECE') return
    if (!e.target.classList.contains('white')) return
    this.pieceD = e.target
    this.select(this.getBoardCoords(e))
    this.pieceD.style.zIndex = '4'
    this.pieceDPos = this.getRoundedCoords(e)
    this.translate(this.pieceD, this.getCoords(e), true)
  }

  this.drag = function (e) {
    if (!this.pieceD) return
    e.preventDefault()
    this.translate(this.pieceD, this.getCoords(e), true)
  }

  this.dragEnd = function (e) {
    if (!this.pieceD) return
    this.pieceD.style.zIndex = '2'

    // let x = e.clientX - this.pieceD.parentNode.offsetLeft
    // let y = e.clientY - this.pieceD.parentNode.offsetTop
    // if (this.isInBoard(x, y)) {
    //   let boardX = x - x % 90
    //   let boardY = y - y % 90
    //   this.translate(this.pieceD, boardX, boardY)
    // } else {
    //   this.translate(this.pieceD, this.pieceDX, this.pieceDY)
    // }

    const co = this.getBoardCoords(e)

    if (0 <= co.x && co.x < 8 && 0 <= co.y && co.y < 8) {
      this.move(co)
      this.translate(this.pieceD, this.getRoundedCoords(e), false)
    }
    else this.translate(this.pieceD, this.pieceDPos, false)
    this.pieceD = undefined
  }

  this.getCoords = function (e) {
    return {
      x: e.clientX - this.pieceD.parentNode.offsetLeft,
      y: e.clientY - this.pieceD.parentNode.offsetTop
    }
  }

  this.getRoundedCoords = function (e) {
    const co = this.getCoords(e)
    return {x: co.x - co.x % 90, y: co.y - co.y % 90}
  }

  this.getBoardCoords = function (e) {
    const co = this.getCoords(e)
    return {x: Math.floor(co.x / 90), y: Math.floor(co.y / 90)}
  }

  this.translate = function (piece, coord, center) {
    piece.style.transform = 'translate('+(coord.x - (center ? 45 : 0))+'px, '+(coord.y - (center ? 45 : 0))+'px)'
  }
}

// Global variables
const game = new Game([
  ['br','bh','bb','bq','bk','bb','bh','br'],
  ['bp','bp','bp','bp','bp','bp','bp','bp'],
  [ '' , '' , '' , '' , '' , '' , '' , '' ],
  [ '' , '' , '' , '' , '' , '' , '' , '' ],
  [ '' , '' , '' , '' , '' , '' , '' , '' ],
  [ '' , '' , '' , '' , '' , '' , '' , '' ],
  ['wp','wp','wp','wp','wp','wp','wp','wp'],
  ['wr','wh','wb','wq','wk','wb','wh','wr']
])

game.generateBoard()

// Event listeners
document.body.addEventListener('mousedown', function (e) { game.dragStart(e) }, false)
document.body.addEventListener('mouseup', function (e) { game.dragEnd(e) }, false)
document.body.addEventListener('mousemove', function (e) { game.drag(e) }, false)