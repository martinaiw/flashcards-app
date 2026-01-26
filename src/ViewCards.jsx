import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./ViewCards.css";

const normalizeText = (text) => {
	return (
		text
			?.toString()
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "") || ""
	);
};

const isChapterMatch = (rowValue, target) => {
	if (!rowValue || !target) return false;
	return rowValue.toString().trim() === target.toString().trim();
};

function ViewCards() {
	const [randomQuestion, setRandomQuestion] = useState("");
	const [allData, setAllData] = useState([]);
	const [filteredQuestions, setFilteredQuestions] = useState([]);
	const [selectedChapter, setSelectedChapter] = useState("");

	const chapters = {
		1: "Introducción",
		3: "Análisis y especificación de los requerimientos",
		4: "Arquitectura del software",
		67: "Diseño del software",
		6: "Diseño orientado a funciones",
		7: "Diseño orientado a objetos",
		8: "Diseño detallado",
	};

	useEffect(() => {
		const csvPath = `${
			import.meta.env.BASE_URL
		}Flashcards.csv?v=${new Date().getTime()}`;
		fetch(csvPath)
			.then((res) => res.text())
			.then((csvText) => {
				Papa.parse(csvText, {
					header: true,
					skipEmptyLines: "greedy",
					complete: (results) => {
						const normalizedData = results.data.map((row) => {
							const newRow = {};
							Object.keys(row).forEach((key) => {
								newRow[normalizeText(key)] = row[key];
							});
							return newRow;
						});
						setAllData(normalizedData);
					},
				});
			})
			.catch((err) => console.error("Error al cargar el CSV:", err));
	}, []);

	useEffect(() => {
		if (allData.length > 0 && selectedChapter) {
			const filtered = allData
				.filter((row) => {
					const rowCap = row.capitulo || row.unidad || row[Object.keys(row)[0]];
					return isChapterMatch(rowCap, selectedChapter);
				})
				.map((row) => row.pregunta || row.flashcard || row[Object.keys(row)[1]])
				.filter((q) => q);

			setFilteredQuestions(filtered);

			if (filtered.length > 0) {
				setRandomQuestion(
					filtered[Math.floor(Math.random() * filtered.length)]
				);
			} else {
				setRandomQuestion("No hay preguntas para este capítulo.");
			}
		}
	}, [selectedChapter, allData]);

	const getRandomQuestion = () => {
		if (filteredQuestions.length > 0) {
			const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
			setRandomQuestion(filteredQuestions[randomIndex]);
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
				{selectedChapter && (
					<h3>
						Mostrando:{" "}
						{selectedChapter.length > 1
							? selectedChapter.split("").join(" y ")
							: selectedChapter}{" "}
						- {chapters[selectedChapter]}
					</h3>
				)}

				{Object.keys(chapters).map((cap) => (
					<button
						key={cap}
						onClick={() => setSelectedChapter(cap.toString())}
						style={{
							margin: "5px",
							padding: "10px",
							backgroundColor:
								selectedChapter === cap.toString() ? "#6a5acd" : "#f0f0f0",
							color: selectedChapter === cap.toString() ? "white" : "black",
							cursor: "pointer",
							border: "1px solid #ccc",
							borderRadius: "5px",
						}}
					>
						Capítulo {cap.length > 1 ? cap.split("").join(" y ") : cap}
					</button>
				))}
			</div>
		</>
	);
}

export default ViewCards;
