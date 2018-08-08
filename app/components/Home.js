// @flow
import React, {Component} from 'react';
import RokuController from './RokuController'
import Apps from './Apps'
import {Client} from 'node-ssdp'

import styles from './Home.css'

type Props = {};

export default class Home extends Component<Props> {
  constructor(props) {
    super(props)

    this.state = { location: null }
  }

  componentWillMount() {
    const client = new Client()
    const me = this
    client.on('response', function (headers, statusCode, rinfo) {
      console.log(`Found roku device at ${rinfo.address}`)
      me.setState({location: rinfo.address})
    })

    // search for a service type
    client.search('roku:ecp')
  }

  render() {
    if(!this.state.location) return <div>Finding Roku Device...</div>

    return (
      <div style={{flexDirection: 'row'}}>
        <div style={{alignSelf: 'flex-start',
        flexDirection: 'column',
          minWidth: '200px',
          padding: '20px',
          flex: 0.2}}>
          <RokuController location={this.state.location}/>
        </div>
        <div style={{flex: 0.8}}>
        <Apps location={this.state.location}/>
        </div>
      </div>
    )
  }
}

