import React, {useState} from 'react'

function Refereds() {
  const [btnMessage, setBtnMessage] = useState("Enviar invitación");

  return (
      <div className="main-content-container container-fluid px-4">

        <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
          <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
            <div className="row align-items-center">
              <div className="col">
                <p className="page-title mb-0">Invita a un amigo</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-1 mb-0">
            <div className="row align-items-center justify-content-space-around">
              <i className="material-icons color-white display-5">help_outline</i>
            </div>
          </div>
        </div>
          
        <div className="row w-100">
          <div className="col-lg-5 col-md-5 col-sm-12 mx-auto">
            <form onSubmit={e => e.preventDefault() && false }>
              <div className="card">
                <div className="card-header text-center">
                  <h4>Invitar</h4>
                </div>
                <div className="px-4 py-3">
                  <div className="form-group">
                    <input type="text" placeholder="Nombre del invitado" className="form-control"/>
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Email" className="form-control"/>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary btn-block">{btnMessage}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
    </div>
  )

}

export default Refereds
