// @flow
import React, {Component} from 'react';
import axios from 'axios'

var {parseString} = require('xml2js')

import styles from './Apps.css'

export default class Home extends Component<Props> {
  constructor(props) {
    super(props)

    this.state = {icons: []}
  }

  componentWillMount() {
    const host = `http://${this.props.location}:8060`
    axios.get(`${host}/query/apps`)
      .then(apps => this.xmlToJson(apps))
      .then(apps => this.parseAppList(apps))
      .then(list => {
        const icons = list.map(app => <img key={app.id}
                                           onClick={() => axios.post(`${host}/launch/${app.id}`)}
                                           src={`${host}/query/icon/${app.id}`}
                                           style={{padding: '5px'}} />)
        this.setState({icons})
      })
  }

  // flatten response
  parseAppList(apps) {
    return apps.map(app => {
      return {
        app: app['_'],
        id: app['$'].id,
        type: app['$'].type
      }
    });
  }

  // convert xml to json
  xmlToJson(input) {
    return new Promise((resolve, reject) => {
      if (!input.data) return reject('missing data')

      parseString(input.data, (err, results) => {
        if (err) return reject(err)
        if (!results.apps || !results.apps.app) return reject('missing apps')

        return resolve(results.apps.app)
      })
    })
  }

  render() {
    return (
      <div style={{flexWrap: 'wrap'}}>
        {this.state.icons}
      </div>
    )
  }
}
