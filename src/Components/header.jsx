import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import { noUser } from '../data'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom"
import { getLoginDetails, logout } from '../config/firebase'
import { LoginDialogComp, RegisterDialogComp, AddFriendDialogComp } from './dialog'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Avatar from '@material-ui/core/Avatar';
import SearchIcon from '@material-ui/icons/Search';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withSnackbar } from 'notistack';
import Dropdown from 'react-bootstrap/Dropdown'
import { FiLogOut, FiChevronDown } from 'react-icons/fi';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { GrDown } from 'react-icons/gr';
import { BsFiles } from 'react-icons/bs';

class Header extends Component {
    constructor() {
        super()
        this.state = {
            userInfo: {},
            openLoginDialog: false,
            openRegisterDialog: false,
            loading: false
        }
    }
    handleLogout = () => {
        this.state.loading = true
        new Promise((res, rej) => logout(res, rej))
            .then(() => {
                this.setState({ ...this.state, isLoggedIn: false, loading: false })
                this.props.loginCallback()
                this.showSnackBar('Logout successful', 'success')
            })
            .catch((error) => {
                this.setState({ ...this.state, loading: false })
                this.showSnackBar(error.message, 'danger')
            })
    }
    showSnackBar = (msg, variant) => {
        this.props.enqueueSnackbar(msg, {
            variant,
            autoHideDuration: 5000
        });
    }
    openDialog(type) {
        switch (type) {
            case 'login':
                this.state.openLoginDialog = true
                this.setState(this.state)
                break;
            case 'register':
                this.state.openRegisterDialog = true
                this.setState(this.state)
                break;
            case 'addFriend':
                this.state.openAddFriendDialog = true
                this.setState(this.state)
                break;
        }
    }
    closeDialog(callCheck = false) {
        this.state.openRegisterDialog = false
        this.state.openLoginDialog = false
        this.state.openAddFriendDialog = false
        if (callCheck) this.props.loginCallback()
        else this.setState(this.state)
    }
    render() {
        let btnDisplay = true
        if (this.props.userInfo.isLoggedIn) this.state.userInfo = this.props.userInfo
        else if (this.props.userInfo.isLoggedIn === false) {
            this.state.userInfo.isLoggedIn = false
            btnDisplay = false
        }
        return (
            <Navbar sticky="top" bg="light" className="b-b-2gry vh-mn-10" expand="lg">
                <Backdrop className='fc-w zInd-12' open={this.state.loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Navbar.Brand className="ml-3 p-0" style={{ fontSize: "30px" }}>
                    <Link disabled={btnDisplay} className="n-l ol-n" to="/">
                        <img src={require("../Images/chatappIcon.png")} alt="brand" width="37px" />
                    </Link>
                </Navbar.Brand>
                {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
                <div id="basic-navbar-nav" className="d-c">
                    <Nav className="ml-auto d-fr">
                        {/* <Navbar.Collapse id="basic-navbar-nav"> */}
                        {this.state.userInfo.isLoggedIn ? (
                            <React.Fragment>
                                <IconButton className="ol-n p-2" onClick={() => this.openDialog('addFriend')}>
                                    <PersonAddIcon className="f-29 fc-blu1" />
                                </IconButton>
                                <div className="ml-3 mr-4 vl"></div>
                                <Dropdown alignRight>
                                    <Dropdown.Toggle className="d-n-a bc-trn mr-4 p-0 b-n bs-n h-100" id="user-dropdown" >
                                        <div className="w-100 h-100 d-fr ai-c">
                                            <Avatar className="" alt={this.state.userInfo.name} src={this.state.userInfo.photoURL} />
                                            <GrDown className="f-22 ml-1" />
                                        </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="mt-1 p-3">
                                        <section className="d-fr ai-c h-p">
                                            <Avatar className="sellerAvatar" alt="userAvatar" src={this.state.userInfo.photoURL} />
                                            <section className="ml-3">
                                                <p className="f-22 f-b7 m-0 f-cap">{this.state.userInfo.displayName}</p>
                                                <p className="text-secondary f-14 m-0">{this.state.userInfo.email}</p>
                                            </section>
                                        </section>
                                        <Dropdown.Divider />
                                        <Dropdown.Item className="p-2 pl-0"><BsFiles className="mr-3 f-22" />My Adds</Dropdown.Item>
                                        <Dropdown.Item className="p-2 pl-0" onClick={this.handleLogout}><FiLogOut className="mr-3 f-22" />Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </React.Fragment>)
                            : (
                                <React.Fragment>
                                    <ButtonGroup className="ml-4 mr-3" variant="text" color="" aria-label="text primary button group">
                                        <Button disabled={btnDisplay} className="f-b fc-blk ol-n pr-3 pl-3" onClick={() => this.openDialog('login')}>Login</Button>
                                        <Button disabled={btnDisplay} className="f-b fc-blk ol-n pl-3 pr-3" onClick={() => this.openDialog('register')}>SignUp</Button>
                                    </ButtonGroup>
                                </React.Fragment>
                            )}
                        {/* </Navbar.Collapse> */}
                        <LoginDialogComp onClose={(check) => this.closeDialog(check)} open={this.state.openLoginDialog} />
                        <RegisterDialogComp onClose={(check) => this.closeDialog(check)} open={this.state.openRegisterDialog} />
                        <AddFriendDialogComp onClose={(check) => this.closeDialog(check)} userInfo={this.props.userInfo}
                            open={this.state.openAddFriendDialog} />
                    </Nav>
                </div>
            </Navbar >
        )
    }
}
export default withSnackbar(Header);