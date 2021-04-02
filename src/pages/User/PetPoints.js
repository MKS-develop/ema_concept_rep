import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link} from 'react-router-dom';

function PetPoints() {

    const [user, setUser] = useState({})
    const [petPoints, setPetPoints] = useState({})
    const [Pesos, setPesos] = useState({})
    
    useEffect(() => {
        async function fetchData() {
            await firebase.getCurrentUser().then(setUser)
            const data = (await firebase.db.doc(`Aliados/${await user.aliadoId}/Petpoints/${await user.aliadoId}`).get()).data()
            const s = (await firebase.db.doc(`Ciudades/${await user.pais}/Petpoints/Precio`).get()).data()
            setPetPoints(data)
            setPesos(s)   
        }
        fetchData();
    })

    return (

        <div className="main-content-container container-fluid px-4">

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters py-2 px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                    <Link to="/profile" className="ml-3 mr-3 page-title">Mi cuenta</Link>
                    <Link to="/bank" className="mr-3 page-title">Datos Bancarios</Link>
                    <Link to="/petpoints" className="mr-3 page-title">Puntos</Link>
                </div>
              </div>
              <div className="col-12 col-sm-1 mb-0">
                <div className="row align-items-center justify-content-space-around">
                  <i className="material-icons color-white display-5">help_outline</i>
                </div>
              </div>
            </div>
            {user && petPoints && Pesos ?
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 col-md-1">
                        <img src="../images/icons/petpoints.svg" alt="" width="60" height="60"/>
                    </div>
                    <div className="col-sm-12 col-md-11">
                        <p className="bold color-dark mb-0">{user.nombre}</p>
                        <p>Tu estado de cuenta de Puntos</p>
                        <div className="row no-gutters">
                            <p className="mr-3 mb-0">Puntos asignados</p>
                            <p className="color-secondary mr-3 mb-0">{petPoints.ppAcumulados}</p>
                        </div>
                        <div className="row no-gutters">
                            <p className="mr-3">Puntos canjeados</p>
                            <p className="color-secondary ">{petPoints.ppCanjeados}</p>
                        </div>
                        <div className="row no-gutters">
                            <p className="bold color-dark mr-3 mb-0">Tienes disponibles</p>
                            <p className="color-secondary mr-3 mb-0">{petPoints.ppAcumulados}</p>
                            <p className="bold color-dark mr-3 mb-0">Puntos</p>
                        </div>
                        <div className="row no-gutters">
                            <p className="bold color-dark mr-3">Valor</p>
                            <p className="color-secondary mr-3">{petPoints.ppAcumulados * Pesos.petpointPE}</p>
                            <p className="bold color-dark mr-3">Pesos</p>
                        </div>
                    </div>
                </div>
            </div>
            : <p>Cargando</p> 
            }

          </div>
    )    

}

export default PetPoints
