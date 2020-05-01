// Global variables
const board = [
  ['br','bh','bb','bq','bk','bb','bh','br'],
  ['bp','bp','bp','bp','bp','bp','bp','bp'],
  [ '' , '' , '' , '' , '' , '' , '' , '' ],
  [ '' , '' , '' , '' , '' , '' , '' , '' ],
  [ '' , '' , '' , '' , '' , '' , '' , '' ],
  [ '' , '' , '' , '' , '' , '' , '' , '' ],
  ['wp','wp','wp','wp','wp','wp','wp','wp'],
  ['wr','wh','wb','wq','wk','wb','wh','wr']
]

const colors = {w: 'white', b: 'black'}
const pieces = {p: 'pawn', r: 'rook', h: 'knight', b: 'bishop', q: 'queen', k: 'king'}

const htmlboard = document.querySelector('.board')

let pieceD
let pieceDX
let pieceDY

// Event listeners
htmlboard.addEventListener('mousedown', dragStart)
htmlboard.addEventListener('mousemove', drag)
htmlboard.addEventListener('mouseup', dragEnd)

// Functions
function fillBoard() {
  const size = 90
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const data = board[y][x]
      if (!data) continue
      const piece = document.createElement('piece')
      piece.classList.add(colors[data[0]])
      piece.classList.add(pieces[data[1]])
      translate(piece, x * size, y * size)
      htmlboard.appendChild(piece)
    }
  }
}

fillBoard()

function dragStart(e) {
  if (e.target.tagName !== 'PIECE') return
  pieceD = e.target
  pieceD.style.zIndex = '4'
  let x = e.clientX - pieceD.parentNode.offsetLeft
  let y = e.clientY - pieceD.parentNode.offsetTop
  pieceDX = x - x % 90
  pieceDY = y - y % 90
  translate(pieceD, x - 45, y - 45)
}

function drag(e) {
  if (!pieceD) return
  let x = e.clientX - pieceD.parentNode.offsetLeft
  let y = e.clientY - pieceD.parentNode.offsetTop
  translate(pieceD, x - 45, y - 45)
}

function dragEnd(e) {
  if (!pieceD) return
  pieceD.style.zIndex = '2'
  let x = e.clientX - pieceD.parentNode.offsetLeft
  let y = e.clientY - pieceD.parentNode.offsetTop
  if (isInBoard(x, y)) {
    let boardX = x - x % 90
    let boardY = y - y % 90
    translate(pieceD, boardX, boardY)
  } else {
    translate(pieceD, pieceDX, pieceDY)
  }
  pieceD = undefined
}

// Helper functions
function translate(e, x, y) {
  e.style.transform = 'translate('+x+'px, '+y+'px)'
}

function isInBoard(x, y) {
  return 0 <= x && x <= 720 && 0 <= y && y <= 720
}