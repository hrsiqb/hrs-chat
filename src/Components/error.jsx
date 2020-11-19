import React, { Component } from 'react'

class Error404 extends Component {
    render() {
        return (
            <div className="flexCenter">
                <h1>Error 404</h1><h3>We could'nt find that page</h3>
            </div>
        )
    }
}
class NoDataFound extends Component {
    render() {
        return (
            <div className="flexCenter">
                <h1>Sorry</h1><h3>We did'nt find anything matching this serach</h3>
            </div>
        )
    }
}

export { Error404, NoDataFound }