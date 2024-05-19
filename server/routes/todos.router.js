const router = require('express').Router();
const pool = require('../modules/pool');

//GET
router.get('/', (req, res) => {
  const queryText = `
    SELECT * FROM "todos" 
    ORDER BY "isComplete", "complete_date" DESC;`;
  pool
    .query(queryText)
    .then((result) => res.send(result.rows))
    .catch((error) => {
      console.error(`Error in GET`, error);
      res.sendStatus(500);
    });
});

//POST
router.post('/', (req, res) => {
  const queryText = `
    INSERT INTO "todos" ("text") VALUES ($1) RETURNING *;`;
  pool
    .query(queryText, [req.body.text])
    .then((result) => {
      res.status(201).send(result.rows[0]);
    })
    .catch((error) => {
      console.error(`Error in POST`, error);
      res.sendStatus(500);
    });
});

//DELETE
router.delete('/:id', (req, res) => {
  const queryText = `DELETE FROM "todos" WHERE "id"=$1 RETURNING *;`;
  pool
    .query(queryText, [req.params.id])
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.log(`Error in DELETE`, error);
      res.sendStatus(500);
    });
});

//FISHING
router.put('/gone-fishing', (req, res) => {
  const queryText = `
    UPDATE "todos" 
    SET "isComplete"= TRUE, 
    "complete_date"= NOW();`;
  pool
    .query(queryText)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(`Error in Gone Fishing`, error);
      res.sendStatus(500);
    });
});

//RESET
router.put('/reset', (req, res) => {
  const queryText = `UPDATE "todos" SET "isComplete"= FALSE, "complete_date"= NULL;`;
  pool
    .query(queryText)
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.error(`Error in RESET`, error);
      res.sendStatus(500);
    });
});

//PUT (update todo text)
router.put('/update/:id', (req, res) => {
  const queryText = `
            UPDATE "todos" 
            SET "text" = $2
            WHERE "id"=$1
            RETURNING *;`;
  pool
    .query(queryText, [req.params.id, req.body.text])
    .then((result) => {
      res.status(200).send(result.rows[0]);
    })
    .catch((error) => {
      console.log(`Error in UPDATE TODO TEXT`, error);
      res.sendStatus(500);
    });
});

//PUT (toggle complete)
router.put('/:id', (req, res) => {
  const queryText = `
          UPDATE "todos" 
          SET "isComplete"= NOT "isComplete", 
          "complete_date"= 
              CASE WHEN NOT "isComplete" 
                  THEN NOW() 
                  ELSE NULL 
              END 
          WHERE "id"=$1
          RETURNING *;`;
  pool
    .query(queryText, [req.params.id])
    .then((result) => {
      res.status(200).send(result.rows[0]);
    })
    .catch((error) => {
      console.log(`Error in PUT`, error);
      res.sendStatus(500);
    });
});

module.exports = router;
