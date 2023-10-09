import React from 'react'
import { useState, CSSProperties } from "react";
import { PacmanLoader } from 'react-spinners';
import ClipLoader from "react-spinners/ClipLoader";

function Testload() {

  return (
<div className="sweet-loading">

      <PacmanLoader size={50} color="#36d7b7" />

    </div>  )
}

export default Testload