import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    result: {
      message: 'Hi there...',
      params: req.params,
      body: req.body,
      query: req.query
    }
  });
})

router.post('/', (req, res) => {
  res.status(201).json({
    result: {
      message: 'Hi there...',
      params: req.params,
      body: req.body,
      query: req.query
    }
  });
})

export default router
