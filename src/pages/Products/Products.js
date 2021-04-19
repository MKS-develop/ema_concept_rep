import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'
import {Link} from 'react-router-dom';
import moment from 'moment';

function Products() {

    const hiddenFileInput = React.useRef(null);
    const [btnMessage, setBtnMessage] = useState("Subir producto");
    const [products, setProducts] = useState([])
    const [productsTypes, setProductsTypes] = useState([])
    const [update, setUpdate] = useState(false);
    const [species, setSpecies] = useState([])
    const razas = [
      "Todas las razas",
      "Adultos",
      "Pequeños"
    ]
    const valores = [
      "Unidad",
      "Gramo",
      "Kilo",
      "Mililitro",
      "Litro",
      "Cápsula"
    ]
    const [user, setUser] = useState({})
    const [product, setProduct] = useState({})
    const [prodInfo, setProdInfo] = useState({
      titulo: "",
      peso: "",
      pesoUnidad: "",
      precio: 0,
      descripcion: "",
      cantidad: 0,
      dirigido: "Valor",
      categoria: "",
      tipoMascota: "Valor",
    })
    const [prodUInfo, setProdUInfo] = useState({
      presentacion: null,
      titulo: null,
      descripcion: null,
      precio: null,
      peso: null,
      pesoUnidad: null,
      pesoValor: null,
      delivery: null,
      cantidad: null,
      categoria: null,
    })

    const [file, setFile] = useState(null);
    const [url, setURL] = useState("");
    const [src, setImg] = useState('');
  
    const handleClick = event => {
      hiddenFileInput.current.click();
    };

    function handleChange(e) {
      setImg(URL.createObjectURL(e.target.files[0]));    
      setFile(e.target.files[0]);
    }

    const getProducts = async(aliadoId) =>{
      let tipos = [];
      await firebase.db.collection('Productos').where("aliadoId", "==", aliadoId)
      .get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.data())
          tipos.sort()
        })
        setProducts(tipos)
      })
    }
    
    const getProductsTypes = async() =>{
      let tipos = [];
      await firebase.db.collection('tipoProductos')
      .get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.id)
          tipos.sort()
        })
        tipos.pop("Todas")
        setProductsTypes(tipos)
      })
    }
    
    const getPets = async() =>{
      let tipos = [];
      await firebase.db.collection('Especies')
      .get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.id)
          tipos.sort()
        })
        setSpecies(tipos)
      })
    }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          getProducts(val.aliadoId)
        });
        getProductsTypes()
        getPets()
    }, [])

    return (
        <div className="main-content-container container-fluid px-4">

            <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
              <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
                <div className="row align-items-center">
                  <div className="col">
                    <p className="page-title bold"><Link className="page-title light" to="/configuration">Configuración</Link> {'>'} Productos</p>
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
                                products.length > 0 ? products.map(product=>{
                                    return(
                                    <div className="col-md-6 col-sm-12">
                                        <div onClick={() => setProduct(product)} key={product.productId} className="card-product mb-4">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-5 col-sm-5">
                                                        <div className="card-img h-50">
                                                            <img src={product.urlImagen} alt={product.urlImagen}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-7 col-sm-7">
                                                        <div className="card-product-title">
                                                            <p className="card-text">{product.titulo}</p>
                                                        </div>
                                                        <p className="card-text-type">{product.tipoMascota}</p>
                                                        <p className="card-text-price">S/{product.precio}</p>
                                                    </div>
                                                </div>   
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : <div className="text-center"><p>No hay productos</p></div>
                        }

                    </div>
                </div>
                <div className="col-lg-5 col-md-5 col-sm-12">
                    { product.titulo != null  && !update ? 
                    <div className="card">
                      <div className="card-header-img">
                        <img src={product.urlImagen} alt=""/>
                      </div>
                      <div onClick={()=>setProduct({})} className="card-close-btn">
                        <span>X</span>
                      </div>
                      <div className="px-4">
                        <div className="card-claim-box">
                          <p className="card-claim-text">{product.titulo}</p>
                        </div>
                        {/* <div className="card-claim-box">
                          <p className="card-claim-title">Tipo de mascota</p>
                          <p className="card-claim-text">{product.tipoMascota}</p>
                        </div>
                        <div className="card-claim-box">
                          <p className="card-claim-title">Raza de mascota</p>
                          <p className="card-claim-text">{product.dirigido}</p>
                        </div> */}
                        <div className="card-claim-box">
                          <p className="card-claim-title">Precio del producto</p>
                          <p className="card-claim-text">S/{product.precio}</p>
                        </div>
                        <div className="card-claim-box">
                          <p className="card-claim-title">Cantidad del producto</p>
                          <p className="card-claim-text">{product.cantidad}</p>
                            </div>

                      </div>
                      <div className="card-footer">
                        <div className="row">
                          <div className="col-md-6 col-sm-12">
                            <button onClick={deleteProducto} className="btn btn-outline-danger">Eliminar producto</button>
                          </div>
                          <div className="col-md-6 col-sm-12">
                            <button onClick={()=>{setUpdate(true)}} className="btn btn-primary">Editar producto</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    : update ?
                    <form onSubmit={e => e.preventDefault() && false }>
                      <div className="card">
                        <div className="card-header text-center">
                          <h4>Actualizar producto</h4>
                        </div>
                        <div onClick={()=>{setProduct({}); setUpdate(false)}} className="card-close-btn">
                          <span>X</span>
                        </div>
                        <div className="px-4">

                          <input type="file"
                            ref={hiddenFileInput}
                            onChange={handleChange} 
                            style={{display: 'none'}}
                          />
                          <div onClick={handleClick} className="card-update-product-img">
                            {src !== "" ? <img src={src} alt="" /> : <img src={product.urlImagen} alt="" />}
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setProdUInfo({...prodUInfo, titulo: e.target.value})}} placeholder={product.titulo} className="form-control"/>
                          </div>
                          <div className="form-row justify-content-spacebetween">
                            <div className="form-group">
                              <input type="text" onChange={(e)=>{setProdUInfo({...prodUInfo, peso: e.target.value})}}  placeholder={product.pesoValor} className="form-control"/>
                            </div>
                            <div className="form-group">
                              <select className="form-control" value={prodUInfo.pesoUnidad} onChange={(e)=>{setProdUInfo({...prodUInfo, pesoUnidad: e.target.value})}}>
                                {valores.map(data => (
                                    <option key={data} value={data}>{data}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setProdUInfo({...prodUInfo, precio: e.target.value})}}  placeholder={product.precio} className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setProdUInfo({...prodUInfo, descripcion: e.target.value})}} placeholder={product.descripcion} className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setProdUInfo({...prodUInfo, cantidad: e.target.value})}} placeholder={product.cantidad} className="form-control"/>
                          </div>
                          <div className="form-group">
                            <select className="form-control" placeholder={product.categoria} value={prodUInfo.categoria} onChange={(e)=>{setProdUInfo({...prodUInfo, categoria: e.target.value})}}>
                              {productsTypes.map(data => (
                                  <option key={data} value={data}>{data}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="card-footer">
                          <button onClick={()=>{updateProduct()}} className="btn btn-primary btn-block">{btnMessage}</button>
                        </div>
                      </div>
                    </form>
                    :
                    <form onSubmit={e => e.preventDefault() && false }>
                      <div className="card">
                        <div className="card-header text-center">
                          <h4>Subir producto</h4>
                        </div>
                        <div className="px-4">
                          {/* <div className="form-group">
                            <select className="form-control" value={tipoproducto} onChange={e => setTipoproducto(e.target.value)}>
                              {tiposproductos.map(data => (
                                  <option key={data} value={data}>{data}</option>
                              ))}
                            </select>
                          </div> */}

                          <input type="file"
                            ref={hiddenFileInput}
                            onChange={handleChange} 
                            style={{display: 'none'}}
                          />
                          <div onClick={handleClick} className="card-update-product-img">
                            {src !== "" ? <img src={src} alt="" /> : <div className="card-header-img-upload"><p className="material-icons icon">add</p><p>Cargar imagen</p></div>}
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setProdInfo({...prodInfo, titulo: e.target.value})}} placeholder="Nombre del producto" className="form-control"/>
                          </div>
                          <div className="form-row justify-content-spacebetween">
                            <div className="form-group">
                              <input type="text" onChange={(e)=>{setProdInfo({...prodInfo, peso: e.target.value})}} placeholder="Peso del producto" className="form-control"/>
                            </div>
                            <div className="form-group">
                              <select className="form-control" value={prodInfo.pesoUnidad} onChange={(e)=>{setProdInfo({...prodInfo, pesoUnidad: e.target.value})}}>
                                {valores.map(data => (
                                    <option key={data} value={data}>{data}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setProdInfo({...prodInfo, precio: e.target.value})}} placeholder="Precio del producto" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setProdInfo({...prodInfo, descripcion: e.target.value})}} placeholder="Descripción del producto" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <input type="text" onChange={(e)=>{setProdInfo({...prodInfo, cantidad: e.target.value})}} placeholder="Cantidad del producto" className="form-control"/>
                          </div>
                          <div className="form-group">
                            <select className="form-control" value={prodInfo.categoria} onChange={(e)=>{setProdInfo({...prodInfo, categoria: e.target.value})}}>
                              {productsTypes.map(data => (
                                  <option key={data} value={data}>{data}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="card-footer">
                          <button onClick={()=>uploadProducto} className="btn btn-primary btn-block">{btnMessage}</button>
                        </div>
                      </div>
                    </form>
                    }
                </div>
            </div>

          </div>
    )

    async function uploadProducto() {
      setBtnMessage("Subiendo...")
      let id = firebase.db.collection("Productos").doc().id;
      try {
        await firebase.storage.ref(`/Productos imagenes/${file.name}`).put(file)
        firebase.storage.ref("Productos imagenes").child(file.name).getDownloadURL().then((url) => {
          firebase.db.collection("Productos").doc(id).set({
            aliadoId: user.aliadoId,
            productoId: id,
            urlImagen: url,
            presentacion: prodInfo.pesoUnidad + prodInfo.valor,
            titulo: prodInfo.titulo,
            descripcion: prodInfo.descripcion,
            precio: parseInt(prodInfo.precio),
            peso: prodInfo.pesoUnidad + " " + prodInfo.valor,
            pesoUnidad: prodInfo.valor,
            pesoValor: prodInfo.pesoUnidad,
            tipoMascota: prodInfo.mascota,
            delivery: null,
            dirigido: prodInfo.dirigido,
            cantidad: parseInt(prodInfo.cantidad),
            categoria: prodInfo.categoria,
            createdOn: moment().toDate(),
          })
        })
        window.location.href = "/configuration/products"
      } catch(error) {
        alert(error.message)
      }
    }
      
    async function updateProduct(){
      if(file){
        await firebase.storage.ref(`/Productos imagenes/${file.name}`).put(file)
        firebase.storage.ref("Productos imagenes").child(file.name).getDownloadURL().then((url) => {
          firebase.db.collection("Productos").doc(product.productoId).update({
            urlImagen: url,
            presentacion: prodInfo.pesoUnidad === null && prodInfo.valor === null ? product.pesoUnidad + " " + product.valor : prodUInfo.pesoUnidad + " " + prodUInfo.valor,
            titulo: prodUInfo.titulo ?? product.titulo,
            descripcion: prodUInfo.descripcion ?? product.descripcion,
            precio: prodUInfo.precio !== null ? parseInt(prodUInfo.precio) : product.precio,
            peso: prodInfo.pesoUnidad === null && prodInfo.valor === null ? product.pesoUnidad + " " + product.valor : prodUInfo.pesoUnidad + " " + prodUInfo.valor,
            pesoUnidad: prodUInfo.valor ?? product.pesoUnidad,
            pesoValor: prodUInfo.pesoUnidad ?? product.pesoValor,
            delivery: null,
            cantidad: prodUInfo.cantidad !== null ? parseInt(prodUInfo.cantidad) : product.cantidad,
            categoria: prodUInfo.categoria ?? product.categoria,
          })
        })
      }else{
        try {
          await firebase.db.collection("Productos").doc(product.productoId).update({
            categoria: prodUInfo.categoria ?? product.categoria,
            titulo: prodUInfo.titulo !== null ? prodUInfo.titulo : product.titulo,
            descripcion: prodUInfo.descripcion ?? product.descripcion,
            precio: prodUInfo.precio !== null ? parseInt(prodUInfo.precio) : product.precio,
            cantidad: prodUInfo.cantidad !== null ? parseInt(prodUInfo.cantidad) : product.cantidad,
            peso: prodInfo.pesoUnidad === null && prodInfo.valor === null ? product.pesoUnidad + " " + product.valor : prodUInfo.pesoUnidad + " " + prodUInfo.valor,
            pesoUnidad: prodUInfo.valor ?? product.pesoUnidad,
            pesoValor: prodUInfo.pesoUnidad ?? product.pesoValor,
            presentacion: prodInfo.pesoUnidad === null && prodInfo.valor === null ? product.pesoUnidad + " " + product.valor : prodUInfo.pesoUnidad + " " + prodUInfo.valor,
            delivery: null,
          })
          
        } catch (e) {
          alert(e.message)
        }

      }
    }
  
    async function deleteProducto(){
      try{
        await firebase.db.collection('Productos').doc(product.productId).delete()
        window.location.href = "/configuration/products"
      }catch(e){
        console.log("Error: " + e);
      }
    }

}

export default Products
