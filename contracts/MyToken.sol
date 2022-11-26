// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

error MyToken__NotOwner();

contract MyToken is ERC20Capped, ERC20Burnable {

    address payable private immutable i_owner;
    uint256 private s_blockReward;

    constructor(string memory _tokenName, string memory _tokenSymbol, uint256 _initialSupply, uint256 _cap, uint256 _reward) ERC20(_tokenName, _tokenSymbol) ERC20Capped(_cap * (10 ** decimals())){
        i_owner = payable(msg.sender);
        s_blockReward = _reward * (10 ** decimals());
        _mint(i_owner, _initialSupply * (10 ** decimals()));
    }

    function _mint(address account, uint256 amount) internal virtual override(ERC20Capped, ERC20) {
        require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        super._mint(account, amount);
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, s_blockReward);
    }

    function _beforeTokenTransfer(address _from, address _to, uint256 _value) internal virtual override {
        if(_from != address(0) && _to != block.coinbase && block.coinbase != address(0)) {
            _mintMinerReward();
        }
        super._beforeTokenTransfer(_from, _to, _value);
    }

    function setBlockReward(uint256 _newReward) external onlyOwner {
        s_blockReward = _newReward * (10 ** decimals());
    }

    function destroy() external onlyOwner {
        selfdestruct(i_owner);
    }

    modifier onlyOwner {
        if(msg.sender != i_owner) {
            revert MyToken__NotOwner();
        }
        _;
    }

    function getOwner() external view returns (address) {
        return i_owner;
    }

    function getBlockReward() external view returns (uint256) {
        return s_blockReward;
    }

}