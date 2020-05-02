// Clasess
function State(board) {
  this.board = board

  this.get = function (coord) {
    return this.board[coord.y][coord.x]
  }
}

function Game(board) {
  this.color = 'w'
  this.states = [new State(board)]
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