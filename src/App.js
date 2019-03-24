import React, {Component} from 'react';
import fetchJsonp from 'fetch-jsonp';

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            currentRsvp: null,
            property: 0
        }

        this.escFunction = this.escFunction.bind(this);
    }

    escFunction(event) {
        let keyCodeSpace = 32;
        if (event.keyCode === keyCodeSpace) {
            if(this.interval) {
                clearInterval(this.interval)
            }

        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);

        fetchJsonp('https://api.meetup.com/JUG-Mainz/events/258740854/rsvps?photo-host=public&sig_id=229485075&sig=c5d1c267409ca5f7c7f6068abf5c4a4602dd731e')
            .then(function (response) {
                return response.json()
            })
            .then((json) => this.setState({
                data: json.data
                    .filter((rsvp) => rsvp.response === 'yes')
                    .filter((rsvp) => rsvp.member.event_context.host === false)
            }))
            .catch((ex) => console.log('parsing failed', ex))

        this.interval = setInterval(() => {
            this.setState({property: this.calculateNewNumber()})
        }, 30);

    }

    calculateNewNumber() {
        var rsvpCount = this.state.data.length;
        console.log("Rsvp Count " + rsvpCount)
        var randIndex = Math.floor(Math.random() * rsvpCount)
        console.log("Index " + randIndex)
        this.setState({currentRsvp: this.state.data[randIndex]})
    }

    render() {
        let rsvp = this.state.currentRsvp
        return (
            (rsvp) ?
                <div className="App" onKeyPress={() => clearInterval(this.interval)}>
                    <div className="profile" key={rsvp.member.id}>
                        {(rsvp.member.photo) ?
                            <img src={rsvp.member.photo.photo_link}/> :
                            <img src="img/blank.png"/>}
                        <h2>{rsvp.member.name}</h2>
                    </div>
                </div>
                : null
        );
    }
}

export default App;
