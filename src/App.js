import React, {Component} from 'react';
import Navigation from './Components/Navigation/Navigation.js';
import SignIn from './Components/SignIn/SignIn.js';
import Register from './Components/Register/Register.js';
import Logo from './Components/Logo/Logo.js';
import Rank from './Components/Rank/Rank.js';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js';
import Particles from 'react-particles-js';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    size: {
      value: 3
    }
  }
}

const initialState = {
  input: '',
  imageURL: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const boxes = [];
    const image = document.getElementById('inputimage');
    for (let region of data.outputs[0].data.regions) {
      const clarifaiFace = region.region_info.bounding_box;
      const width = Number(image.width);
      const height = Number(image.height);
      const box = {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
      boxes.push(box);
    }
    return boxes;
  }

  displayFaceBoxes = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    fetch('https://afternoon-lowlands-29808.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          input: this.state.input
      })
    })
      .then(response => response.json()) 
      .then(response => {
        fetch('https://afternoon-lowlands-29808.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: this.state.user.id
          })
        })
          .then(resp => resp.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
          .catch(err => console.log(err));
        this.displayFaceBoxes(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, imageURL, route, boxes} = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
        ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition boxes={boxes} imageURL={imageURL}/>
          </div>
        : (
          route === 'signin' || route === 'signout'
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : (
            route === 'register'
            ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : console.log('Unknown Route')
            )
          )
        }
      </div>
    );
  }
}

export default App;