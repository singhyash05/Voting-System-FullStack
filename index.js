import { ethers } from "./ethers.js"
import { contractAddress, abi } from "./constants.js";


function getCurrentUnixTime() {
    return Math.floor(Date.now() / 1000);
}

//transaction mine confirmation function
function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations. `
                )
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
}

//connect metamask
const connectButton = document.getElementById("connectMetamask")
connectButton.onclick = connect

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress();
        connectButton.innerHTML = `Connected to : ${address}`
        console.log("connected")
        const accounts = await ethereum.request({ method: "eth_accounts" })
    } else {
        // connectButton.innerHTML = "Please install MetaMask"
        alert("Install Metamask")
    }
}

//register your self as Election Commision
let ECaddress
const ec = document.getElementById("registerEC")
ec.onclick = setElectionOfficer
async function setElectionOfficer() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        ECaddress = await signer.getAddress();

        try {
            const transactionResponse = await contract.setElectionOfficer()
            await listenForTransactionMine(transactionResponse, provider)
            ec.innerHTML = `Registered as EC : ${ECaddress}`
            console.log("ec set")
            localStorage.setItem('ECaddress', ECaddress);
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log("Error in registration of EC")
    }
}
const registeredEC = document.getElementById("registeredEC")
ECaddress = localStorage.getItem('ECaddress');
registeredEC.innerHTML = `Registered EC address : ${ECaddress}`

// Timestamp candidates for registration of candidates
let timestampCandidates = 0;

// Retrieve registration time from local storage and display it
const registrationTime = localStorage.getItem('registrationTime');
const registrationTimeDisplay = document.getElementById('registrationTimeDisplay');
if (registrationTime) {
    registrationTimeDisplay.textContent = new Date(registrationTime * 1000).toLocaleString();
} else {
    registrationTimeDisplay.textContent = "Not set";
}

const timestampCanButton = document.getElementById("timestampCanButton");

timestampCanButton.addEventListener('click', function (event) {
    event.preventDefault();

    // Get date and time values from the form
    const dateValue = document.getElementById("dateCan").value;
    const timeValue = document.getElementById("timeCan").value;

    // Concatenate date and time strings into a single string in ISO 8601 format
    const datetimeString = `${dateValue}T${timeValue}`;

    // Convert the concatenated string to a Date object
    const datetime = new Date(datetimeString);

    // Get the Unix timestamp (in milliseconds) from the Date object and convert it to seconds
    timestampCandidates = Math.floor(datetime.getTime() / 1000);
    timestampCanButton.innerHTML = "Done";
    console.log(`Time you stored in UNIX Format: ${timestampCandidates}`);

    // Get current Unix time
    const currentTimeUnix = getCurrentUnixTime();

    if (timestampCandidates < currentTimeUnix) {
        alert("Please provide the accurate time, ensuring it is set in the future.");
        timestampCandidates = 0;
    } else if (timestampCandidates - currentTimeUnix > 86400) {
        alert("Maximum registration time can be one day not more than that. Please enter a valid date and time.");
        timestampCandidates = 0;
    } else {
        maxRegisterTime(timestampCandidates);
        console.log("set max time for registration in contract")
    }
});

async function maxRegisterTime(timestampCandidates) {
    if ((typeof window.ethereum !== "undefined") && (timestampCandidates != 0)) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.maxRegisterTime(timestampCandidates) //args
            await listenForTransactionMine(transactionResponse, provider)
            await console.log("time for registration set")
        } catch (error) {
            console.log(error)
        }
    } else {
        timestampCanButton.innerHTML = "Error in setting Registration Time"
    }
}

//registration and display of candidates
let numberOfCandidatesRegistered = localStorage.getItem('numberOfCandidatesRegistered');

if (numberOfCandidatesRegistered === null) {
    numberOfCandidatesRegistered = 0;
    localStorage.setItem('numberOfCandidatesRegistered', numberOfCandidatesRegistered.toString());
} else {
    numberOfCandidatesRegistered = parseInt(numberOfCandidatesRegistered, 10);
}

localStorage.setItem('numberOfCandidatesRegistered', numberOfCandidatesRegistered.toString());
document.addEventListener('DOMContentLoaded', async () => {
    const candidatesTable = document.getElementById('candidatesTable').getElementsByTagName('tbody')[0];
    const registrationForm = document.getElementById('registrationOfCandidatesForm');

    // Function to load candidates from local storage and display them
    function loadCandidates() {
        const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
        candidatesTable.innerHTML = '';
        candidates.forEach((candidate, index) => {
            const row = candidatesTable.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            cell1.textContent = index + 1;
            cell2.textContent = candidate.info;
            cell3.textContent = candidate.address;
        });
    }

    // Function to add a new candidate to local storage
    async function addCandidate(candidateInfo) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const candidateAddress = await signer.getAddress();
        const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
        const existingCandidate = candidates.find(candidate => candidate.address === candidateAddress);
        if (existingCandidate) {
            alert('You are already registered as a candidate.');
            return; // Exit function if candidate already exists
        }
        candidates.push({ info: candidateInfo, address: candidateAddress });
        localStorage.setItem('candidates', JSON.stringify(candidates));
        loadCandidates();

        await registerCandidateOnContract()
        // Retrieve the current value from local storage
        let numberOfCandidatesRegistered = parseInt(localStorage.getItem('numberOfCandidatesRegistered')) || 0;

        // Increment the value
        numberOfCandidatesRegistered++;

        // Store the updated value back in local storage
        localStorage.setItem('numberOfCandidatesRegistered', numberOfCandidatesRegistered.toString());


    }


    // Event listener for form submission
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const candidateInfo = document.getElementById('candidateInfo').value.trim();
        if (candidateInfo) {
            addCandidate(candidateInfo);
            registrationForm.reset(); // Reset form after submission
        } else {
            alert('Please enter relevant information about yourself.');
        }
    });

    // Load candidates on page load
    loadCandidates();
});

async function registerCandidateOnContract() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.registerCandidate() //args
            await listenForTransactionMine(transactionResponse, provider)
            await console.log("")
        } catch (error) {
            console.log(error)
        }
    } else {
        fundButton.innerHTML = "Error in Registration on Contract"
    }
}


//reset Button
const resetButton = document.getElementById("resetButton")
resetButton.onclick = reset
async function reset() {
    localStorage.clear();
    numberOfCandidatesRegistered = 0
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.reset()
            await listenForTransactionMine(transactionResponse, provider) //baaad mein add kiya h after testing
            console.log(transactionResponse)

        }
        catch (error) {
            console.log(error)
        }


    } else {
        resetButton.innerHTML = "error in reset"
    }
}

//timestamp for voting period
let timeStampforVoting = 0;

const maxVotingTime = localStorage.getItem('maxVotingTime');
const maxVotingTimeDisplay = document.getElementById('maxVotingTimeDisplay');
if (maxVotingTime) {
    maxVotingTimeDisplay.textContent = new Date(maxVotingTime * 1000).toLocaleString();
} else {
    maxVotingTimeDisplay.textContent = "Not set";
}

const timestampVOTButton = document.getElementById("timestampVOTButton");

timestampVOTButton.addEventListener('click', async function (event) {
    event.preventDefault();

    // Get date and time values from the form
    const dateValue = document.getElementById("dateVOT").value;
    const timeValue = document.getElementById("timeVOT").value;

    // Concatenate date and time strings into a single string in ISO 8601 format
    const datetimeString = `${dateValue}T${timeValue}`;

    // Convert the concatenated string to a Date object
    const datetime = new Date(datetimeString);

    // Get the Unix timeStampforVoting (in milliseconds) from the Date object and convert it to seconds
    timeStampforVoting = Math.floor(datetime.getTime() / 1000);

    // Get current Unix time
    const currentTimeUnix = getCurrentUnixTime();

    // Validate the timestamp
    if (timeStampforVoting < timestampCandidates) {
        alert("Input time must be after the Registration of Candidates.");
    } else if (timeStampforVoting - currentTimeUnix > 86400) {
        alert("Maximum voting time can be one day not more than that. Please enter a valid date and time.");
        timeStampforVoting = 0;
    } else {
        timestampVOTButton.innerHTML = "Done";
        console.log(`Time you stored in UNIX Format: ${timeStampforVoting}`);

        // Call the function to set the maximum voting time in the contract
        await maxVOTTIME(timeStampforVoting);
        console.log("Set max time for vote in contract");
    }
});


// Set maximum voting time in the contract
async function maxVOTTIME(timeStampforVoting) {
    if (typeof window.ethereum !== "undefined" && timeStampforVoting !== 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            const transactionResponse = await contract.setMaxTimetovote(timeStampforVoting);
            await listenForTransactionMine(transactionResponse, provider);
            console.log("Time for voting set successfully");
        } catch (error) {
            console.log(error);
            timestampVOTButton.innerHTML = "Error in setting voting time";
        }
    } else {
        timestampVOTButton.innerHTML = "Error in setting voting time";
    }
}



//vote 
const voteButton = document.getElementById("voteButton");
const voteForm = document.getElementById("vote");

voteForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Get the value entered by the user for the candidate's serial number
    const candidateSerialNumber = parseInt(document.getElementById('votefor').value.trim());

    // Check if the value is valid (not NaN) and within the range of registered candidates
    if (!isNaN(candidateSerialNumber) && candidateSerialNumber > 0 && candidateSerialNumber <= numberOfCandidatesRegistered) {
        // Call the vote function with the candidate's serial number as an argument
        await vote(candidateSerialNumber);
        voteMessage.style.display = 'block';
        voteForm.reset(); // Reset the form after submission
    } else {
        alert('Please enter a valid serial number.');
    }
});

async function vote(candidateSerialNumber) {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.vote(candidateSerialNumber); // args
            await listenForTransactionMine(transactionResponse, provider);
            console.log("VOTED");
        } catch (error) {
            console.log(error);
        }
    } else {
        vote.innerHTML = "Some error";
    }
}

document.getElementById('resultButton').addEventListener('click', function () {
    // Navigate to another HTML page
    window.open('Result.html', '_blank');
});