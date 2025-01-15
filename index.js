// Require express and body-parser
const express = require("express")
const bodyParser = require("body-parser")
const axios = require('axios')

// Initialize express and define a port
const app = express()
const PORT = 9092

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

let incident_id;
let page_id;

app.post("/hook", (req, res) => {
  console.log("INCOMING HOOK-------------")
  console.log(req.body)
  let instance = req.body.groupLabels.instance
  let status = req.body.status
  let component_id = req.body.commonLabels.id
  let tempIncident = incidentTemplate
  let tempComponent = componentTemplate

  if (status === 'firing') {
    tempIncident.incident.name = "OUTAGE-AT-" + instance
    tempIncident.incident.status = 'investigating'
    tempIncident.incident.impact_override = 'major'
    tempIncident.incident.components.component_id = 'major_outage'
    tempIncident.incident.component_ids = component_id
    tempComponent.component.status = 'major_outage'
    console.log("OUTGOING MESSAGE--------------")
    console.log(tempIncident)

    axios.post('https://api.statuspage.io/v1/pages/<ID>/incidents', tempIncident, {
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

    axios.put(`https://api.statuspage.io/v1/pages/${page_id}/components/${component_id}`, tempComponent, {
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
    tempIncident.incident.name = "OUTAGE-AT-" + instance
    tempIncident.incident.status = 'resolved'
    tempIncident.incident.impact_override = 'none'
    tempIncident.incident.components.component_id = 'operational'
    tempIncident.incident.component_ids[0] = component_id
    tempComponent.component.status = 'operational'
    console.log(tempIncident)
    axios.put(`https://api.statuspage.io/v1/pages/${page_id}/incidents/${incident_id}`, tempIncident, {
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

    axios.put(`https://api.statuspage.io/v1/pages/${page_id}/components/${component_id}`, tempComponent, {
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
