import React, {useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import firebase from '../../firebase/config'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

function History() {
    
    let data = useLocation();
    const [user, setUser] = useState({})
    const [episodioStatus, setEpisodioStatus] = useState(false)
    const [eventoStatus, setEventoStatus] = useState(false)

    let alergias = [
        {
            e: "3424241",
            alergia: "Alergia 1",
            fechaAlergia: "21-Dic"
        },
        {
            e: "2324424",
            alergia: "Alergia 2",
            fechaAlergia: "1-Ene"
        },
        {
            e: "111234",
            alergia: "Alergia3 ",
            fechaAlergia: "14-Feb"
        },
        {
            e: "65434",
            alergia: "Alergia 4",
            fechaAlergia: "10-Mar"
        },

    ]
    let patologias = [
        {
            e: "3424241",
            patologia: "patologia 1",
            fechaPatologia: "21-Dic"
        },
        {
            e: "2324424",
            patologia: "patologia 2",
            fechaPatologia: "1-Ene"
        },
        {
            e: "111234",
            patologia: "patologia ",
            fechaPatologia: "14-Feb"
        },
        {
            e: "65434",
            patologia: "patologia 4",
            fechaPatologia: "10-Mar"
        },

    ]

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
        });
    }, [])

    return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className="main-content-container container-fluid px-4">
            
            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
                <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                    <div className="row align-items-center">
                        <div className="col">
                            <p className="page-title bold">
                                <Link to="/clients" className="page-title light">Cliente</Link>{' > '}Historia</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-1 mb-0">
                    <div className="row align-items-center justify-content-space-around">
                        <i className="material-icons color-white display-5">help_outline</i>
                    </div>
                </div>
            </div>
            
            <div className="container">
                {/* Informacion mascota */}
                <div className="row box-info-wrapper align-items-center justify-content-spacebetween">
                    <div className="col-lg-4">
                        <div className="box-info text-center">
                            <img src={user.avatar} className="box-info-img"/>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="box-info">
                            <p className="mb-0 box-info-p strong">Henry</p>
                        </div>
                        <div className="box-info">
                            <p className="mb-0 box-info-p">Especie: Perro</p>
                        </div>
                        <div className="box-info">
                            <p className="mb-0 box-info-p">Castrado: No</p>
                        </div>
                        <div className="box-info">
                            <p className="mb-0 box-info-p">Fecha de nacimiento: 29 May. 2016</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="box-info">
                            <p className="mb-0 box-info-p">Raza: Cocker</p>
                        </div>
                        <div className="box-info">
                            <p className="mb-0 box-info-p">Peso: 20kg</p>
                        </div>
                        <div className="box-info">
                            <p className="mb-0 box-info-p">Edad: 3 años y 5 meses</p>
                        </div>
                        <div className="box-info">
                            <p className="mb-0 box-info-p">Temperatura: 36</p>
                        </div>
                    </div>
                </div>
                {/* End informacion mascota */}
                <div className="row mt-4">
                    {/* General */}
                    <div className="col-lg-8">
                        <div className="row">
                            <div className="col-lg-4">
                                <p onClick={()=>{setEpisodioStatus(true); setEventoStatus(false)}} className={`btn btn-block ${episodioStatus ? "btn-primary" : "btn-outline-primary"}`}>
                                    Nuevo episodio
                                </p>
                            </div>
                            <div className="col-lg-4">
                                <p onClick={()=>{setEpisodioStatus(false); setEventoStatus(true)}} className={`btn btn-block ${eventoStatus ? "btn-primary" : "btn-outline-primary"}`}>
                                    Nuevo evento
                                </p>
                            </div>
                            <div className="col-lg-4">
                                <p onClick={()=>{setEpisodioStatus(false); setEventoStatus(false)}} className={`btn btn-block ${!eventoStatus && !episodioStatus ? "btn-primary" : "btn-outline-primary"}`}>
                                    Vista general
                                </p>
                            </div>
                        </div>
                        { !episodioStatus && !eventoStatus ?
                            <Tabs>
                                <TabList>
                                    <Tab>Patologías</Tab>
                                    <Tab>Vacunas</Tab>
                                    <Tab>Desparasitaciones</Tab>
                                    <Tab>Alergias</Tab>

                                </TabList>
                                <TabPanel>
                                    {patologias.map((patologia)=>{
                                        return (
                                            <div key={patologia.eid} className="mb-2 row align-items-center justify-content-spacebetween border-bottom">
                                                <div className="mb-1 col-lg-6">{patologia.patologia}</div>
                                                <div className="mb-1 col-lg-6">{patologia.fechaPatologia}</div>
                                            </div>
                                        )
                                    })}
                                    <p className="mt-3 btn btn-outline-secondary">Nueva patología</p>
                                </TabPanel>
                                <TabPanel>
                                    {alergias.map((alergia)=>{
                                        return (
                                            <div key={alergia.eid} className="mb-2 row align-items-center justify-content-spacebetween border-bottom">
                                                <div className="mb-1 col-lg-6">{alergia.alergia}</div>
                                                <div className="mb-1 col-lg-6">{alergia.fechaAlergia}</div>
                                            </div>  
                                        )
                                    })}
                                    <p className="mt-3 btn btn-outline-secondary">Nueva vacuna</p>
                                </TabPanel>
                                <TabPanel>
                                    {alergias.map((alergia)=>{
                                        return (
                                            <div key={alergia.eid} className="mb-2 row align-items-center justify-content-spacebetween border-bottom">
                                                <div className="mb-1 col-lg-6">{alergia.alergia}</div>
                                                <div className="mb-1 col-lg-6">{alergia.fechaAlergia}</div>
                                            </div>  
                                        )
                                    })}
                                    <p className="mt-3 btn btn-outline-secondary">Nueva desparacitación</p>
                                </TabPanel>
                                <TabPanel>
                                    {alergias.map((alergia)=>{
                                        return (
                                            <div key={alergia.eid} className="mb-2 row align-items-center justify-content-spacebetween border-bottom">
                                                <div className="mb-1 col-lg-6">{alergia.alergia}</div>
                                                <div className="mb-1 col-lg-6">{alergia.fechaAlergia}</div>
                                            </div>  
                                        )
                                    })}
                                    <p className="mt-3 btn btn-outline-secondary">Nueva alergia</p>
                                </TabPanel>
                            </Tabs>
                        : episodioStatus ? 
                            <div>Episodio</div>
                        :
                            <div>Evento</div>
                        }
                    </div>
                    {/* End General */}
                    {/* Antecedentes y otros episodios */}
                    <div className="col-lg-4">
                        <div className="antecedentes-box">
                            <div className="antecedentes-box-title">
                                Antecedentes
                            </div>
                            <div className="antecedentes-box-p">
                                Lugar de nacimiento: Panamá
                            </div>
                            <div className="antecedentes-box-p">
                                Ha vivido con único dueño
                            </div>
                            <div className="antecedentes-box-p">
                                Vive en departamento
                            </div>
                            <div className="antecedentes-box-p">
                                No convive con otros animales
                            </div>
                            <div className="antecedentes-box-p">
                                Sedentario
                            </div>
                            <div className="antecedentes-box-p">
                                Toma agua 3 veces al día
                            </div>
                            <div className="antecedentes-box-p">
                                Aparato respiratorio: Se evidencia dificultad al respirar
                            </div>
                        </div>
                    </div>
                    {/* End antecedentes y otros episodios */}
                </div>
            </div>

        </div>
    </MuiPickersUtilsProvider>
    )

}

export default History
