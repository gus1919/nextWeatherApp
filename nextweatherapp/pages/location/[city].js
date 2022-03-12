import React from "react";
import cities from "../../lib/city.list.json";
import Head from "next/head";
import TodaysWeather from "../../components/TodaysWeather";
import moment from "moment-timezone";

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

  return {
    props: {
      city: city,
      timezone: data.timezone,
      currentWeather: data.current,
      dailyWeather: data.daily,
      hourlyWeather: getHourlyWeather(data.hourly, data.timezone),
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
  hourlyWeather,
  currentWeather,
  dailyWeather,
  city,
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
          <TodaysWeather
            city={city}
            weather={dailyWeather[0]}
            timezone={timezone}
          />
        </div>
      </div>
    </div>
  );
}
