import React from 'react';

import '../../App.css';

import AppBar from 'material-ui/AppBar';
import {Card, CardMedia, CardTitle} from 'material-ui/Card';

import fubox from '../../static/fubox.jpg'
import usCaboRing from '../../static/us_cabo_ring.jpg'
import usCollage from '../../static/us_collage.jpeg'
import noodles from '../../static/noodles.jpeg'

class Home extends React.Component {
  render() {
    return (
      <div className="App">
        <AppBar iconElementLeft={<span/>} style={{background: '#5388CD'}} title="JJ and Amara"/>

        <Card className="homeCard" onClick={() => console.log('hey')}>
          <CardMedia
            overlay={
              <CardTitle title="Wedding details" subtitle="Stuff you should know"/>
            }>
            <img src={usCaboRing} alt=""/>
          </CardMedia>
        </Card>

        <Card className="homeCard" onClick={() => console.log('hey')}>
          <CardMedia
            overlay={
              <CardTitle title="Registry" subtitle="Because your presence isn't enough"/>
            }>
            <img src={fubox} alt=""/>
          </CardMedia>
        </Card>

        <Card className="homeCard" onClick={() => console.log('hey')}>
          <CardMedia
            overlay={
              <CardTitle title="Our story" subtitle="It's adorable"/>
            }>
            <img src={usCollage} alt=""/>
          </CardMedia>
        </Card>

        <Card className="homeCard" onClick={() => console.log('hey')}>
          <CardMedia
            overlay={
              <CardTitle title="FAQ" subtitle="So many questions"/>
            }>
            <img src={noodles} alt=""/>
          </CardMedia>
        </Card>

      </div>
    )
  }
}

export default Home;