import React, {useState, useEffect} from 'react'
import {useLocation} from "react-router-dom";

function Prueba2(){
    let data = useLocation();
    return (
      <div className="main-content-container container-fluid px-4">
          {data.state.name}
          {data.state.age}
          {data.state.city}
      </div>
    )

}

export default Prueba2
