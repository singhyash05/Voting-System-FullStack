import { ethers } from "./ethers.js";
import { contractAddress, abi } from "./constants.js";

async function extractAndStoreCandidates() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            const numberOfCandidatesRegistered = parseInt(localStorage.getItem('numberOfCandidatesRegistered')) || 0;
            localStorage.setItem('numberOfCandidatesRegistered', numberOfCandidatesRegistered.toString());

            // Loop through each candidate and store their information
            for (let i = 0; i < numberOfCandidatesRegistered; i++) {
                const address = await contract.getCandidateAddress(i);
                const votes = await contract.getVotes(i);
                console.log(`Candidate ${i + 1}: Address - ${address}, Votes - ${votes}`); // Log candidate data
                // Store candidate information in local storage
                localStorage.setItem(`candidate_${i}`, JSON.stringify({ address, votes }));
            }
        } catch (error) {
            console.log("Error fetching candidate data:", error);
        }
    } else {
        console.log("MetaMask not detected.");
    }
}



(function () {
    var oldLog = console.log;
    console.log = function (message) {
        // Create a new <p> element
        var p = document.createElement('p');
        // Set the text content to the log message
        p.textContent = message;
        // Append the <p> element to the <div> with id "consoleLogs"
        document.getElementById('consoleLogs').appendChild(p);
        // Call the old console.log function to output the message to the browser console
        oldLog.apply(console, arguments);
    };
})();




// Function to fetch data and populate the table
async function result() {
    try {
        await extractAndStoreCandidates();
    } catch (error) {
        console.error("Error fetching candidate data:", error);
    }
}

// Call the result function when the document is loaded
document.addEventListener('DOMContentLoaded', result);
