import React, { useState, useRef } from "react";
import "./index.css";

const Text = ({ onDone }) => {
  const [text, setText] = useState("");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const textRef = useRef(null);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleFontChange = (event) => {
    setFontFamily(event.target.value);
  };

  const toggleBold = () => {
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    setIsItalic(!isItalic);
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const rect = textRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.width / 2,
        y: e.clientY - rect.height / 2,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleDone = () => {
    onDone({ text, fontFamily, isBold, isItalic, color, x: position.x, y: position.y });
  };

  return (
    <div className="text-container">
      <h2>Text</h2>
      <div className="controls">
        <select onChange={handleFontChange} value={fontFamily}>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
        </select>
        <div className="buttons">
          <button
            className={isBold ? "buttonClicked" : "button"}
            onClick={toggleBold}
          >
            B
          </button>
          <button
            className={isItalic ? "buttonClicked" : "button"}
            onClick={toggleItalic}
          >
            I
          </button>
          </div>
          <div className="cp">
            <input
              className="input"
              type="color"
              value={color}
              onChange={handleColorChange}
              title="Color" 
            />
        </div>
      </div>
      <div>
        <textarea
          className="texta"
          value={text}
          onChange={handleChange}
          placeholder="Enter your text here"
          rows="5"
          cols="40"
          style={{
            fontFamily: fontFamily,
            fontWeight: isBold ? "bold" : "normal",
            fontStyle: isItalic ? "italic" : "normal",
            color: color,
          }}
        />
        <button onClick={handleDone}>Done</button>
      </div>
    </div>
  );
};

export default Text;
