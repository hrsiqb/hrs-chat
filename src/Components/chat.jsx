import React, { Component } from 'react'
import User from './user'
import { UserSkeleton, MessagesSkeleton } from './skeleton'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { categories, cities, noUser, noAd } from '../data'
import { ChatBubble, MessagesPannel } from './chatComps'
import {
    addMessagesEventListener,
    addUsersChildEventListener,
    getUserData,
    insertMessage,
    killChatEventListener,
    generateChatId
} from '../config/firebase'

export default class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: {},
            render: { firstRun: true },
            storage: {},
            users: [],
            messages: {}
        }
    }
    componentDidMount() {
        this.state.userInfo.isLoggedIn === true && this.getUsers()
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.state.render.firstRun)
                this.state.userInfo.isLoggedIn === true && this.getUsers()
            else {
                if (!this.state.userInfo.isLoggedIn) {
                    this.setState({
                        userInfo: {},
                        render: { firstRun: true },
                        storage: {},
                        users: [],
                        messages: {}
                    })
                }
            }
        }
    }
    clearInput = () => {
        if (document.getElementById('newMessage')) document.getElementById('newMessage').value = ''
    }
    sendMessage = () => {
        this.state.storage.newMessage && insertMessage(this.state.userInfo, this.state.storage)
        this.state.storage.newMessage = ''
        this.clearInput()
    }
    handleKeyDown = e => e.key === 'Enter' && this.sendMessage()
    handleChange = e => this.state.storage.newMessage = e.target.value
    handleUser = e => {
        var ul = e.currentTarget.parentNode.childNodes
        for (var i = 0; i < ul.length; i++) {
            if (ul[i].className.includes('bc-gry1'))
                ul[i].classList.remove('bc-gry1')
        }
        e.currentTarget.classList.add('bc-gry1')
        this.state.storage.activeUser = e.currentTarget.id
        this.setState(this.state)
        this.clearInput()
    }
    getUsers = () => {
        this.state.render.firstRun = false
        addUsersChildEventListener('friends', this.state.userInfo.uId, (type, fId) => {
            if (type === 'added') {
                new Promise((res, rej) => getUserData(res, rej, fId))
                    .then(data => {
                        let cId = generateChatId(this.state.userInfo.uId, fId)
                        this.state.users.push(data)
                        this.state.render.noUsers = false
                        if (!this.state.userInfo.chatIds) this.state.userInfo.chatIds = []
                        this.state.userInfo.chatIds.push(cId)
                        this.setState(this.state)
                        addMessagesEventListener(cId, (chatId, data) => {
                            if (!this.state.messages[chatId]) this.state.messages[chatId] = []
                            this.state.messages[chatId].push(data)
                            this.setState(this.state)
                        })
                    })
            }
            else {
                let index = null
                for (var i = 0; i < this.state.users.length; i++) {
                    index = i
                    if (this.state.users[i].uId === fId) break
                }
                let chatId = generateChatId(this.state.userInfo.uId, fId)
                killChatEventListener(chatId)
                this.state.storage.activeChat = null
                this.state.storage.activeUser = null
                delete this.state.messages[chatId]
                this.state.users.splice(index, 1)
                !this.state.users.length && (this.state.render.noUsers = true)
                this.setState(this.state)
            }
        })
        if (!this.state.userInfo.friends) this.setState({ render: { ...this.state.render, noUsers: true } })
    }
    render() {
        let users = []
        let messages = []
        if (this.props.userInfo.isLoggedIn === true) {
            this.state.userInfo = this.props.userInfo
            if (!this.state.render.noUsers) {
                if (this.state.users.length) {
                    var bColor = ''
                    users = this.state.users.map((data, index) => {
                        return <User index={index} onClick={this.handleUser} data={data} bColor={bColor} />
                    })
                    if (this.state.storage.activeUser) {
                        // if (!Object.keys(this.state.messages).length) messages = []
                        // else {
                        this.state.storage.activeChat = generateChatId(this.state.userInfo.uId, this.state.storage.activeUser)
                        let activeChat = this.state.storage.activeChat
                        if (this.state.messages[activeChat]) {
                            // document.getElementById(this.state.storage.activeUser).classList.add('bc-gry1')
                            this.state.messages[activeChat].map((data, index) => {
                                let message = {}
                                if (data.fromUid === this.state.userInfo.uId)
                                    message = { message: data.message, type: 'sent' };
                                else message = { message: data.message, type: 'received' }
                                messages.push(<ChatBubble data={message} index={index} />)
                            })
                        }
                        messages = <MessagesPannel messages={messages} handleChange={this.handleChange}
                            handleKeyDown={this.handleKeyDown} sendMessage={this.sendMessage} />
                        // }
                    }
                    else {
                        messages = (
                            <div className="b-l-1gry1 vw-70 h-100">
                                <div className="bc-gry1 d-f w-100 h-100 jc-c ai-c">
                                    <h1 className="fc-gry ta-c">Welcome!<br /><br />Click on a user to start chatting with them</h1>
                                </div>
                            </div>)
                    }
                }
                else {
                    users.push(Array.from(new Array(7), () => <UserSkeleton />))
                    messages = <MessagesSkeleton />
                }
                users = <ul className="p-0">{users}</ul>
            }
        }
        else if (this.props.userInfo.isLoggedIn === false) {
            this.state.userInfo.isLoggedIn = false
        }
        return (
            this.state.userInfo.isLoggedIn === false ?
                <div className="d-fc ai-c jc-c vh-90 w-100">
                    <img src={require("../Images/login.png")} alt="login" width="300px" />
                    <h2 className="text-secondary mt-3">Please Login/SignUp to Continue</h2>
                </div>
                :
                !this.state.render.noUsers ?
                    <div className="d-fr vh-90 w-100">
                        <Backdrop className='fc-w zInd-12' open={this.state.render.loading}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        {/* <!-- Users Panel --> */}
                        <div className="vw-30 h-100 of-a">
                            {users}
                        </div>
                        {/* <!-- Messages Panel --> */}
                        {messages}
                    </div>
                    :
                    <div className="d-fc ai-c jc-c vh-88-9 w-100">
                        <h2 className="text-secondary">No messages yet!</h2>
                        <img src={require("../Images/noChat.jpg")} alt="noChat" />
                        <h2 className="text-secondary">
                            Add a friend to start chatting</h2>
                    </div>
        )
    }
}
