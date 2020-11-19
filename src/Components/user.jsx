import React, { Component } from 'react'
import Avatar from '@material-ui/core/Avatar';

export default class User extends Component {
    render() {
        const bColor = this.props.bColor
        return (
            <li className={`${bColor} b-b-1gry1 lst-n w-m-100 d-fr jc-sb p-2 h-p h-bc-gry1`}
                onClick={this.props.onClick} id={this.props.data.uId}>
                <div className="d-fr">
                    <div className="d-f mr-3 pos-r">
                        <Avatar className="brad-50p w-50px h-50px" src={this.props.data.imageFile} alt={this.props.data.name} />
                        <div className='status-indicator'></div>
                    </div>
                    <div className="ta-s">
                        <p className="m-0 f-20 f-cap">{this.props.data.name}</p>
                        <p className="m-0 text-secondary">{this.props.data.email}</p>
                    </div>
                </div>
                <div className="d-fr ai-c">
                    <span className="badge badge-success" className="badge badge-success mt-2px brad-50p"></span>
                    <p className="m-5px text-secondary"></p>
                </div>
            </li>
        )
    }
}
