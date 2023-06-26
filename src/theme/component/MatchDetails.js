import React, { useState, useEffect } from "react";
import Heading from "../container/header";
import Api from "../http/api";
import { useQuery } from "react-query";
import "../assets/css/matchDetails.css";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
export default function MatchDetails() {
  const nevigate = useNavigate();
  const matchID = localStorage.getItem("MatchID");
  const { data } = useQuery("getFixtures", Api.Fixtures);
  const { data: MarketList } = useQuery("getMarkets", Api.Markets);
  const { data: legList } = useQuery("getSelections", Api.Selection);

  console.log(MarketList, legList, "MarketList");
  const [selectedMarketValue, setSelectedMarketValue] = useState("");
  const [selectedLegValue, setSelectedLegValue] = useState("");
  const [matchDetils, setMatchDetials] = useState([]);
  const [market, setmarket] = useState([]);
  const [leged, setLeg] = useState([]);
  const [betsData, setBetsData] = useState([]);

  const { data: builderdata } = useQuery(
    ["getBetBuilderBets", matchID, selectedMarketValue, selectedLegValue],
    Api.BetBuilderBets
  );
  console.log(builderdata, "builderdata");
  useEffect(() => {
    if (data) {
      const filteredData = data?.data.find(
        (fixture) => fixture.MatchId === matchID
      );
      console.log(filteredData);
      setMatchDetials(filteredData);
    }
    if (MarketList) {
      const marketListData = MarketList?.data;
      console.log(marketListData, "marketListData");
      setmarket(marketListData);
    }
    if (legList) {
      const legListData = legList?.data;
      setLeg(legListData);
    }
  }, [data, MarketList, legList]);
  useEffect(() => {
    if (builderdata && selectedMarketValue && selectedLegValue) {
      const buildertable = builderdata?.data;
      setBetsData(buildertable);
    }
    console.log(betsData, "betsData");
  }, [builderdata]);
  const handleMarketChange = (event) => {
    setSelectedMarketValue(event.target.value);
  };
  const handlelegChange = (event) => {
    setSelectedLegValue(event.target.value);
  };
  const handelBack = () => {
    localStorage.clear();
    nevigate("/");
  };
  console.log(matchID, data, market, leged, "event");
  return (
    <div>
      <Heading />
      <div className="backarrow" onClick={handelBack}>
        <BsFillArrowLeftCircleFill color="red" size={30} />
      </div>
      <div className="heading2">Make It A Bet Builder ?</div>
      <div style={{ display: "flex", marginBottom: "15px", marginTop: "10px" }}>
        <div
          style={{
            backgroundColor: "black",
            width: "40%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: "bolder",
              paddingLeft: "200px",
            }}
          >
            {matchDetils.MatchDate}
          </span>
        </div>
        <div
          style={{
            backgroundColor: "red",
            width: "60%",
            padding: "3px",
            float: "left",
            transformOrigin: "0 0",
          }}
        >
          <span
            style={{
              color: "white",
              paddingLeft: "0px",
              fontSize: 24,
              fontWeight: "bolder",
            }}
          >
            {matchDetils.MatchName}
            <br /> {matchDetils.Country}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="selections">
          <div className="selectionItem">
            <span className="selectionLabel">Selections:</span>
            <select
              className="selectionDropdown"
              value={selectedMarketValue}
              onChange={handleMarketChange}
            >
              <option value="">Select Market</option>
              {market.map((market, i) => (
                <option key={i + 1} value={market.MarketId}>
                  {market.MarketName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="legs">
          <div className="legsItem">
            <span className="legsLabel">Legs:</span>
            <select
              className="legsDropdown"
              value={selectedLegValue}
              onChange={handlelegChange}
            >
              <option value="">Select Leg</option>
              {leged.map((leg, i) => (
                <option key={i + 1} value={leg.selectionValue}>
                  {leg.selectionValue}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="tableData">
        {betsData &&
          betsData.BetBuilderSelections &&
          betsData.BetBuilderSelections.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Pick</th>
                  <th>Market</th>
                  <th>Sub Market</th>
                  <th>Outcome</th>
                  <th>Key State</th>
                </tr>
              </thead>
              <tbody>
                {/* Render the table rows based on betsData */}
                {betsData.BetBuilderSelections.map((bet, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{bet.Market}</td>
                    <td>{bet.Odds.Decimal}</td>
                    <td>{bet.Selection}</td>
                    <td>{bet.RTB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );
}
