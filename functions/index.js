const functions = require('firebase-functions')
const admin = require('firebase-admin')
const path = require('path')
admin.initializeApp(functions.config().config)

exports.episodeFile = functions.region('asia-northeast1').https.onRequest((request, response) => {
  return ((async () => {
    const bucket = admin.storage().bucket()
    const mediaPath = path.join('cast', request.path)
    const [file] = await bucket.file(mediaPath).get()
    const [metadata] = await file.getMetadata()
    if (!metadata.metadata) {
      console.warn('metadata', metadata)
      throw new Error('No metadata')
    }
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${mediaPath.split('/').join('%2F')}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`
    console.log('@@@', url)
    response.status(301).redirect(url)
  }))().catch(err => {
    if (err.code) {
      response.status(err.code).send(err.reason)
      return
    }
    console.error(err)
    response.status(500).send('Internal Error')
  })
})
