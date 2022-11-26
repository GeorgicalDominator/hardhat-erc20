const { ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")



module.exports = async ({ getNamedAccounts, deployments }) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId

    if (chainId == 31337) {
        
    }

    const tokenName = networkConfig[chainId]['tokenName']
    const tokenSymbol = networkConfig[chainId]['tokenSymbol']
    const initialSupply = networkConfig[chainId]['initialSupply']
    const cap = networkConfig[chainId]['cap']
    const reward = networkConfig[chainId]['reward']
    const args = [tokenName, tokenSymbol, initialSupply, cap, reward]

    const tokenContract = await deploy("MyToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log("--------------------------------------------------------------")

}

module.exports.tags = ["all", "token"]