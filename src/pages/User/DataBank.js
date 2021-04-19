import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link} from 'react-router-dom';

function DataBank() {

    const [btnMessage, setBtnMessage] = useState("Guardar datos bancarios");
    const [user, setUser] = useState({})
    const [dataBank, setDataBank] = useState({})
    const [bancos, setBancos] = useState([])
    const tipoCuentas = ["Ahorro", "Corriente"]
    const [bankInfo, setBankInfo] = useState({
      banco: "",
      tipoCuenta: "",
      numeroCuenta: "",
      beneficiario: "",
    })

    useEffect(() => {
        async function fetchData() {
            await firebase.getCurrentUser().then(setUser)
            const data = (await firebase.db.doc(`Aliados/${await user.aliadoId}/Datos Bancarios/${await user.aliadoId}`).get()).data()
            const bancos = (await firebase.db.doc(`Bancos/${await user.pais}/`).get()).data()
            setBancos(bancos)
            setDataBank(data)
        }
        fetchData();
    })

    return (

        <div className="main-content-container container-fluid px-4">

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
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
            {dataBank ?
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 col-md-12">
                        {dataBank.banco}
                    </div>
                </div>
            </div>
            : bancos ? <div className="row w-100">
                <div className="col-lg-5 col-md-5 col-sm-12 mx-auto">
                    <form onSubmit={e => e.preventDefault() && false }>
                        <div className="card">
                            <div className="card-header text-center">
                                <h4>Datos bancarios</h4>
                            </div>
                            <div className="px-4 py-4">
                                <div className="form-group">
                                    <input type="text" placeholder="Nro. de cuenta" className="form-control" value={bankInfo.numeroCuenta} onChange={(e)=>{setBankInfo({...bankInfo, numeroCuenta: e.target.value})}}/>
                                </div>
                                <div className="form-group">
                                    <input type="text" placeholder="Beneficiario" className="form-control" value={bankInfo.beneficiario} onChange={(e)=>{setBankInfo({...bankInfo, beneficiario: e.target.value})}}/>
                                </div>
                                <div className="form-group">
                                    <select className="form-control" value={bankInfo.banco} onChange={(e)=>{setBankInfo({...bankInfo, banco: e.target.value})}}>
                                    {bancos.tipos.map(data => (
                                        <option key={data} value={data}>{data}</option>
                                    ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <select className="form-control" value={bankInfo.tipoCuenta} onChange={(e)=>{setBankInfo({...bankInfo, tipoCuenta: e.target.value})}}>
                                    {tipoCuentas.map(data => (
                                        <option key={data} value={data}>{data}</option>
                                    ))}
                                    </select>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-primary btn-block">{btnMessage}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            : <p>Cargando</p>
            }

          </div>
    )    

}

export default DataBank
