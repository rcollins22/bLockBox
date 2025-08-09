import React, { Component } from "react";
import { convertBytes } from "./helpers";
import moment from "moment";

class Main extends Component {
  getFileIcon = (fileType) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎬';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('text')) return '📝';
    return '📄';
  }

  handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Simulate file input change
      const event = { target: { files: files } };
      this.props.captureFile(event);
    }
  }

  render() {
    return (
      <div className="container-fluid mt-3" style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
        <div className="row">
          <div className="col-lg-8">
            <div className="bg-white rounded shadow-sm p-4 mb-4">
              {/* Drag and Drop Area */}
              <div 
                className="drag-drop-area text-center p-5 mb-4"
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
                style={{
                  border: '2px dashed #dee2e6',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <div style={{fontSize: '3rem', color: '#6c757d', marginBottom: '1rem'}}>+</div>
                <h5 className="text-muted">Drag and <span style={{color: '#6c757d'}}>drop files here</span></h5>
                <input
                  id="fileInput"
                  type="file"
                  onChange={this.props.captureFile}
                  style={{display: 'none'}}
                />
              </div>

              {/* Search and Controls */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-white border-right-0">
                        🔍
                      </span>
                    </div>
                    <input 
                      type="text" 
                      className="form-control border-left-0" 
                      placeholder="Search files..."
                    />
                  </div>
                </div>
                <div className="col-md-6 d-flex justify-content-end align-items-center">
                  <button className="btn btn-outline-secondary btn-sm mr-2">Browse</button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      const description = prompt("Enter file description:");
                      if (description) this.props.uploadFile(description);
                    }}
                  >
                    Upload
                  </button>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="mb-4">
                <button className="btn btn-outline-secondary btn-sm mr-2">Images</button>
                <button className="btn btn-outline-secondary btn-sm mr-2">Videos</button>
                <button className="btn btn-outline-secondary btn-sm mr-2">PDFs</button>
                <button className="btn btn-outline-secondary btn-sm">Clear</button>
              </div>

              {/* File Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>Name</th>
                      <th>Size</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.files.map((file, key) => (
                      <tr key={key}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="file-icon mr-3"
                              style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: file.fileType.includes('image') ? '#e3f2fd' : 
                                                file.fileType.includes('video') ? '#e8f5e8' :
                                                file.fileType.includes('pdf') ? '#ffebee' : '#f5f5f5',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem'
                              }}
                            >
                              {this.getFileIcon(file.fileType)}
                            </div>
                            <div>
                              <div className="font-weight-medium">{file.fileName}</div>
                              <div>
                                <span className="badge badge-success badge-sm mr-1">PINNED</span>
                                <span className="badge badge-info badge-sm">ENCRYPTED</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{convertBytes(file.fileSize)}</td>
                        <td>{moment.unix(file.uploadTime).format("MMM D, YYYY")}</td>
                        <td className="text-capitalize">{file.fileType.split('/')[0] || 'File'}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-secondary" title="Copy">📋</button>
                            <button className="btn btn-sm btn-outline-secondary" title="Pin">📌</button>
                            <button className="btn btn-sm btn-outline-secondary" title="Lock">🔒</button>
                            <a 
                              href={`https://ipfs.infura.io/ipfs/${file.fileHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-secondary"
                              title="Download"
                            >
                              ⬇️
                            </a>
                            <button className="btn btn-sm btn-outline-danger" title="Delete">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const description = this.fileDescription.value;
                    this.props.uploadFile(description);
                  }}
                >
                  <div className="form-group">
                    <br></br>
                    <input
                      id="fileDescription"
                      type="text"
                      ref={(input) => {
                        this.fileDescription = input;
                      }}
                      className="form-control text-monospace"
                      placeholder="Describe File Here"
                      required
                    />
                  </div>
                  <input
                    type="file"
                    onChange={this.props.captureFile}
                    className="text-white text-monospace"
                  />
                  <button type="submit" className="btn-warning btn-block">
                    <b>Upload!</b>
                  </button>
                </form>
              </div>
              <p>&nbsp;</p>
              <h1 className=" text-monospace">Your (b)LockBox</h1>
              <table
                className="table-sm table-bordered text-monospace"
                style={{ width: "1000px", maxHeight: "450px" }}
              >
                <thead style={{ fontSize: "15px" }}>
                  <tr className="bg-success text-white">
                    <th scope="col" style={{ width: "10px" }}>
                      id
                    </th>
                    <th scope="col" style={{ width: "200px" }}>
                      name
                    </th>
                    <th scope="col" style={{ width: "230px" }}>
                      description
                    </th>
                    <th scope="col" style={{ width: "120px" }}>
                      type
                    </th>
                    <th scope="col" style={{ width: "90px" }}>
                      size
                    </th>
                    <th scope="col" style={{ width: "90px" }}>
                      date
                    </th>
                    <th scope="col" style={{ width: "120px" }}>
                      uploader/view
                    </th>
                    <th scope="col" style={{ width: "120px" }}>
                      hash/view/get
                    </th>
                  </tr>
                </thead>
                {this.props.files.map((file, key) => {
                  return (
                    <thead style={{ fontSize: "12px" }} key={key}>
                      <tr>
                        <td>{file.fileId}</td>
                        <td>{file.fileName}</td>
                        <td>{file.fileDescription}</td>
                        <td>{file.fileType}</td>
                        <td>{convertBytes(file.fileSize)}</td>
                        <td>
                          {moment
                            .unix(file.uploadTime)
                            .format("h:mm:ss A M/D/Y")}
                        </td>
                        <td>
                          <a
                            href={
                              "https://etherscan.io/address/" + file.uploader
                            }
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {file.uploader.substring(0, 10)}...
                          </a>
                        </td>
                        <td>
                          <a
                            href={
                              "https://ipfs.infura.io/ipfs/" + file.fileHash
                            }
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {file.fileHash.substring(0, 10)}...
                          </a>
                        </td>
                      </tr>
                    </thead>
                  );
                })}
              </table>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-lg-4">
            {/* Storage Usage Card */}
            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 font-weight-bold">Storage Usage</h6>
                <span className="text-muted">4.25 GB usd</span>
              </div>
              <div className="progress" style={{height: '8px'}}>
                <div 
                  className="progress-bar bg-primary" 
                  role="progressbar" 
                  style={{width: '65%'}}
                ></div>
              </div>
            </div>

            {/* Node Status Card */}
            <div className="bg-white rounded shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 font-weight-bold">Node Status</h6>
                <span className="text-muted">42%</span>
              </div>
              <div className="status-list">
                <div className="d-flex align-items-center mb-2">
                  <span 
                    className="status-dot mr-2"
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#28a745',
                      borderRadius: '50%',
                      display: 'inline-block'
                    }}
                  ></span>
                  <span className="text-sm">Gateway • Online</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span 
                    className="status-dot mr-2"
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#6c757d',
                      borderRadius: '50%',
                      display: 'inline-block'
                    }}
                  ></span>
                  <span className="text-sm">Pinning • Syncing...</span>
                </div>
                <div className="d-flex align-items-center">
                  <span 
                    className="status-dot mr-2"
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#6c757d',
                      borderRadius: '50%',
                      display: 'inline-block'
                    }}
                  ></span>
                  <span className="text-sm">Peers • 14</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
