pragma solidity ^0.5.0;

contract BLockBox {
  string public name = "bLockBox";
  // Number of files
  mapping (uint => File) public files;

  

  constructor() public {
  }

  

}