//import BLockBox from '../abis/BLockBox.json'
import React, { Component } from "react";
import Navbar from "./Navbar";
import Main from "./Main";
import Web3 from "web3";
import "./App.css";
import BlockBox from  "../abis/BLockBox.json" 
import { ThemeProvider, Spinner } from "react-bootstrap";

//Declare IPFS
const ipfsc = require('ipfs-http-client');
const ipfs = ipfsc({host:'ipfs.infura.io',port: 5001, protocol: 'https'})

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentPRovider)
    }
    else{
      window.alert("No Ethereum Browser Detected")
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    this.setState({ loading: false });
    const accounts = await web3.eth.getAccounts()
    this.setState({account : accounts[0]})
    console.log("ACCOUNT",this.state.account)
    const netId = await web3.eth.net.getId()
    console.log("NET ID",netId)
    const netData = BlockBox.networks[netId]
    if (netData) {
      const blockbox = new web3.eth.Contract(BlockBox.abi,netData.address);
      this.setState({blockbox})
      const fileCount = await blockbox.methods.idCount().call()
      this.setState({fileCount})
      
      for (let i = fileCount; i>=1; i--){
        const file = await blockbox.methods.files(i).call()
        this.setState({files:[...this.state.files,file]})
      }
      
    } else {
      window.alert('Blockchain not connected')
    }
    
    
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name
      })
      console.log('Buffer Arr', this.state.buffer)
    }
  };

  //Upload File
  upload = description => {
    console.log("sending to ipfs")
    ipfs.add(this.state.buffer,(error,result) => {
      console.log('IPFS Return', result)

      if(error) {
        window.alert(error)
        return
      }
      this.setState ({loading:true})
      if (this.state.type === "") {
        this.setState({type:'none'})
      }
      this.state.blockbox.methods
        .upload(
          result[0].hash,
          result[0].size,
          this.state.type,
          this.state.name,
          description
        )
        .send({ from: this.state.account })
        .on("transactionHash", (hash) => {
          this.setState({
            loading: false,
            type: null,
            name: null,
          });
          window.location.reload();
        })
        .on("error", (e) => {
          window.alert(e);
          this.setState({ loading: false });
        });
        
      
    })


  };

  //Set states
  constructor(props) {
    super(props);
    this.state = {
      loading : true,
      account : '',
      blockbox : null,
      files: [],
      type: null,
      name: null
    };

    //Bind functions
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {this.state.loading ? (
          <div id="loader" className="text-center mt-5">
            <Spinner animation ="border" size="xl"/>
          </div>
        ) : (
          <Main
            files={this.state.files}
            captureFile={this.captureFile}
            uploadFile={this.upload}
          />
        )}
      </div>
    );
  }
}

export default App;
