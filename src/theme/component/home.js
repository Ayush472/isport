import React, { useState, useEffect } from "react";
import Heading from "../container/header";
import "../assets/css/home.css";
import Api from "../http/api";
import { useQuery } from "react-query";
import moment from "moment";
import footBall from "../assets/images/football-svgrepo-com.svg";
import "moment-timezone";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [selectedate, setSelecteDate] = useState(null);
  const [date, setDate] = useState([]);
  const [apiData, setApiDate] = useState([]);
const navigate = useNavigate()
  const fetchDates = () => {
    const today = moment();
    const nextWeek = moment().add(7, "days");
    const dateArray = [];

    while (today.isSameOrBefore(nextWeek, "day")) {
      const formattedDate = today.format("ddd, D MMMM YYYY");
      dateArray.push(formattedDate);
      today.add(1, "day");
    }

    setDate(dateArray);
  };
  const handleDateClick = (dated) => {
    console.log(dated);
    setSelecteDate(dated);
  };
  const { data } = useQuery("getFixtures", Api.Fixtures);

  const convertToCountryLocalTime = (utcTime, timeZone) => {
    const localTime = moment.utc(utcTime).tz(timeZone);
    return localTime.format("HH:mm");
  };
  
  const handleData = (e) => {
    console.log(e, "data aaaa");
    localStorage.setItem("MatchID",e)
    navigate('/MatchDetails');
  };
  console.log(data, "date");
 
  function convertToLocalTime(utcDateString) {
    const utcDate = new Date(utcDateString);
    const localDate = new Date(utcDate.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
    const options = {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    };
    return localDate.toLocaleString('en-US', options);
  }
  
  useEffect(() => {
    if (data) {
      const response = data.data;
      console.log(response, "response");
      // local time converztion
      const test = response.map((fixture) => {
        const localTime1 = convertToLocalTime(fixture.KickOffUtc);
        const localTime = moment.utc(fixture.KickOffUtc).local().format("M/D/YYYY h:mm:ss A");
        const matchTime = moment.utc(fixture.MatchTime, "HH:mm:ss").local().format("HH:mm:ss");
        return { ...fixture, LocalTime: localTime, MatchTime: matchTime, localTime1: localTime1 };
      });
  
      const filteredData = response.filter((fixture) =>
        moment(fixture.KickOffUtc).isSame(
          moment(selectedate, "ddd, D MMMM YYYY"),
          "day"
        )
      );
  
      setApiDate(filteredData);
      console.log(filteredData, "filteredData", test);
    }
  }, [data, selectedate]);
  

  useEffect(() => {
    fetchDates();
  }, []);
  return (
    <div>
      <Heading />
      <div>
        <div className="homeHeader container">
          <header className="headerDate">
            { date.map((date) => (
              <div
                className={`headerDateMap ${
                  selectedate === date ? "active" : ""
                }`}
                key={date}
                onClick={() => handleDateClick(date)}
                style={{
                  backgroundColor: selectedate === date ? "#f60b0b" : "#f4f4f4",
                }}
              >
                {date}
              </div>
            ))}
          </header>
        </div>
        <div className="data-table ">
          <div className="table-header d-flex mt-1 ms-1">
            <img src={footBall} alt="footBall" width={20} />
            <div>FootBall</div>
          </div>
          {selectedate!==null && 
          <div className="table-content container">
            {   apiData
              .reduce((acc, fixture) => {
                if (!acc.includes(fixture.Country)) {
                  acc.push(fixture.Country);
                }
                return acc;
              }, [])
              .map((country, index, array) => (
                <React.Fragment key={`country-${country}`}>
                  <div
                    className="countryName"
                    style={{
                      marginTop: index === 0 ? "15px" : "0",
                    }}
                  >
                    {country}
                  </div>
                  {apiData
                    .filter((fixture) => fixture.Country === country)
                    .map((fixture) => (
                      <div
                        className="matchName"
                        key={`match-${fixture.MatchId}`}
                        style={{
                          marginBottom:
                            index === array.length - 1 ? "10px" : "0",
                          backgroundColor: "#f3f3f3",
                          border: "1 px solid black",
                        }}
                        onClick={() => handleData(fixture.MatchId)}
                      >
                        <span className="temaname">{fixture.Team1Name}</span>
                        <span className="matctime">
                      
                          {moment(fixture.KickOffUtc, "HH:mm:ss").format("HH:mm")} 
                        
                        </span>
                        <span className="temaname">{fixture.Team2Name}</span>
                      </div>
                    ))}
                </React.Fragment>
              ))}
          </div>
          }
        </div>
      </div>
      <div className="container"></div>
    </div>
  );
}


