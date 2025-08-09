import React, { Component } from 'react';
import box from '../box.png'

class Navbar extends Component {
  abbreviateAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  render() {
    return (
      <nav className="navbar navbar-dark p-0 text-monospace" style={{backgroundColor: '#4a5568'}}>
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="#"
        >
          <img src={box} width="30" height="30" className="align-top" alt="" />
          <span className="ml-2" style={{fontSize: '1.2rem', fontWeight: 'bold'}}>BlockBox</span>
        </a>
        <ul className="navbar-nav px-3">
          <li>
            <div className="d-flex align-items-center">
              <img 
                src="https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop" 
                width="24" 
                height="24" 
                className="mr-2" 
                alt="Ethereum"
                style={{borderRadius: '50%'}}
              />
              <span className="text-white" style={{fontSize: '0.9rem'}}>
                {this.abbreviateAddress(this.props.account)}
              </span>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;