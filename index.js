const axios = require('axios')
const express = require('express')
const cors = require('cors')
const app = express()
const port = 4000

app.use(cors())
app.use(express.json())

app.get('/api/auth', (req, res) => {
  const { clientCode, username, password } = req.query
  axios.get(`https://${clientCode}.erply.com/api/?clientCode=${clientCode}&username=${username}&password=${password}&request=verifyUser&sendContentType=1`)
  .then((response) => {
    return res.json(response?.data)
  })
  .catch((error) => {
    return res.json(error)
  })
})

app.get('/api/getRequest', (req, res) => {
  const { clientCode, sessionKey, request } = req.query
  axios.get(`https://${clientCode}.erply.com/api/?clientCode=${clientCode}&sessionKey=${sessionKey}&request=${request}&sendContentType=1`)
  .then(response => {
    return res.json(response?.data)
  })
  .catch(error => {
    return res.json(error)
  })
})

app.get('/api/loadCafa', (req, res) => {
  const { application, level, level_id, name } = req.query
  const params = new URLSearchParams({
    application: application,
    level:level,
    level_id:level_id,
    name:name
  })
  const url = `https://api-cafa-demo.erply.com/configuration?${params}`
  const headers = {
    jwt: req?.headers?.jwt
  }

  axios.get(url, {
    headers: headers
  }).then(response => {
    return res.json(response?.data)
  }).catch(error => {
    return res.json(error)
  })
})

app.post('/api/saveCafa', (req, res) => {
  const { application, level, level_id, name } = req.query
  const headers = {
    jwt: req?.headers?.jwt
  }
  const params = new URLSearchParams({
    application: application,
    level:level,
    level_id:level_id,
    name:name
  })
  const url = `https://api-cafa-demo.erply.com/configuration?${params}`
  const body = req.body
  
  //make post to cafa
  axios.post(url, body, {
    headers: headers
  }).then(response => {
    //if already exists, update values
    if (response.data?.message === "Already exists") {
      axios.put(url, body, {
        headers: headers
      }).then((response => {
        return res.json(response?.data)
      })).catch(error => {
        return res.json(error)
      })
    } else {
      return res.json(response?.data)
    }
  }).catch(error => {
    return res.json(error)
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})