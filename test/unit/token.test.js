const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers, getChainId } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name) ? describe.skip : describe("Lottery", () => {
    let tokenContract, deployer, chainId, accounts

    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        accounts = await ethers.getSigners()
        
        await deployments.fixture(["all"])
        tokenContract = await ethers.getContract("MyToken", deployer)
        chainId = network.config.chainId
    })

    describe("Constructor", () => {
        it("should correctly set owner", async () => {
            assert.equal(deployer, await tokenContract.getOwner())
        })

        it("should correctly set block reward", async () => {
            const expectedReward = networkConfig[chainId]['reward']
            assert.equal(expectedReward * (10**18), await tokenContract.getBlockReward())
        })

        it("should gave expected value of tokens to owner", async () => {
            const expectedSupply = networkConfig[chainId]['initialSupply']
            assert.equal(expectedSupply * (10**18), await tokenContract.balanceOf(deployer))
        })
    })

    describe("Transactions", () => {
        it("Should transfer tokens between accounts", async () => {
          // Transfer 50 tokens from owner to addr1
          await tokenContract.transfer(accounts[1].address, 50);
          const addr1Balance = await tokenContract.balanceOf(accounts[1].address);
          expect(addr1Balance).to.equal(50);
    
          // Transfer 50 tokens from addr1 to addr2
          // We use .connect(signer) to send a transaction from another account
          await tokenContract.connect(accounts[1]).transfer(accounts[2].address, 50);
          const addr2Balance = await tokenContract.balanceOf(accounts[2].address);
          expect(addr2Balance).to.equal(50);
        });

        it("Should fail if sender doesn't have enough tokens", async () => {
            const initialOwnerBalance = await tokenContract.balanceOf(deployer);
            await expect(
                tokenContract.connect(accounts[1]).transfer(deployer, 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

            expect(await tokenContract.balanceOf(deployer)).to.equal(initialOwnerBalance);
          });
        
          it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await tokenContract.balanceOf(deployer);
      
            await tokenContract.transfer(accounts[1].address, 100);
      
            await tokenContract.transfer(accounts[2].address, 50);
      
            const finalOwnerBalance = await tokenContract.balanceOf(deployer);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));
      
            const addr1Balance = await tokenContract.balanceOf(accounts[1].address);
            expect(addr1Balance).to.equal(100);
      
            const addr2Balance = await tokenContract.balanceOf(accounts[2].address);
            expect(addr2Balance).to.equal(50);
          });

    })

})
