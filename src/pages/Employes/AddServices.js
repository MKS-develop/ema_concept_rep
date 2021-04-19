import {useLocation, useHistory} from 'react-router-dom';
import React, {useState, useEffect} from 'react'
import firebase from '../../firebase/config'

function AddServicesRoles(){

  let data = useLocation()
  let history = useHistory()
  const [user, setUser] = useState({})
  const [objeto, setObjeto] = useState({})
  const [newCategorias, SetNewCategorias] = useState([])
  const [newCategoriasServicios, setNewCategoriasServicios] = useState([])
  const [categorias, SetCategorias] = useState([])
  const [field, setField] = useState("")
  const [value, setValue] = useState("")
  const [categoria, setCategoria] = useState(null)
  const [categoriasServicios, setCategoriasServicios] = useState([])

  const getCategories = async() => {
    let tipos = []
    try{

      await firebase.db.collection("CategoriasServicios").get().then((val)=>{
        val.docs.forEach((doc)=>{
          tipos.push(doc.data())
        })
        SetCategorias(tipos)
      })
    }catch(e){
      console.log(e)
    }
  }
  
  const getCategoriesServices = async(cat) => {
    let tipos = []
    await firebase.db.collection("CategoriasServicios").doc(cat).collection("Servicios").get().then((val)=>{
      val.docs.forEach((doc)=>{
        tipos.push(doc.id)
      })
      setCategoriasServicios(tipos)
    })
  }

  const handleClick = (cat) => {
    getCategoriesServices(cat); 
    setCategoria(cat); 
    if(objeto.hasOwnProperty(cat)){
      console.log("Lo tiene")
    }else{
      objeto[cat] = []
    }
  }

  const handleClick2 = (cat) => {
    setCategoria(null);
    remove(cat); 
    delete objeto[cat]; 
    setCategoriasServicios([]);
  }

  const addField = async(f, v) => {
      objeto[f].push(v)
      console.log(objeto)

  }

  const remove = (cat) => {
    SetNewCategorias(newCategorias.filter((cat1) => cat1 !== cat))
  }

    useEffect(() => {
        if(data.state === undefined || data.state === null){
          window.location.href = "/employes"
        }
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
        });
        getCategories()
    }, [])

    return (
      <div className="main-content-container container-fluid px-4">
        <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
          <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
            <div className="row align-items-center">
              <div className="col">
                <p className="page-title">Añadir categorías y tipos de servicios al rol</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-1 mb-0">
            <div className="row align-items-center justify-content-space-around">
              <i className="material-icons color-white display-5">help_outline</i>
            </div>
          </div>
        </div>
        <div className="my-3 row align-items-center justify-content-spacebetween no-gutters">
          <p className="mb-0">Añade las categorías y servicios los cuales este rol tendrá disponible</p>
          <button className={`btn ${newCategorias.length > 0 ? "btn-primary" : "btn-disabled" }`} onClick={()=>{newCategorias.length > 0 ? uploadServices() : alert(data.state.roleId) }}>Continuar</button>
        </div>
        <div className="row my-4">
          <div className="col-lg-4">
            <p className="lead ">Categorías</p>
            {categorias.map((categoria)=>{
              return (
                <div  key={categoria.categoriaId} onClick={()=>{
                  newCategorias.includes(categoria.categoriaId) ? console.log("Lo contiene") : SetNewCategorias([...newCategorias, categoria.categoriaId]);
                }} className="cursor-pointer alert alert-light fadeIn">
                  <p className="mb-0">{categoria.categoriaId}</p>
                </div>
              )
            })}
          </div>
          <div className="col-lg-4">
            { newCategorias.length > 0 ? <p className="lead">Categorías seleccionadas: {newCategorias.length}</p> : <div></div>}
            {newCategorias.map((cat)=>{
              return (
                <div className="cursor-pointer alert alert-primary fadeInRight" key={cat}>
                  <div className="no-gutters row align-items-center justify-content-spacebetween">
                    <div className="col-lg-11 row no-gutters align-items-center">
                      <p className="mb-0 mr-3 fit-content btn-remove material-icons col-lg-1" onClick={()=>{ handleClick2(cat) }} >close</p>
                      <p onClick={()=>{ handleClick(cat) }}  className="mb-0 col-lg-9" >{cat}</p>
                    </div>
                    {categoria === cat ? <span className="mb-0 material-icons">
                      arrow_forward
                    </span> : <div></div>}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="col-lg-4">
            {categoriasServicios.length > 0 ? <p className="lead">Servicios seleccionados: {objeto[categoria].length}</p> : <div></div>}
            {categoriasServicios.length > 0 ? categoriasServicios.map((servicio)=>{
              return (
                <div onClick={()=>{
                    objeto[categoria].includes(servicio) ? objeto[categoria].splice(objeto[categoria].indexOf(servicio), 1) : objeto[categoria].push(servicio); handleClick(categoria);
                  }} className={`fadeInRight cursor-pointer alert ${objeto[categoria].includes(servicio) ? "alert-secondary" : "alert-light" }`}  key={servicio}>
                  <p  className="mb-0">{servicio}</p>
                </div>
              )
            }) : <div></div>}
          </div>
        </div>
      </div>
    )

    async function uploadServices(){
        try{
            for (let key in objeto) {
              await firebase.db.collection("Roles").doc(data.state.roleId).collection("CategoriasServicios").doc(key).set({
                categoriaId: key
              }).then((val2)=>{
                objeto[key].forEach((a)=>{
                  firebase.db.collection("Roles").doc(data.state.roleId).collection("CategoriasServicios").doc(key).collection("Servicios").doc(a).set({
                    servicioId: a
                  })
                })
              }) 
            }
            if(data.state.products){
                history.push({
                    state: {roleId: data.state.roleId},
                    pathname: "/create-role/addproducts"
                })
            }else{
                history.push({
                    pathname: "/employes"
                })
            }
        }catch(e){
            alert(e)
        }
        // window.location.href = "/employes"
    }

}

export default AddServicesRoles
