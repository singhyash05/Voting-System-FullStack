# Voting System Project

## Description
This is a voting system project based on a smart contract deployed on a testnet. It allows users to register as election commissioners, set up registration and voting periods, register as candidates, and vote. The results can be retrieved and viewed. After running `index.html`, you will get detailed instructions on how to proceed. Please go through them carefully.

## Features
1. **MetaMask Integration**: Connect to the system using MetaMask for secure transactions.
2. **Election Commission Registration**: Register yourself as an Election Commissioner (EC).
3. **Candidate Registration**: Register as a candidate within the specified registration period.
4. **Voting Period**: Set a specific time frame during which voting is allowed.
5. **Voting**: Vote for registered candidates during the voting period.
6. **Results**: Retrieve and view the results of the election.
7. **Reset Function**: Reset the system after the election period ends. Anyone can reset the system after 3 hours, even if they are not the manager or EC.

## Prerequisites
- **MetaMask**: For handling Ethereum transactions.
- **HTML, CSS, JavaScript**: For the front-end interface.
- **Node.js**: For running the development server.
- **ethers.js**: For interacting with the Ethereum blockchain.

## Installation
1. Clone the repository.
    ```bash
    git clone https://github.com/singhyash05/Voting-System-FullStack.git
    cd Voting-System-FullStack
    ```
2. Install the dependencies using Yarn.
    ```bash
    yarn install
    ```
3. Deploy the smart contract on a testnet (if not using the provided contract address). Copy the contract address and replace it in the `constants.js` file.
4. Open the `index.html` file in your browser to interact with the application.

## Usage
1. **Connect to MetaMask**: Click on the "Connect!" button to connect your MetaMask wallet.
2. **Register as Election Commission**: Click on the "Register!" button under "Register Yourself As Election Commission".
3. **Set Registration Time**: Enter the maximum date and time for candidate registration and click "Enter".
4. **Register as Candidate**: Enter relevant information about yourself and click "Submit".
5. **Set Voting Time**: Enter the maximum date and time for voting and click "Enter".
6. **Vote**: Enter the serial number of the candidate you wish to vote for and submit your vote.
7. **View Results**: Click on the "Results!" button to view the election results.
8. **Reset**: Click on the "Reset" button to reset the system after the election period ends.

## Detailed Instructions
1. **Connect to MetaMask**:
   - Click on the "Connect!" button.
   - Follow the MetaMask prompts to connect your wallet.
   - Once connected, the button will display your connected address.

2. **Register as Election Commission**:
   - Click the "Register!" button under the "Register Yourself As Election Commission" section.
   - Your address will be registered as the Election Commissioner.
   - The registered address will be displayed on the page.

3. **Set Registration Time**:
   - Enter the desired maximum date and time for candidate registration in the provided fields.
   - Click the "Enter" button to set the registration time.
   - Ensure the registration time is within one day from the current time.

4. **Register as Candidate**:
   - Enter relevant information about yourself in the text field.
   - Click the "Submit" button to register as a candidate.
   - Registered candidates will be displayed in a table.

5. **Set Voting Time**:
   - Enter the desired maximum date and time for voting in the provided fields.
   - Click the "Enter" button to set the voting time.
   - Ensure the voting time is set after the registration period ends and is within one day from the current time.

6. **Vote**:
   - Enter the serial number of the candidate you wish to vote for in the provided field.
   - Submit your vote by pressing the Enter key.
   - A confirmation message will be displayed.

7. **View Results**:
   - Click the "Results!" button.
   - A new page (`result.html`) will open, displaying the election results in the console.

8. **Reset**:
   - Click the "Reset" button to reset the system.
   - The system can be reset by anyone after 3 hours, regardless of their role.

## Viewing Results
1. Open the `result.html` file in your browser.
2. The election results will be printed to the console in the browser. Each candidate's address and the number of votes they received will be displayed.

## Smart Contract Details
The smart contract is written in Solidity and deployed on a testnet. The main functions include:
- `setElectionOfficer()`: Register the caller as an election officer.
- `maxRegisterTime(uint256)`: Set the maximum registration time for candidates.
- `registerCandidate()`: Register the caller as a candidate.
- `setMaxTimetovote(uint256)`: Set the maximum voting time.
- `vote(uint256)`: Vote for a candidate using their serial number.
- `reset()`: Reset the system.

## Testing
- Interact with the system using the provided `index.html` file.
- Test the registration and voting process by setting appropriate times and performing transactions.

## Deployment
- Deploy the smart contract on any Ethereum-compatible testnet.
- Update the contract address in the `constants.js` file.
- Ensure MetaMask is connected to the same network as the deployed contract.

## License
The smart contract in this project is licensed under the MIT License.

