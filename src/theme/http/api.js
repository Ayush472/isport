import axios from "axios";
import APIUrls from "./urls";

const baseUrl = "http://cms.bettorlogic.com/api/BetBuilder";

class FetchData {
  async Fixtures() {
    return axios.get(`${baseUrl + APIUrls.getFixtures}`);
  }
  async BetBuilderBets({queryKey}) {
    const [_, matchID,MarketId,Legs] = queryKey
    console.log(matchID,MarketId,Legs,"matchID,MarketId,Legs");
    if (matchID&&MarketId&&Legs) {
      
      return axios.get(`${baseUrl+ APIUrls.getBetBuilderBets}&matchId=${matchID}&marketId=${MarketId}&legs=${Legs}&language=en`);
    }
  } 
  async Selection() {
 
    return axios.get(`${baseUrl + APIUrls.getSelections}`);
  }
   async Markets() {
    return axios.get(`${baseUrl + APIUrls.getMarkets}`);
  }

}

export default new FetchData();
