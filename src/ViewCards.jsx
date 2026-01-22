import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./ViewCards.css";
import FileUploader from "./FileUploader";

function ViewCards() {
  const [randomQuestion, setRandomQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const chapters = {
    '1': "Introducción",
    '3': "Análisis y especificación de los requerimientos",
    '4': "Arquitectura del software",
    '6 y 7': "Diseño del software",
    '6': "Diseño orientado a funciones",
    '7': "Diseño orientado a objetos",
    '8': "Diseño detallado",
  };

  useEffect(() => {
    fetch("./Flashcards.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          complete: (results) => {
            const filteredData = results.data.filter(
              (row) => row[0] === selectedChapter.toString()
            );
            const secondColumn = filteredData.map((row) => row[1]);
            setQuestions(secondColumn);
            setFilteredQuestions(secondColumn);
          },
        });
      });
  }, [selectedChapter]);

  const getRandomQuestion = () => {
    if (filteredQuestions.length > 0) {
      const randomQuestion =
        filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
      setRandomQuestion(randomQuestion);
    }
  };

  return (
    <>
      <div className="questions">
        <h1>Pregunta:</h1>
        <h2>{randomQuestion}</h2>
        <button onClick={getRandomQuestion}>Nueva pregunta</button>
      </div>
      <div className="buttons">
        <h3>Mostrando preguntas del capítulo: {selectedChapter} - {chapters[selectedChapter]}</h3>
        {Object.keys(chapters).map((cap) => (
          <button
            key={cap}
            onClick={() => setSelectedChapter(cap)}
            style={{
              margin: "5px",
              backgroundColor: selectedChapter === cap ? "#6a5acd" : "",
              color: selectedChapter === cap ? "white" : "",
            }}
          >
            {cap}
          </button>
        ))}
      </div>
    </>
  );
}

export default ViewCards;
