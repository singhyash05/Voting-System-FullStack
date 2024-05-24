// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <=0.9.0;

contract Votting {
    address private electionOfficer; // address of Contract Deployer
    address[] public candidates;
    address[] private voters;
    mapping(address => bool) hasCandidature;

    mapping(address => uint256) votes;

    function registerCandidate() public {
        require(hasCandidature[msg.sender] == false);
        require(block.timestamp <= maxtimetoregister);
        candidates.push(msg.sender);
        hasCandidature[msg.sender] = true;
    }

    function getCandidateAddress(uint256 _a) public view returns (address) {
        return candidates[_a];
    }

    uint public maxtimetoregister;

    function maxRegisterTime(uint256 _maxtimetoregister) public onlyOwner {
        maxtimetoregister = _maxtimetoregister;
    }

    function getVotes(uint cand) public view returns (uint256) {
        require(
            cand >= 0 && cand < candidates.length,
            "Invalid candidate index"
        );
        address addressofCan = candidates[cand];
        return votes[addressofCan];
    }

    mapping(address => bool) private hasVoted;

    function vote(uint candidateNumber) public {
        require(block.timestamp <= maxTimetovote);
        require(hasVoted[msg.sender] == false); //require that he hasnt voted yet;
        uint x = candidateNumber - 1;
        require(candidates[x] != address(0));
        address addressofCan = candidates[x];
        votes[addressofCan]++;
        hasVoted[msg.sender] = true; // means now he is marked as voted
        voters.push(msg.sender);
    }

    bool private ec = false;
    function setElectionOfficer() public {
        require(
            ec == false,
            "Already registered Election Commisioner : reset the system"
        );
        electionOfficer = msg.sender;
        ec = true;
    }

    uint256 public maxTimetovote;
    function setMaxTimetovote(uint256 _maxTimetovote) public onlyOwner {
        maxTimetovote = _maxTimetovote;
    }

    function resetVotes() public {
        for (uint i = 0; i < candidates.length; i++) {
            votes[candidates[i]] = 0;
        }
    }

    function resetHasVoted() public {
        for (uint i = 0; i < voters.length; i++) {
            hasVoted[voters[i]] = false;
        }
    }
    function resetHasCandidature() public {
        for (uint i = 0; i < candidates.length; i++) {
            hasCandidature[candidates[i]] = false;
        }
    }
    uint256 private automaticResetTime = 14400 + maxTimetovote;

    function reset() public {
        require(
            (block.timestamp > automaticResetTime) ||
                msg.sender == electionOfficer
        );

        resetVotes();
        resetHasVoted();
        resetHasCandidature();
        maxtimetoregister = 0;
        maxTimetovote = 0;
        ec = false;
        delete candidates;
        delete voters;
        electionOfficer = address(0);
    }

    modifier onlyOwner() {
        _;
        require(msg.sender == electionOfficer, "You are not the manager");
    }
}
