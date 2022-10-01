// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract MusicianManagement {

    event musicianCreated(string _name);
    event trackAdded(string _name, string _title, uint _duration);
    event getTrackList(Track[] trackList);
    //event getMusicianList(Musician[] _musicianList);

    uint addressMusicianNumber;
    address[] addressMusician;

    struct Track {
        string title;
        uint duration;
    }

    struct Musician {
        string name;
        Track[] tracks;
    }

    mapping(address => Musician) Musicians;

    address owner;

    constructor(){
        owner = msg.sender;
    }

    /*modifier onlyOwner() {
        require(msg.sender == owner,'Not the owner');
        _;
    }*/

    function addMusician(address _musicianAddress, string memory _name) external /*onlyOwner*/ {
        require(bytes(Musicians[_musicianAddress].name).length == 0,"The musician already exist");
        Musicians[_musicianAddress].name = _name;
        addressMusicianNumber += 1;
        addressMusician.push(_musicianAddress);
        emit musicianCreated(_name);
    }

    function addTrack(address _musicianAddress, string memory _title, uint _duration) external /*onlyOwner*/ {
        require(bytes(Musicians[_musicianAddress].name).length > 0, "The musician doesn't exist");
        Track memory thisTrack = Track(_title, _duration);
        Musicians[_musicianAddress].tracks.push(thisTrack);
        emit trackAdded(Musicians[_musicianAddress].name, _title, _duration);
    }

    function getAllMusicians() public view returns(Musician[] memory){
        Musician[] memory musicianList = new Musician[](addressMusicianNumber);
        for (uint i = 0; i < addressMusicianNumber; i++) {
            musicianList[i] = Musicians[addressMusician[i]];
        }
        return musicianList;
        //emit getMusicianList(musicianList);
    }

    function getTracks(address _musicianAddress) external /*public view returns (Track [] memory)*/{
        //return Musicians[_musicianAddress].tracks;
        emit getTrackList(Musicians[_musicianAddress].tracks);
    }
}
