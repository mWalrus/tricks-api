var express = require('express')
var sqlite3 = require('sqlite3').verbose()
var cors = require('cors')
var router = express.Router()

router.use('*', cors())

var db = new sqlite3.Database('tricks.db')

var dbResults = []

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({ test: 'msg' })
})
router.get('/:table/get', function (req, res, next) {
  readTable(setResults, req.params.table)
  function setResults(val) {
    res.send(val)
    return
  }
})

router.post('/:table/set', function (req, res, next) {
  try {
    setNewEntry(
      req.params.table,
      req.body.title,
      req.body.code,
      req.body.comment
    )
    res.send('success')
  } catch (error) {
    res.send({ error })
  }
})

router.get('/:table/remove/:id', function (req, res, next) {
  db.run(
    `DELETE FROM ${req.params.table} WHERE rowid=${req.params.id}`
  )
  res.send({
    response: `removed entry from ${req.params.table} where id is ${req.params.id}`,
  })
})

function setNewEntry(table, title, code, comment) {
  if (!title || !code || !comment) return
  db.run(
    `INSERT INTO ${table}(title, code, comment) VALUES(?, ?, ?)`,
    [title, code, comment],
    (err) => {
      if (err) console.log(err)
    }
  )
  return
}

function readTable(cb, table) {
  db.serialize(() => {
    db.all(
      `SELECT rowid AS id, title, code, comment FROM ${table}`,
      (err, results) => {
        cb(results)
      }
    )
  })
}

module.exports = router
