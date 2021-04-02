import React, {useState, useEffect} from 'react'
import firebase from '../firebase/config'

function Claims() {
  const [btnMessage, setBtnMessage] = useState("Enviar reclamo");
  const [user, setUser] = useState({})
  const [claims, setClaims] = useState([])
  const [claim, setClaim] = useState({})
  const [tiposReclamos, setTiposReclamos] = useState([])
  const [tipoReclamo, setTipoReclamo] = useState("")
  const [razonReclamo, setRazonReclamo] = useState("")
  const [numeroOrden, setNroOrden] = useState("")

  const getClaims = async() =>{
    let tipos = [];
    await firebase.db.collection('Reclamos').where("aliadoId", "==", firebase.auth.currentUser.uid)
    .get().then(val => {
      val.docs.forEach(item=>{
        tipos.push(item.data())
      })
      setClaims(tipos)
    })
  }

  function getTiposReclamo(){
    let tipos = []
    firebase.db.collection('TiposReclamo').get().then(data=>{  
      data.forEach(tipo=>{
        tipos.push(tipo.id)
        tipos.sort()
      })
      setTiposReclamos(tipos)
    });
  }

	useEffect(() => {
    firebase.getCurrentUser().then(setUser);
    getClaims();
    getTiposReclamo();
	}, [])

  return (
    <div className="main-content-container container-fluid px-4">

       <div className="page-header align-items-center justify-content-spacebetween row no-gutters py-2 px-4 my-4">
        <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
          <div className="row align-items-center">
            <div className="col">
              <p className="page-title">Reclamos</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-1 mb-0">
          <div className="row align-items-center justify-content-space-around">
            <i className="material-icons color-white display-5">help_outline</i>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-7 col-md-7 col-sm-12">
          {
            claims.length > 0 ? claims.map(claim=>{
              return(
                <div onClick={() => setClaim(claim)} key={claim.id}>
                  <p>{claim.razonReclamo} - {claim.status}</p>
                </div>
              )
            }) : <div className="text-center"><p>No hay reclamos</p></div>
          }
        </div>
        <div className="col-lg-5 col-md-5 col-sm-12">
          { claim.status != null ? <div className="card">
            <div className="card-header text-center">
              <h4>Reclamo</h4>
            </div>
            <div className="px-4">
              <div className="card-claim-box">
                <p className="card-claim-title">Id del reclamo</p>
                <p className="card-claim-text">{claim.reclamoId}</p>
              </div>
              <div className="card-claim-box">
                <p className="card-claim-title">Razón del reclamo</p>
                <p className="card-claim-text">{claim.razonReclamo}</p>
              </div>
              <div className="card-claim-box">
                <p className="card-claim-title">Tipo de reclamo</p>
                <p className="card-claim-text">{claim.tipoReclamo}</p>
              </div>
              <div className="card-claim-box">
                <p className="card-claim-title">Status del reclamo</p>
                <p className="card-claim-text">{claim.status}</p>
              </div>
              <div className="card-claim-box">
                <p className="card-claim-title">Fecha del reclamo</p>
                <p className="card-claim-text">{claim.fechaReclamo}</p>
              </div>
              
            </div>
            <div className="card-footer">
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <button onClick={deleteReclamo} className="btn btn-danger">Eliminar reclamo</button>
                </div>
                <div className="col-md-6 col-sm-12">
                  <button onClick={uploadReclamo} className="btn btn-primary">Editar reclamo</button>
                </div>
              </div>
            </div>
          </div>
          : <form onSubmit={e => e.preventDefault() && false }>
            <div className="card">
              <div className="card-header text-center">
                <h4>Hacer reclamo</h4>
              </div>
              <div className="px-4">
                <div className="form-group">
                  <select className="form-control" value={tipoReclamo} onChange={e => setTipoReclamo(e.target.value)}>
                    {tiposReclamos.map(data => (
                        <option key={data} value={data}>{data}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <input type="text" onChange={(e)=>{setNroOrden(e.target.value)}} placeholder="Nro. de orden" className="form-control"/>
                </div>
                <div className="form-group">
                  <input type="text" onChange={(e)=>{setRazonReclamo(e.target.value)}} placeholder="Razón del reclamo" className="form-control"/>
                </div>
              </div>
              <div className="card-footer">
                <button onClick={uploadReclamo} className="btn btn-primary btn-block">{btnMessage}</button>
              </div>
            </div>
          </form>}
        </div>
      </div>
      

    </div>
  )

  async function uploadReclamo() {
    setBtnMessage("Enviando...")
    let reclamoId = Date.now().toString();
    let reclamoDate = Date().toLocaleString();
    // alert(reclamoId);
    let reclamos = []
    await firebase.db.collection('Reclamos').get().then(data=>{  
      data.forEach(reclamo=>{
        reclamos.push(reclamo.id)
      })
    })
    try {
      uploadPart(reclamoId, reclamoDate, reclamos.length).then((val)=>{
        window.location.href = "/claims"
      })
    } catch(error) {
      alert(error.message)
    }
  }
    
  async function uploadPart(reclamoId, reclamoDate, rl){
    await firebase.db.collection("Reclamos").doc(reclamoId).set({
      id: reclamoId,
      reclamoId: "51" + (rl + 1),
      aliadoId: user.aliadoId,
      reclamo: razonReclamo,
      numeroOrden: numeroOrden === "" ? null : numeroOrden,
      tipoReclamo: tipoReclamo,
      razonReclamo: razonReclamo,
      descripcion: razonReclamo,
      accion: null,
      status: "Abierto",
      usuarioAtendio: null,
      fechaReclamo: reclamoDate,
      fechaCierre: null,
    })
  }

  async function deleteReclamo(){
    try{
      await firebase.db.collection('Reclamos').doc(claim.id).delete()
      window.location.href = "/claims"
    }catch(e){
      console.log("Error: " + e);
    }
  }
}

export default Claims