<template>
  <div>
    <button @click="getMusicianList">Get the list of musicians</button>
    <p></p>
    <div v-for="musician in musicians" :key="musician">
        <div>Musician: {{ musician.name }}</div>
        <div>
          Tracks:
          <div v-for="track in musician.tracks" :key="track">
              title: {{ track.title }}, duration: {{ track.duration }}
          </div>
        </div>
    </div>

    <p>Form to record your musician and his tracks:</p>
    <p>
      <input type="text" name="musicianName" v-model="musicianName" placeholder="Enter the musician name">
      <button v-if="musicianName !== '' " @click="addMusician">Add a Musician</button>
    </p>
    <p>
      <input type="text" name="trackName" v-model="trackName" placeholder="Enter the track name">
      <input type="number" name="duration" v-model="duration" placeholder="Enter the duration of the track">
      <button v-if="trackName !== '' && duration > 0 " @click="addTrack">Add a Track to your musician</button>
    </p>

  </div>
</template>

<script>
  import { ethers } from 'ethers';
  import MusicianSol from '@/artifacts/contracts/Musician.sol/MusicianManagement.json';

  export default {
    name: 'Musician',
    data() {
      return {
        contractAddress: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
        walletAddress: null,
        musicians: [],
        musicianName: '',
        trackName: '',
        duration: 0
      }
    },
    mounted(){
        this.getMusicianList();
    },
    methods : {
      requestAccount : async function(){
        const data = await window.ethereum.request({method : 'eth_requestAccounts'});
        this.walletAddress = data[0];
      },
      getMusicianList: async function(){
        if(typeof window.ethereum !== 'undefined') { //Metamask needs to be connected
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          //const signer = provider.getSigner();
          const contract = new ethers.Contract(this.contractAddress, MusicianSol.abi, provider); //new instance of the contract to interact with the function of the contract
          try {
            const data = await contract.getAllMusicians({gasLimit: 300000}); //function of the contract
            const musicians = [];
            data.forEach(function(musc){
              var trackOfMusc = [];
              if(musc.tracks.length !== 0){
                musc.tracks.forEach(function(track){
                  trackOfMusc.push({
                    title: track.title,
                    duration: track.duration                  
                  })
                });
              }
              musicians.push({
                name: musc.name,
                tracks: trackOfMusc
              })
            });
            this.musicians = musicians;
          } catch(err) {
            console.log(err);
          }
        }
      },
      addMusician: async function(){
        if(typeof window.ethereum !== "undefined"){
          await this.requestAccount();
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner(); // need a signer to sign the transaction
          const contract = new ethers.Contract(this.contractAddress, MusicianSol.abi, signer);
          try {

            const transaction = await contract.addMusician(this.walletAddress, this.musicianName, {gasLimit: 300000}); //function of the contract

            await transaction.wait();

            this.getMusicianList();

          } catch(err) {
            console.log(err);
          }

        }
      },
      addTrack: async function(){
        if(typeof window.ethereum !== "undefined"){
          await this.requestAccount();
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner(); // need a signer to sign the transaction
          const contract = new ethers.Contract(this.contractAddress, MusicianSol.abi, signer);
          try {

            const transaction = await contract.addTrack(this.walletAddress, this.trackName, this.duration, {gasLimit: 300000}); //function of the contract

            const transact = await transaction.wait();

            console.log('transact:');
            console.log(transact);
            //this.getMusicianList();

          } catch(err) {
            console.log(err);
          }

        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
