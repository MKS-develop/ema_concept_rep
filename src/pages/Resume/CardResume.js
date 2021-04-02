import React from 'react'

const CardResume = ({mesAnterior, mesActual, titulo, cantidad}) => (
    <div className="card">
      <div className="card-header">
        <div className="row align-items-center justify-content-spacebetween">
          
          <div className="col-md-6 col-sm-12">
            <p className="card-config-p mb-0">{titulo}</p>
          </div>
          <div className="col-md-6 col-sm-12">
            <p className="card-resume-header-text mb-0">{cantidad}</p>
          </div>
        
        </div>
      </div>
      <div className="card-body">
        <div className="row align-items-center">
          
          <div className="col-md-6 col-sm-12 text-center">
            <div className="row card-resume-info-row">
              {mesActual > mesAnterior 
              ? <p className="material-icons decrease mb-0">keyboard_arrow_down</p>
              : mesActual === mesAnterior ? <p className="material-icons iqual mb-0">remove</p>
              : <p className="material-icons increase mb-0">keyboard_arrow_up</p>
              }
              <p className="card-resume-info-text mb-0">{mesAnterior}</p>
            </div>
            <p className="text-muted mb-0">Mes anterior</p>
          </div>
          <div className="col-md-6 col-sm-12 text-center">
            <div className="row card-resume-info-row">
              {mesActual > mesAnterior 
              ? <p className="material-icons increase mb-0">keyboard_arrow_up</p>
              : mesActual === mesAnterior ? <p className="material-icons iqual mb-0">remove</p>
              : <p className="material-icons decrease mb-0">keyboard_arrow_down</p>
              }
              <p className="card-resume-info-text mb-0">{mesActual}</p>
            </div>
            <p className="text-muted mb-0">Mes actual</p>
          </div>
        
        </div>
      </div>
    </div>
)

export default CardResume