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

const debounce = (func, wait = 500) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(this, args);
    }, wait);
    if (!timeout) func.apply(this, [...args]);
  };
};

class App extends React.Component {
  state = {
    query: "",
    cities: [],
    isLoading: false,
  };

  setQuery = (state) => {
    this.setState({
      query: state,
    });
  };

  setCities = (state) => {
    this.setState({
      cities: state,
    });
  };

  setLoading = (state) => {
    this.setState({
      isLoading: state,
    });
  };

  getCities = (query) => {
    if (!query) return;

    this.setLoading(true);
    fetch(
      `http://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${query}&limit=10&offset=0&hateoasMode=false&sort=name`
    )
      .then((response) => response.json())
      .then(({ data }) => {
        this.setCities(data);
        this.setLoading(false);
      });
  };

  debounceGetCities = debounce(this.getCities);

  onChange = (event) => {
    const {
      target: { value },
    } = event;
    this.setQuery(value);
    this.debounceGetCities(value);
  };

  render() {
    const { query, cities, isLoading } = this.state;
    return (
      <div className="App">
        <input type="text" value={query} onChange={this.onChange} />
        {query ? <CitiesList isLoading={isLoading} cities={cities} /> : null}
      </div>
    );
  }
}

export default App;
