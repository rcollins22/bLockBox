pragma solidity ^0.5.0;

contract BLockBox {
  //naming blockchain
  string public name = "bLockBox";
  uint public idCount = 0;
  // creating interable mapping of files, FE*
  mapping (uint => File) public files;

  struct File {
    uint fileID;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    address payable uploader;
  }

  event UploadComplete (
    uint fileID;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    address payable uploader;
  );
  constructor() public {

  }

  function upload(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _description) public {
    require(bytes(_fileHash).length > 0);
    require(bytes(_fileType).length > 0);
    require(_fileSize > 0);
    require(bytes(_description).length > 0);
    require(bytes(_fileName).length > 0);
    require(msg.sender!=address(0));
    



    idCount++;
    files[idCount] = File(idCount,_fileHash,_fileSize,_fileType, _fileName, _description, now, msg.sender)
    emit UploadCompete()
  };

}