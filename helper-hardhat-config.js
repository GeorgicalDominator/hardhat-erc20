const { ethers } = require("hardhat")

const networkConfig = {
    5:{
        name: "goerli",
    },
    31337:{
        name: "hardhat",
        tokenName: "CoolToken",
        tokenSymbol: "CT",
        initialSupply: 222222222,
        cap: 444444444,
        reward: 4,
    }
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig, developmentChains
}