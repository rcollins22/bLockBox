import React, { Component } from 'react';
import Identicon from 'identicon.js';
import box from '../box.png'

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-success p-0 text-monospace">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={box} width="30" height="30" className="align-top" alt="" />
          (b)LockBox
        </a>
        <ul className="navbar-nav px-3">
          <li>
            <small id="account">
              <a target="_blank"
                alt=""
                className="text-white"
                rel="noopener noreopener"
                href={'www.google.com'}>
                  {this.props.account}
                </a>
            </small>
            {this.props.account ? <img
              className='ml-2'
              width='30'
              height="30"
              src={`data:image/png;base64,${new Identicon(this.props.account,30).toString()}`}
              alt=""/> : <span/>
            }
        
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;