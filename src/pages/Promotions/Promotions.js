import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link, useHistory} from 'react-router-dom';
import moment from 'moment';

function Promotions() {

    const history = useHistory()
    const hiddenFileInput = React.useRef(null);
    const [btnMessage, setBtnMessage] = useState("Crear promoción");
    const [promotions, setPromotions] = useState([])
    const [user, setUser] = useState({})
    const [promotion, setpromotion] = useState({})
    const [prodInfo, setProdInfo] = useState({
      titulo: "",
      descripcion: "",
      condiciones: "",
      peso: 0,
      pesoUnidad: "",
      precio: 0,
      cantidadProducto: 0,
      cantidad: 0,
      cupos: 0,
    })
    
    const [promoInfo, setPromoInfo] = useState({
      urlImagen: null,
      titulo: null,
      descripcion: null,
      condiciones: null,
      cupos: null,
      cantidad: null,
      peso: null,
      pesoUnidad: null,
      precio: null,
      delivery: null,
      domicilio: null,
    })

    const [typoPromoStatus, setTypoPromoStatus] = useState({
      servicio: true,
      producto: false,
      info: false,
    })

    const [file, setFile] = useState(null);
    const [update, setUpdate] = useState(false);
    const [url, setURL] = useState("");
    const [src, setImg] = useState('');
  
    const handleClick = event => {
      hiddenFileInput.current.click();
    };
  
    const handleOnClick = tp => {
      switch (tp) {
        case "Servicio":
          setTypoPromoStatus({...typoPromoStatus, servicio: true, producto: false, info: false})
          break;
        case "Producto":
          setTypoPromoStatus({...typoPromoStatus, producto: true, servicio: false, info: false})
          break;
        case "Información":
          setTypoPromoStatus({...typoPromoStatus, info: true, servicio: false, producto: false})
          break;
      
        default:
          break;
      }
    };

    function handleChange(e) {
      setImg(URL.createObjectURL(e.target.files[0]));    
      setFile(e.target.files[0]);
    }

    const getPromotions = async(id) =>{
      let tipos = [];
      await firebase.db.collection('Promociones').where("aliadoId", "==", id)
      .get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.data())
        })
        setPromotions(tipos)
      })
    }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)  
          getPromotions(val.aliadoId)
        });
    }, [])

    return (
        <div className="main-content-container container-fluid px-4">

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters py-2 px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="col">
                    <p className="page-title">Promociones</p>
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
                    <div className="row">
                            {
                                promotions.length > 0 ? promotions.map(promotion=>{
                                return(
                                  <div className="col-md-6 col-sm-12">
                                    <div  onClick={() => setpromotion(promotion)} key={promotion.promotionId}  className="card card-small card-post mb-4">
                                      <div className="card-post__image" style={{backgroundImage: `url(${promotion.urlImagen})` }}></div>
                                      <div className="card-body">
                                        <h5 className="card-title">
                                          <p className="text-fiord-blue mb-2">{promotion.titulo}</p>
                                        </h5>
                                        <p className="card-text-type mb-2">{promotion.categoria}</p>
                                        <p className="card-text mb-2">{promotion.descripcion}</p>
                                        {promotion.precio != null ?
                                          <p className="card-text-price">S/{promotion.precio}</p> 
                                        : <div></div>}
                                      </div>
                                    </div>
                                  </div>
                                )
                            }) : <div className="text-center"><p>No hay promociones</p></div>
                        }

                    </div>
                </div>
                <div className="col-lg-5 col-md-5 col-sm-12">
                    { promotion.titulo != null && !update ? <div className="card">
                      <div className="card-header-img-width">
                        <img src={promotion.urlImagen} alt=""/>
                      </div>
                      <div onClick={()=>setpromotion({})} className="card-close-btn">
                        <span>X</span>
                      </div>
                      <div className="px-4">
                        <div className="card-claim-box">
                          <p className="card-claim-title">{promotion.categoria}</p>
                          <p className="card-claim-text">{promotion.titulo}</p>
                        </div>
                        {promotion.precio != null ? <div className="card-claim-box">
                          <p className="card-claim-title">Precio de la promoción</p>
                          <p className="card-claim-text">S/{promotion.precio}</p>
                        </div> : <div></div>}
                        <div className="card-claim-box">
                          <p className="card-claim-title">Descripción de la promoción</p>
                          <p className="card-claim-text">{promotion.descripcion}</p>
                        </div>
                        <div className="card-claim-box">
                          <p className="card-claim-title">Condiciones de la promoción</p>
                          <p className="card-claim-text">{promotion.condiciones}</p>
                        </div>
                      </div>

                      <div className="card-footer">
                        <div className="row">
                          <div className="col-md-6 col-sm-12">
                            <button onClick={deletePromotion} className="btn btn-danger">Eliminar promoción</button>
                          </div>
                          <div className="col-md-6 col-sm-12">
                            <button onClick={()=>{setUpdate(true); }} className="btn btn-primary">Editar promoción</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    : update ? 
                    <form onSubmit={e => e.preventDefault() && false }>
                      <div className="card">
                        <div className="card-header text-center">
                          <h4>Actualizar promoción</h4>
                        </div>
                        <div onClick={()=>{ setUpdate(false); setpromotion({});} } className="card-close-btn">
                          <span>X</span>
                        </div>
                        <div className="px-4">

                          <input type="file"
                            ref={hiddenFileInput}
                            onChange={handleChange} 
                            style={{display: 'none'}}
                          />
                          <div onClick={handleClick} className="card-update-product-img-fwidth">
                            {src !== "" ? <img src={src} alt="" /> : <img src={promotion.urlImagen} alt="" />}
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPromoInfo({...promoInfo, titulo: e.target.value})}} placeholder={promotion.titulo} className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPromoInfo({...promoInfo, descripcion: e.target.value})}} placeholder={promotion.descripcion} className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setPromoInfo({...promoInfo, condiciones: e.target.value})}} placeholder={promotion.condiciones} className="form-control"/>
                          </div>
                          <div className={`${ promotion.tipoPromocion === "Servicio" || promotion.tipoPromocion === "Información" ? "d-none" : "" } form-row justify-content-spacebetween`}>
                            <div className="form-group">
                              <input type="text" onChange={(e)=>{setPromoInfo({...promoInfo, pesoUnidad: e.target.value})}} placeholder="Unidad del producto" className="form-control"/>
                            </div>
                            <div className="form-group">
                              <input type="text" onChange={(e)=>{setPromoInfo({...promoInfo, peso: e.target.value})}} placeholder="Peso del producto" className="form-control"/>
                            </div>
                          </div>
                          <div className={`${ promotion.tipoPromocion === "Información" ? "d-none" : "" } form-group`}>
                            <input type="text" onChange={(e)=>{setPromoInfo({...promoInfo, precio: e.target.value})}} placeholder={promotion.precio} className="form-control"/>
                          </div>
                          <div className={`${ promotion.tipoPromocion === "Información" || promotion.tipoPromocion === "Servicio"  ? "d-none" : "" } form-group`}>
                            <input type="text" onChange={(e)=>{setPromoInfo({...promoInfo, cantidad: e.target.value})}} placeholder={promotion.cantidad} className="form-control"/>
                          </div>
                          <div className={`${ promotion.tipoPromocion === "Información"  ? "d-none" : "" } form-group`}>
                            <input type="text" onChange={(e)=>{setPromoInfo({...promoInfo, cupos: e.target.value})}} placeholder={promotion.cupos} className="form-control"/>
                          </div>
                        </div>
                        <div className="card-footer">
                          <button onClick={()=>{saveUpdatePromo()}} className="btn btn-primary btn-block">Guardar promoción</button>
                        </div>
                      </div>
                    </form>
                    : <form onSubmit={e => e.preventDefault() && false }>
                      <div className="card">
                        <div className="card-header text-center">
                          <h4>Subir promoción</h4>
                        </div>
                        <div className="px-4">
                          <div className="px-3 row justify-content-spacebetween">
                            <div onClick={()=>{ handleOnClick("Servicio") }} className={`${ typoPromoStatus.servicio ? "typo-promo active" : "typo-promo" }`}>
                              <p className="mb-0">Servicio</p>
                            </div>
                            <div onClick={()=>{ handleOnClick("Producto") }} className={`${ typoPromoStatus.producto ? "typo-promo active" : "typo-promo" }`}>
                              <p className="mb-0">Producto</p>
                            </div>
                            <div onClick={()=>{ handleOnClick("Información") }} className={`${ typoPromoStatus.info ? "typo-promo active" : "typo-promo" }`}>
                              <p className="mb-0">Información</p>
                            </div>
                            
                          </div>

                          <input type="file"
                            ref={hiddenFileInput}
                            onChange={handleChange} 
                            style={{display: 'none'}}
                          />
                          <div onClick={handleClick} className="card-update-product-img-fwidth">
                            {src !== "" ? <img src={src} alt="" /> : <div className="card-header-img-upload"><p className="material-icons icon">add</p><p className="mb-0">Cargar imagen</p></div>}
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setProdInfo({...prodInfo, titulo: e.target.value})}} placeholder="Nombre de la promoción" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setProdInfo({...prodInfo, descripcion: e.target.value})}} placeholder="Descripción de la promoción" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setProdInfo({...prodInfo, condiciones: e.target.value})}} placeholder="Condiciones de la promoción" className="form-control"/>
                          </div>
                          <div className={`${ typoPromoStatus.servicio || typoPromoStatus.info ? "d-none" : "" } form-row justify-content-spacebetween`}>
                            <div className="form-group">
                              <input type="text" onChange={(e)=>{setProdInfo({...prodInfo, pesoUnidad: e.target.value})}} placeholder="Unidad del producto" className="form-control"/>
                            </div>
                            <div className="form-group">
                              <input type="text" onChange={(e)=>{setProdInfo({...prodInfo, peso: e.target.value})}} placeholder="Peso del producto" className="form-control"/>
                            </div>
                          </div>
                          <div className={`${ typoPromoStatus.info ? "d-none" : "" } form-group`}>
                            <input type="text" onChange={(e)=>{setProdInfo({...prodInfo, precio: e.target.value})}} placeholder="Precio de la promoción" className="form-control"/>
                          </div>
                          <div className={`${ typoPromoStatus.info || typoPromoStatus.servicio  ? "d-none" : "" } form-group`}>
                            <input type="text" onChange={(e)=>{setProdInfo({...prodInfo, cantidad: e.target.value})}} placeholder="Cantidad del producto" className="form-control"/>
                          </div>
                          <div className={`${ typoPromoStatus.info  ? "d-none" : "" } form-group`}>
                            <input type="text" onChange={(e)=>{setProdInfo({...prodInfo, cupos: e.target.value})}} placeholder="Cupos de la promoción" className="form-control"/>
                          </div>
                        </div>
                        <div className="card-footer">
                          <button onClick={()=>{uploadPromotion()}} className="btn btn-primary btn-block">{btnMessage}</button>
                        </div>
                      </div>
                    </form>}
                </div>
            </div>

          </div>
    )

    async function uploadPromotion() {
      setBtnMessage("Subiendo...")
      let id = await firebase.db.collection("Promociones").doc().id;
      try {
        await firebase.storage.ref(`/Promociones imagenes/${file.name}`).put(file)
        firebase.storage.ref("Promociones imagenes").child(file.name).getDownloadURL().then((url) => {
          firebase.db.collection("Promociones").doc(id).set({
            tipoPromocion: typoPromoStatus.servicio ? "Servicio" : typoPromoStatus.info ? "Información" : "Producto",
            aliadoId: user.aliadoId,
            promoId: id,
            urlImagen: url,
            titulo: prodInfo.titulo,
            descripcion: prodInfo.descripcion,
            condiciones: prodInfo.condiciones,
            cupos: typoPromoStatus.info ? null : parseInt(prodInfo.cupos),
            cantidad: typoPromoStatus.producto ? parseInt(prodInfo.cantidadProducto) : null,
            peso: typoPromoStatus.producto ? prodInfo.pesoUnidad + " " + prodInfo.peso  : null,
            precio: typoPromoStatus.info ? null : parseInt(prodInfo.precio),
            activo: true,
            agendaContiene: typoPromoStatus.servicio ? false : null,
            delivery: null,
            domicilio: null,
            createdOn: moment().toDate(),
          })
          if(typoPromoStatus.servicio){
            history.push({
              pathname: "/promotions/agenda",
              state: { promoId: id}
            })
          }else{
            // console.log("No es un servicio")
            window.location.href = "/promotions"
          }
        })
        
      } catch(error) {
        alert(error.message)
      }
    }
      
    async function deletePromotion(){
      try{
        await firebase.db.collection('Promociones').doc(promotion.promoId).delete()
        window.location.href = "/promotions"
      }catch(e){
        console.log("Error: " + e);
      }
    }

    async function saveUpdatePromo(){
      if(file){
        await firebase.storage.ref(`/Promociones imagenes/${file.name}`).put(file)
        firebase.storage.ref("Promociones imagenes").child(file.name).getDownloadURL().then((url) => {
          firebase.db.collection("Promociones").doc(promotion.promoId).update({
            urlImagen: url,
            titulo: promoInfo.titulo ?? promotion.titulo,
            descripcion: promoInfo.descripcion ?? promotion.descripcion,
            condiciones: promoInfo.condiciones ?? promotion.condiciones,
            cupos: promoInfo.cupos ?? promotion.cupos,
            precio:  promoInfo.precio !== null ? parseInt(promoInfo.precio) : promotion.precio,
            delivery: promoInfo.delivery !== null ? parseInt(promoInfo.delivery) : promotion.delivery,
            domicilio: promoInfo.domicilio !== null ? parseInt(promoInfo.domicilio) : promotion.domicilio,
          })
        })
      }else{
        await firebase.db.collection("Promociones").doc(promotion.promoId).update({
          titulo: promoInfo.titulo ?? promotion.titulo,
          descripcion: promoInfo.descripcion ?? promotion.descripcion,
          condiciones: promoInfo.condiciones ?? promotion.condiciones,
          cupos: promoInfo.cupos ?? promotion.cupos,
          precio:  promoInfo.precio !== null ? parseInt(promoInfo.precio) : promotion.precio,
          delivery: promoInfo.delivery !== null ? parseInt(promoInfo.delivery) : promotion.delivery,
          domicilio: promoInfo.domicilio !== null ? parseInt(promoInfo.domicilio) : promotion.domicilio,
        })
      }
    }

}

export default Promotions
