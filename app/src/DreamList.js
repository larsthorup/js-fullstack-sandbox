import React, { useEffect, useState } from "react";

const DreamList = () => {
  const [dreamList, setDreamList] = useState([]);
  useEffect(() => {
    const fetchDreams = async () => {
      const response = await fetch("/.netlify/functions/dreams");
      const dreamList = await response.json();
      setDreamList(dreamList);
    };
    fetchDreams();
  }, []);
  return (
    <div>
      <h3>All my dreams</h3>
      <ul>
        {dreamList.map((dream) => (
          <li key={dream.id}>{dream.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default DreamList;
