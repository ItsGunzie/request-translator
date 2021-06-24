// Require express and body-parser
const express = require("express")
const bodyParser = require("body-parser")
const axios = require('axios')
let incident_id;
let page_id;

// Initialize express and define a port
const app = express()
const PORT = 9092

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

app.post("/hook", (req, res) => {
  console.log("INCOMING HOOK-------------")
  console.log(req.body)
  let instance = req.body.groupLabels.instance
  let status = req.body.status
  let component_id = req.body.commonLabels.id
  let tempJason = incidentTemplate
  let tempJason2 = componentTemplate

  if (status === 'firing') {
    tempJason.incident.name = "OUTAGE-AT-" + instance
    tempJason.incident.status = 'investigating'
    tempJason.incident.impact_override = 'major'
    tempJason.incident.components.component_id = 'major_outage'
    tempJason.incident.component_ids = component_id
    tempJason2.component.status = 'major_outage'
    console.log("OUTGOING MESSAGE--------------")
    console.log(tempJason)

    axios.post('https://api.statuspage.io/v1/pages/<ID>/incidents', tempJason, {
      headers: {
        'Authorization': //auth_code
      }
    })
    .then((res) => {
        incident_id = res.data.id
        console.log('RESPONSE -------------')
        console.log(`Status: ${res.status}`)
        console.log('Incident ID; ' + incident_id)
        console.log('Body: ', res.data)

    }).catch((err) => {
        console.error(err);
    });

    axios.put(`https://api.statuspage.io/v1/pages/${page_id}/components/${component_id}`, tempJason2, {
      headers: {
        'Authorization': //auth_code
      }
    })
    .then((res) => {
        console.log('RESPONSE -------------')
        console.log(`Status: ${res.status}`)
        console.log('Body: ', res.data)

    }).catch((err) => {
        console.error(err);
    });

  } else if (status === 'resolved') {
    tempJason.incident.name = "OUTAGE-AT-" + instance
    tempJason.incident.status = 'resolved'
    tempJason.incident.impact_override = 'none'
    tempJason.incident.components.component_id = 'operational'
    tempJason.incident.component_ids[0] = component_id
    tempJason2.component.status = 'operational'
    console.log(tempJason)
    axios.put(`https://api.statuspage.io/v1/pages/${page_id}/incidents/${incident_id}`, tempJason, {
      headers: {
        'Authorization': //auth_code
      }
    })
    .then((res) => {
      console.log('RESPONSE -------------')
        console.log(`Status: ${res.status}`);
        console.log('Body: ', res.data);
    }).catch((err) => {
        console.error(err);
    });

    axios.put(`https://api.statuspage.io/v1/pages/${page_id}/components/${component_id}`, tempJason2, {
      headers: {
        'Authorization': //auth_code
      }
    })
    .then((res) => {
        console.log('RESPONSE -------------')
        console.log(`Status: ${res.status}`)
        console.log('Body: ', res.data)

    }).catch((err) => {
        console.error(err);
    });

  }
  res.status(200).end() // Responding is important
})

let incidentTemplate = {
  "incident": {
    "name": "",
    "status": "",
    "impact_override": "none",
    "deliver_notifications": false,
    "backfilled": false,
    "components": {
      "component_id": ""
    },
    "component_ids": [
      ""
    ]
  }
}

let componentTemplate = {
  "component": {
    "status": "operational",
  }
}
