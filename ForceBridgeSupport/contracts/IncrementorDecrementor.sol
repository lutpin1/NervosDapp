pragma solidity >=0.8.0;

contract IncrementorDecrementor {
  int basenum;

  constructor() payable {
    basenum = 1;
  }

  function increment1() public payable {
    basenum = basenum + 1;
  }

  function increment10() public payable {
    basenum = basenum + 10;
  }

  function increment100() public payable {
    basenum = basenum + 100;
  }

  function increment1000() public payable {
    basenum = basenum + 1000;
  }

  function decrement1() public payable {
    basenum = basenum - 1;
  }

  function decrement10() public payable {
    basenum = basenum - 10;
  }

  function decrement100() public payable {
    basenum = basenum - 100;
  }

  function decrement1000() public payable {
    basenum = basenum - 1000;
  } 

  function result() public view returns (int) {
    return basenum;
  }
}