import React, { useState } from "react";
import DragAndDropIcon from "./DragAndDropIcon";
import styled, { css } from "styled-components";

export const Label = styled.label`
  position: relative;
  height: 200px;
  width: 100%;

  border: 2px dashed #e3e9f3;
  border-radius: 5px;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  .icon {
    width: 82px;
    path {
      fill: #ccd0da;
    }
  }

  .isDragging {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .underline {
    color: #1c5de7;
    text-decoration: underline;
    cursor: pointer;
  }

  ${({ isDragging }) => {
    if (isDragging) {
      return css`
        background-color: rgba(28, 93, 231, 0.05) !important;
        border: 2px dashed rgba(28, 93, 231, 0.5) !important;
      `;
    }
  }}

  ${({ hasError }) => {
    if (hasError) {
      return css`
        background-color: rgba(231, 28, 28, 0.05) !important;
        border: 1px solid rgba(250, 9, 9, 0.5) !important;
      `;
    }
  }}
`;

export const P = styled.p`
  margin-top: 10px;
  text-align: center;
  font-size: 13px;
  color: #9ea7b8;
  u {
    color: #1c5de7;
  }
`;

const FORMATS = [
  { name: "png", mimeType: "image/png", ext: ".png" },
  { name: "jpg", mimeType: "image/jpeg", ext: ".jpg" },
];

export default function DropFileZone({ file, setFile, hasError }) {
  const validateFile = (file) => {
    if (FORMATS.includes(file.type)) {
      setFile(file);
    }
  };

  const handleFileChange = ({ target: { files } }) => {
    console.log(files);
    const file = files[0];
    validateFile(file);
    setFile(file);
  };

  const [isDragging, setIsDragging] = useState(false);
  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);
  const stopDragEvent = (event) =>
    event.preventDefault() && event.stopPropagation();
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const { files } = event.dataTransfer;
    validateFile(files[0]);
    setFile(files[0]);
  };

  return (
    <Label
      isDragging={isDragging}
      hasError={hasError}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragOver={stopDragEvent}
    >
      <DragAndDropIcon />
      <P>
        {file ? (
          <span>
            You selected <span className={"underline"}>{file.name}</span> to
            upload
          </span>
        ) : (
          <span>
            Drag & drop your image or{" "}
            <span className={"underline"}>browse</span> for a file to upload
          </span>
        )}
      </P>
      {isDragging && (
        <div onDragLeave={handleDragLeave} className="isDragging" />
      )}
      <input
        onChange={handleFileChange}
        type="file"
        accept={FORMATS.map(({ ext }) => ext).join()}
        hidden
      />
    </Label>
  );
}
