import React from "react";
import cities from "../../lib/city.list.json";
import TodaysWeather from "../../components/TodaysWeather";
import HourlyWeather from "../../components/HourlyWeather";
import WeeklyWeather from "../../components/WeeklyWeather";
import Head from "next/head";
import moment from "moment-timezone";
import SearchBox from "../../components/SearchBox";
import Link from "next/link";

export async function getServerSideProps(context) {
  const city = getCity(context.params.city);

  if (!city) {
    return {
      notFound: true,
    };
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&units=imperial&exclude=minutely`
  );

  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  const weeklyWeather = data.daily;

  return {
    props: {
      city: city,
      timezone: data.timezone,
      currentWeather: data.current,
      hourlyWeather: getHourlyWeather(data.hourly, data.timezone),
      weeklyWeather: weeklyWeather,
    },
  };
}

//helper function to get city ID

const getCity = (param) => {
  const cityParam = param.trim();
  // get city ID
  const splitCity = cityParam.split("-");
  const id = splitCity[splitCity.length - 1];

  if (!id) {
    return null;
  }

  const city = cities.find((city) => city.id.toString() == id);

  if (city) {
    return city;
  } else {
    return null;
  }
};

// another helper function to get hourly data for a limited time
const getHourlyWeather = (hourlyData, timezone) => {
  const endOfDay = moment().tz(timezone).endOf("day").valueOf();
  const eodTimeStamp = Math.floor(endOfDay / 1000);

  const todaysData = hourlyData.filter((data) => data.dt < eodTimeStamp);

  return todaysData;
};

export default function City({
  city,
  weather,
  currentWeather,
  hourlyWeather,
  weeklyWeather,
  timezone,
}) {
  // console.log(hourlyWeather);
  return (
    <div>
      <Head>
        <title>{city.name} Weather</title>
      </Head>
      <div className="page-wrapper">
        <div className="container">
          <Link href="/">
            <a className="back-link">&larr; Home</a>
          </Link>
          <SearchBox placeholder="Search for another location..." />
          <TodaysWeather
            city={city}
            weather={weeklyWeather[0]}
            timezone={timezone}
          />
          <HourlyWeather hourlyWeather={hourlyWeather} timezone={timezone} />
          <WeeklyWeather weeklyWeather={weeklyWeather} timezone={timezone} />
        </div>
      </div>
    </div>
  );
}
