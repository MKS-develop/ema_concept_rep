import React, {useState, useEffect} from 'react'
import {NavLink} from 'react-router-dom';
import firebase from '../firebase/config'


function Sidebar() {

  const [role, setRol] = useState({})

  useEffect(() => {
    firebase.getCurrentUser().then((val)=>{
      firebase.getRoleInfo(val.role ?? "Atencion").then((val)=>{
        setRol(val)
      })
    });
  }, [])

  return (
    <aside className="main-sidebar col-12 col-md-3 col-lg-2 px-0">
      <div className="main-navbar">
        <nav className="align-items-stretch navbar-light bg-white flex-md-nowrap border-bottom p-0">
          <a className="navbar-brand h-auto w-100 mr-0 py-0" href="/">
            <div className="m-auto navbar-img">
              <img id="main-logo" className="d-inline-block align-top mr-1" src="/images/logo.png" alt="Aliados"/>
            </div>
          </a>
          <a href="/" className="toggle-sidebar d-sm-inline d-md-none d-lg-none">
            <i className="material-icons">&#xE5C4;</i>
          </a>
        </nav>
      </div>
      <div className="nav-wrapper">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink className="nav-link" exact to="/" activeClassName="active">
              <i className="material-icons">auto_awesome_mosaic</i>
              <span>Resumen</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" exact to="/orders" activeClassName="active">
              <i className="material-icons">today</i>
              <span>Citas</span>
            </NavLink>
          </li>
          {role?.canAccessAgenda && <li className="nav-item">
            <NavLink className="nav-link" exact to="/agenda" activeClassName="active">
              <i className="material-icons">today</i>
              <span>Agenda</span>
            </NavLink>
          </li>}
          <li className="nav-item">
            <NavLink className="nav-link" exact to="/clients" activeClassName="active">
              <i className="material-icons">people</i>
              <span>Pacientes</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" exact to="/events" activeClassName="active">
              <i className="material-icons">bookmark</i>
              <span>Eventos</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" exact to="/export-treatments" activeClassName="active">
              <i className="material-icons">bookmark</i>
              <span>Reportes</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" exact to="/communities" activeClassName="active">
              <i className="material-icons">groups</i>
              <span>Comunidad</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" exact to="/configuration" activeClassName="active">                  
              <i className="material-icons">settings</i>
              <span>Configuración</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>        
  )
}

export default Sidebar

