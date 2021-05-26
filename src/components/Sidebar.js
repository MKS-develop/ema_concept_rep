import React from 'react'
import {NavLink} from 'react-router-dom';


function Sidebar() {
    return (
        <aside className="main-sidebar col-12 col-md-3 col-lg-2 px-0">
          <div className="main-navbar">
            <nav className="align-items-stretch navbar-light bg-white flex-md-nowrap border-bottom p-0">
              <a className="navbar-brand h-auto w-100 mr-0 py-0" href="/">
                <div className="m-auto navbar-img">
                  <img id="main-logo" className="d-inline-block align-top mr-1" src="/images/logo-maz.png" alt="Maz Aliados"/>
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
                  <i className="material-icons">inbox</i>
                  <span>Órdenes</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/agenda" activeClassName="active">
                  <i className="material-icons">today</i>
                  <span>Agenda</span>
                </NavLink>
              </li>
              {/* <li className="nav-item">
                <NavLink className="nav-link" exact to="/adoption" activeClassName="active">
                  <i className="material-icons">pets</i>
                  <span>Adopción y apadrinamiento</span>
                </NavLink>
              </li> */}
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/clients" activeClassName="active">
                  <i className="material-icons">people</i>
                  <span>Clientes</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/promotions" activeClassName="active">
                  <i className="material-icons">shopping_bag</i>
                  <span>Promociones</span>
                </NavLink>                
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/messages" activeClassName="active">
                  <i className="material-icons">chat</i>
                  <span>Mensajes</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/claims" activeClassName="active">
                  <i className="material-icons">error_outline</i>
                  <span>Reclamos</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/refereds" activeClassName="active">
                  <i className="material-icons">drafts</i>
                  <span>Referidos</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/plans" activeClassName="active">                  
                  <i className="material-icons">monetization_on</i>
                  <span>Mi plan</span>
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

