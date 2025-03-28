// triggerIntent.js
require('dotenv').config();
const { ethers } = require("ethers");

// Set up provider (using an RPC URL from an Ethereum node provider, e.g., Infura or Alchemy)
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

// Create a wallet instance using your private key
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Define your deployed smart contract address and minimal ABI for executeIntent()
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = [
    "function executeIntent() public"
];

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

/**
 * Dummy condition checker.
 * Replace this with your actual logic (e.g., fetch market prices from an oracle or API)
 * For demonstration, it returns true 50% of the time.
 */
async function checkConditions() {
    // Simulated condition: 50% chance of being true.
    return Math.random() > 0.5;
}

/**
 * Checks if conditions are met and triggers the executeIntent function.
 */
async function triggerIntentExecution() {
    console.log("Checking conditions...");
    const conditionsMet = await checkConditions();
    if (conditionsMet) {
        console.log("Conditions met! Triggering intent execution...");
        try {
            // Call the executeIntent function on the contract
            const tx = await contract.executeIntent();
            console.log("Transaction sent. Tx Hash:", tx.hash);
            // Wait for the transaction to be mined
            await tx.wait();
            console.log("Intent executed successfully.");
        } catch (error) {
            console.error("Error executing intent:", error);
        }
    } else {
        console.log("Conditions not met. Will check again.");
    }
}

// Check conditions every minute (60000 milliseconds)
setInterval(triggerIntentExecution, 60000);

// Run immediately on start
triggerIntentExecution();
