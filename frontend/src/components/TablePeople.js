import React, { useState, useEffect } from "react";
import axios from "axios";

const TableNoOfPeople = () => {
  const [nopeople, setNoPeople] = useState("");
  const [tables, setTables] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const handleChange = (e) => {
    setNoPeople(e.target.value);
  };

  const handleNextPage = () => {
    if (nextPage) {
      fetchTables(nopeople, nextPage);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      fetchTables(nopeople, prevPage);
    }
  };

  const fetchTables = async (nopeopleValue, pageUrl = null) => {
    try {
      const apiUrl = pageUrl || `/api/tablepeople/${nopeopleValue}/`;
      const response = await axios.get(apiUrl);
      setTables(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  useEffect(() => {
    if (nopeople !== "") {
      fetchTables(nopeople);
    } else {
      setTables([]);
      setNextPage(null);
      setPrevPage(null);
    }
  }, [nopeople]);

  return (
    <div>
      <h1>Tables with No. of People Greater Than {nopeople}</h1>
      <input
        type="text"
        value={nopeople}
        onChange={handleChange}
        placeholder="Enter No. of People"
      />
      <ul>
        {tables.map((table) => (
          <li key={table.id}>
            Table ID: {table.id}, No. of People: {table.nopeople}
          </li>
        ))}
      </ul>
      <button onClick={handlePrevPage} disabled={!prevPage}>
        Previous
      </button>
      <button onClick={handleNextPage} disabled={!nextPage}>
        Next
      </button>
    </div>
  );
};

export default TableNoOfPeople;