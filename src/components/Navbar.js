import React, {useState, useEffect} from 'react'
import firebase from '../firebase/config'
import { Link } from 'react-router-dom'

function Navbar() {

    const [showProfile, setShowProfile] = useState(false);
    const [showNoti, setShowNoti] = useState(false);

    const showProfileClick = () => setShowProfile(!showProfile);  
    const showNotificationsClick = () => setShowNoti(!showNoti);  

    const [user, setUser] = useState({})
    const [nno, setNno] = useState(0)

    const getOrders = async(id) =>{
        let nno = [];
        await firebase.db.collection('Ordenes').where("aliadoId", "==", id).where("status", "==", "Por confirmar")
        .get().then(val => {
          val.docs.forEach(item=>{
            nno.push(item.data())
          })
        })
        setNno(nno.length)
    }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getOrders(val.aliadoId)
        });
    }, [])

    return (
        <div className="main-navbar sticky-top bg-white">
            <nav className="navbar align-items-stretch navbar-light flex-md-nowrap p-0">
                <ul className="navbar-nav border-left flex-row justify-content-spacebetween w-100">
                <li className="nav-item dropdown">
                    <p className="nav-link dropdown-toggle text-nowrap px-3" onClick={()=>showProfileClick()} href="/">
                        <img className="user-avatar rounded-circle mr-2" src={user.avatar ?? "cargando"} alt="User Avatar"/>
                        <span className="d-none d-md-inline-block">{user.nombre ?? "cargando"}</span>
                    </p>
                    <div className={showProfile ? "dropdown-menu show dropdown-menu-small" : "dropdown-menu dropdown-menu-small"}>
                        <Link className="dropdown-item" to="/profile">
                            <i className="material-icons">&#xE7FD;</i> Perfil
                        </Link>
                        <Link className="dropdown-item" to="/configuration">
                            <i className="material-icons">settings</i> Configuraci??n
                        </Link>
                        <div className="dropdown-divider"></div>
                        <p className="dropdown-item text-danger" onClick={logout}>
                            <i className="material-icons text-danger">&#xE879;</i> Salir
                        </p>
                    </div>
                </li>
                <li className="nav-item dropdown notifications">
                    <p onClick={()=>showNotificationsClick()} className="nav-link nav-link-icon text-center">
                        <div className="nav-link-icon__wrapper">
                            <i className="material-icons">&#xE7F4;</i>
                            <span className="badge badge-pill badge-danger">{nno > 9 ? "+9" : nno }</span>
                        </div>
                    </p>
                    <div className={showNoti ? "dropdown-menu dropdown-menu-small show" : "dropdown-menu dropdown-menu-small"} aria-labelledby="dropdownMenuLink">
                    <a className="dropdown-item" href="/orders">
                        <div className="notification__icon-wrapper">
                        <div className="notification__icon">
                            <i className="material-icons">&#xE8D1;</i>
                        </div>
                        </div>
                        <div className="notification__content">
                        <span className="notification__category">??rdenes</span>
                        <p>Tienes <span className="text-success text-semibold">{nno}</span> ??rdenes por confirmar</p>
                        </div>
                    </a>
                    <a className="dropdown-item notification__all text-center" href="/"> Ver notificaciones </a>
                    </div>
                </li>
                </ul>
                <nav className="nav">
                    <p className="nav-link nav-link-icon toggle-sidebar d-md-inline d-lg-none text-center border-left">
                        <i className="material-icons">&#xE5D2;</i>
                    </p>
                </nav>
            </nav>
        </div>
    )

    async function logout() {
		await firebase.logout().then((val)=>{
            window.location.href = "/login";
        })
	}
}

export default Navbar

