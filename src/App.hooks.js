import React, { useState, useEffect } from "react";
import "./App.css";

const CitiesList = ({ cities, isLoading }) => {
  if (isLoading) {
    return null;
  }

  return cities.length > 0 ? (
    <ul>
      {cities.map((city) => (
        <li key={city.id}>{city.name}</li>
      ))}
    </ul>
  ) : (
    <p>No results</p>
  );
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay]
  );

  return debouncedValue;
}

function App() {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setQuery(value);
  };

  const getCities = (query) => {
    if (!query) return;

    setLoading(true);
    fetch(
      `http://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${query}&limit=10&offset=0&hateoasMode=false&sort=name`
    )
      .then((response) => response.json())
      .then(({ data }) => {
        setCities(data);
        setLoading(false);
      });
  };

  const debounceQuery = useDebounce(query, 500);

  useEffect(
    () => {
      if (debounceQuery) getCities(query)
    },
    [debounceQuery]
  );

  return (
    <div className="App">
      <input type="text" value={query} onChange={onChange} />
      {query && <CitiesList isLoading={isLoading} cities={cities} />}
    </div>
  );
}

export default App;
