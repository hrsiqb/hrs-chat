import React, { Component } from 'react';
import './App.css';
import Header from './Components/header'
import { Error404 } from './Components/error';
import Chat from './Components/chat';
import { noUser } from './data'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    getLoginDetails,
    getUserData,
    killFriendsEventLisner,
    killAllEventLisners,
    addUserUpdatedEventListener
} from './config/firebase'
import {
    Route, Switch,
    HashRouter as Router, // if deploying on sub-directory uncomment this line
    // BrowserRouter as Router, // if deploying on root directory uncomment this line
    withRouter
} from "react-router-dom"
import history from './history'

class App extends Component {
    constructor() {
        super()
        this.state = {
            render: {},
            userInfo: {}
        }
    }
    componentDidMount() {
        this.checkLoginStatus()
    }
    // friendsListUpdated = (type, fId) => {
    //     if (type === 'added') {
    //         this.state.userInfo.friends ? this.state.userInfo.friends[fId] = fId
    //         : this.state.userInfo.friends = { [fId]: fId }
    //         this.state.sentRequests ? this.state.sentRequests[fId] ? delete this.state.sentRequests[fId]
    //         : this.state.userInfo.requests.
    //     }
    //     else delete this.state.userInfo.friends[fId]
    //     this.setState(this.state)
    // }
    userUpdated = data => {
        this.state.userInfo.friends = data.friends
        this.state.userInfo.sentRequests = data.sentRequests || {}
        this.state.userInfo.requests = data.requests || {}
        this.setState(this.state)
    }
    checkLoginStatus = (uId = null) => {
        this.state.render.loading = true
        this.setState(this.state)
        new Promise((res, rej) => getLoginDetails(res, rej))
            .then(data => {
                // getFriends(data, (type, recData) => this.friendsListUpdated(type, recData))
                addUserUpdatedEventListener(data.uId, recData => this.userUpdated(recData))
                if (!data.photoURL) data.photoURL = noUser.userPrimary
                this.state.userInfo = data
                // if (data.phone) {
                //     this.state.userInfo.isLoggedIn = true
                //     this.state.render.loading = false
                //     this.setState(this.state)
                // }
                // else {
                new Promise((res, rej) => getUserData(res, rej, data.uId))
                    .then((data) => {
                        this.state.userInfo.phone = data.phone
                        this.state.userInfo.friends = data.friends
                        this.state.userInfo.sentRequests = data.sentRequests || []
                        this.state.userInfo.requests = data.requests
                        this.state.userInfo.isLoggedIn = true
                        this.state.render.loading = false
                        this.setState(this.state)
                    })
                    .catch((error) => {
                        this.state.userInfo.isLoggedIn = false
                        this.state.render.loading = false
                        this.setState(this.state)
                    })
                // }
            })
            .catch(() => {
                killAllEventLisners('Users')
                killAllEventLisners('Chats')
                uId && killFriendsEventLisner(uId)
                this.state.userInfo = {}
                this.state.userInfo.isLoggedIn = false
                this.state.render.loading = false
                this.setState(this.state)
            })
    }
    render() {
        return (
            <div className="root">
                <Backdrop className='fc-w zInd-12' open={this.state.render.loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Header history={this.props.history} loginCallback={this.checkLoginStatus}
                    userInfo={this.state.userInfo} />
                <Chat history={this.props.history} userInfo={this.state.userInfo} />
                {/* <Router>
                    <Route path='/' children={<Header history={this.props.history} loginCallback={this.checkLoginStatus}
                        userInfo={this.state.userInfo} />} />
                    <Switch>
                        <Route exact path={['/', '/home']} children={<Chat history={this.props.history} userInfo={this.state.userInfo} />} />
                        <Route path={'/'} component={Error404} />
                    </Switch>
                </Router> */}
            </div>
        )
    }
}

export default App;