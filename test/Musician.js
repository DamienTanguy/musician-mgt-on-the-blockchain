const { expect, assert } = require("chai");

describe("Musician", function () {

  let contract;
  //let owner;

  before(async function(){
    //[owner] = await ethers.getSigners();
    const musicianContract = await ethers.getContractFactory("MusicianManagement");
    contract = await musicianContract.deploy();
  });

  it('should deploy the contract', async function(){
    const musicianContract = await ethers.getContractFactory("MusicianManagement");
    const err = null;
    try {
      const musicianContractDeployement = await musicianContract.deploy();
    }
    catch(error){
      err = error;
    }
    assert.equal(err, null, 'The contract is not deployed');
  });

  it('should add a musician', async function(){
    let err = null;
    try {
      let result = await contract.addMusician('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266','name1');
    }
    catch(error){
      err = error;
    }
    assert.equal(err, null, 'The Musician has been created');
  });

  it('should not add a musician if he already exist', async function(){
    let err = null;
    try {
      let result = await contract.addMusician('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266','name2');
    }
    catch(error){
      err = error;
    }
    assert.ok(err instanceof Error);
  });

  it('should add a track', async function(){
    let err = null;
    try {
      let result2 = await contract.addTrack('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266','title1',340);
    }
    catch(error){
      err = error;
    }
    assert.equal(err, null, 'The Track has been created');
  });

  it('should not add a track to an unknown musician', async function(){
    let err = null;
    try {
      let result3 = await contract.addTrack('0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199','title2',345);
    }
    catch(error){
      err = error;
    }
    assert.ok(err instanceof Error);
  });

  it('should emit the list of musician', async function(){
    //let allMusicians = await contract.getAllMusicians();
    //assert.ok(Array.isArray(allMusicians));
    expect(contract.getAllMusicians())
      .to.emit(contract, "getMusicianList")
      .withArgs();
  });

  it('should emit the tracks of an musician', async function(){
    //let allTracks = await contract.getTracks('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    //assert.ok(Array.isArray(allTracks));
    expect(contract.getTracks('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'))
      .to.emit(contract, "getTrackList")
      .withArgs('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  });

});
