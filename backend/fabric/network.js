/**
 * Independent Fabric Network Layer (Mock Mode)
 * This version stores data in 'mock_ledger.json' so you can use it for your assignment
 * without needing Docker or your Lead's laptop.
 */

const fs = require('fs');
const path = require('path');

// Ensure this path points correctly to your chaincode file
const HerbChainContract = require('../../chaincode/lib/herbchain');

const MOCK_STORAGE_PATH = path.resolve(__dirname, 'mock_ledger.json');

// --- 1. Persistence Logic ---
// This loads your "Blockchain" data from a file if it exists
let mockData = {};
if (fs.existsSync(MOCK_STORAGE_PATH)) {
    try {
        mockData = JSON.parse(fs.readFileSync(MOCK_STORAGE_PATH, 'utf8'));
    } catch (e) {
        console.error("Error loading mock ledger, starting fresh.");
        mockData = {};
    }
}

// --- 2. Mock Hyperledger Classes ---
class MockStub {
    async putState(key, value) {
        // Save data to our local object
        mockData[key] = value.toString();
        // Write to file so it's "Immutable" and saved for your demo
        fs.writeFileSync(MOCK_STORAGE_PATH, JSON.stringify(mockData, null, 2));
    }
    async getState(key) {
        return mockData[key] || null;
    }
}

class MockContext {
    constructor() {
        this.stub = new MockStub();
    }
}

const mockContract = new HerbChainContract();

// --- 3. Exported Functions (Matched to your api.js) ---

async function submitTransaction(fnName, ...args) {
    console.log(`[LEDGER] Executing: ${fnName}`);
    const ctx = new MockContext();
    if (typeof mockContract[fnName] === 'function') {
        // This runs the ACTUAL logic from your chaincode/lib/herbchain.js
        const result = await mockContract[fnName](ctx, ...args);
        return result; 
    } else {
        throw new Error(`Chaincode function ${fnName} not found`);
    }
}

async function evaluateTransaction(fnName, ...args) {
    const ctx = new MockContext();
    if (typeof mockContract[fnName] === 'function') {
        const result = await mockContract[fnName](ctx, ...args);
        return result;
    } else {
        throw new Error(`Chaincode function ${fnName} not found`);
    }
}

// Helper functions for your Dashboards
async function getAllCollections() {
    return Object.values(mockData)
        .map(v => JSON.parse(v))
        .filter(obj => obj.docType === 'collection');
}

async function getAllTests() {
    return Object.values(mockData)
        .map(v => JSON.parse(v))
        .filter(obj => obj.docType === 'qualityTest');
}

async function getAllBatches() {
    return Object.values(mockData)
        .map(v => JSON.parse(v))
        .filter(obj => obj.docType === 'batch');
}

module.exports = {
    submitTransaction,
    evaluateTransaction,
    getAllCollections,
    getAllTests,
    getAllBatches
};