// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7.0;

// This contract is a utility contract that allows you to check the balance of a token.

interface IERC20 {
    function balanceOf(address _owner) external view returns (uint256);
}

contract TokenBalanceContract {
  // a function that is called getBalances, that takes in a wallet address and an array of token addresses.
  // it returns an array of balances for each token.
  struct Balance {
    address token;
    uint256 balance;
  }

  function getBalances(address _wallet, address[] memory _tokenAddresses) public view returns (Balance[] memory) {
    Balance[] memory balances = new Balance[](_tokenAddresses.length);
    for (uint256 i = 0; i < _tokenAddresses.length; i++) {
      balances[i] = Balance(_tokenAddresses[i],IERC20(_tokenAddresses[i]).balanceOf(_wallet));
    }
    return balances;
  }
}