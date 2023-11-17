import app from './src/app'

const PORT = process.env.PORT || 3333

const server = app.listen(PORT, () => {
  console.log('WSV lms start with port ' + PORT)
})

process.on('SIGINT', () => {
  server.close(() => console.log('Exits Server Express'))
})
