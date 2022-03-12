import React from "react";
import cities from "../lib/city.list.json";
import Link from "next/link";
import Router from "next/router";

export default function SearchBox({ placeholder }) {
  // new state variable
  const [query, setQuery] = React.useState(""); // sets react to empty string
  const [results, setResults] = React.useState([]); // sets up empty array for search results

  React.useEffect(() => {
    const clearQuery = () => setQuery("");
    Router.events.on("routeChangeComplete", clearQuery);
    return () => {
      Router.events.off("routeChangeComplete", clearQuery);
    };
  }, []);

  // function to react to input change
  const onChange = (e) => {
    const { value } = e.target;
    setQuery(value);

    // initializing an empty array
    let matchingCities = [];

    // after 3 letters provides list of 5 possible matches
    if (value.length > 3) {
      for (let city of cities) {
        if (matchingCities.length >= 10) {
          break;
        }

        const match = city.name.toLowerCase().startsWith(value.toLowerCase());

        if (match) {
          const cityData = {
            ...city,
            slug: `${city.name.toLowerCase().replace(/ /g, "-")}-${city.id}`,
          };
          matchingCities.push(cityData);
        }
      }
    }
    return setResults(matchingCities);
  };
  return (
    <div className="search">
      <input
        type="text"
        value={query}
        onChange={onChange}
        placeholder={placeholder ? placeholder : ""}
      />
      {/* if search length is greater than 3 do this        */}
      {query.length > 3 && (
        <ul>
          {results.length > 0 ? (
            results.map((city) => (
              <li key={city.slug}>
                <Link href={`/location/${city.slug}`}>
                  <a>
                    {city.name}
                    {city.state ? `, ${city.state}` : ""}{" "}
                    <span>({city.country})</span>
                  </a>
                </Link>
              </li>
            ))
          ) : (
            <li className="search__no-results">No Results Found</li>
          )}
        </ul>
      )}
    </div>
  );
}
