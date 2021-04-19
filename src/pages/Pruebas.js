import { timePickerDefaultProps } from '@material-ui/pickers/constants/prop-types';
import moment from 'moment'
import 'moment/locale/es-mx';
import React, {useState, useEffect} from 'react'
import firebase from '../firebase/config'

function Prueba(){
  
  const [user, setUser] = useState({})
  const [objeto, setObjeto] = useState({})
  const [newCategorias, SetNewCategorias] = useState([])
  const [newCategoriasServicios, setNewCategoriasServicios] = useState([])
  const [categorias, SetCategorias] = useState([])
  const [field, setField] = useState("")
  const [value, setValue] = useState("")
  const [categoria, setCategoria] = useState(null)
  const [categoriasServicios, setCategoriasServicios] = useState([])


  // const [orders, setOrders] = useState([])
  // const [pageNumber, setPageNumber] = useState(1)
  // const [limit, setLimit] = useState(5)
  // const [pagesLength, setPagesLength] = useState([])
  // const [pagesNumbers, setPagesNumbers] = useState([])
  
  // const handleClick = (i) => {
    // setPageNumber(i)
    // getOrders(user.aliadoId)
  // }

  // const getOrders = async(id) => {
  //   let tipos = []
  //   let tipos2 = []
  //   let tipos3 = []
  //   await firebase.db.collection("Ordenes").where("aliadoId", "==", id).get().then((val)=>{
  //     val.docs.forEach((doc)=>{
  //       tipos.push(doc.data())
  //     })
      
  //     for(let i = 0; i < tipos.length; i++){
  //       tipos3.push(i)
  //     }

  //     setPagesLength(tipos3)
  //     console.log(tipos3 + " " + pagesLength)

  //     for(let i = (limit * pageNumber  ); i <= (limit * pageNumber);i++){
  //       tipos2.push(tipos[i])
  //     }
  //     setOrders(tipos2)
  //   })
  // }

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
    // try{
    //   await firebase.db.collection("Aliados").doc(user.aliadoId).collection("Roles").doc("rolName").set({
    //     nombreRol: "rolName"
    //   }).then((val)=>{
    //     for (let key in objeto) {
    //       firebase.db.collection("Aliados").doc(user.aliadoId).collection("Roles").doc("rolName").collection("Categorias").doc(key).set({
    //         categoriaId: key
    //       }).then((val2)=>{
    //         objeto[key].forEach((a)=>{
    //           firebase.db.collection("Aliados").doc(user.aliadoId).collection("Roles").doc("rolName").collection("Categorias").doc(key).collection("Servicios").doc(a).set({
    //             servicioId: a
    //           })
    //         })
    //       }) 
    //     }
    //   })
    //   alert("Listooo")
    // }catch(e){
    //   alert(e)
    // }
    
    // if(f !== undefined){
      // objeto[f] = [v]
      // console.log(objeto[f])
      objeto[f].push(v)
      console.log(objeto)
      // console.log(f + " " + v)
    // }

    // for (let key in objeto) {
      // console.log(key) 
      // objeto[key].forEach((a)=>{
        // console.log( key + " " + a)
      // })
    // }

  }

  const remove = (cat) => {
    SetNewCategorias(newCategorias.filter((cat1) => cat1 !== cat))
  }

    useEffect(() => {
        firebase.getCurrentUser().then((val)=>{
          setUser(val)
          // getOrders(val.aliadoId)
        });
        getCategories()
    }, [])

    return (
      <div className="main-content-container container-fluid px-4">
        {/* {orders.map((order) => {
          return (
            <p key={order.oid}>{order.oid}</p>
          )
        })}
        <div className="row">
          {pagesLength.map((page, i)=>{
            return (
              <div onClick={()=>{handleClick(i)}} className={`ml-2 btn ${ pageNumber === i ? "btn-primary" : "btn-outline-primary"} `} key={i}>{i + page} </div>
            )
          })}
        </div>
        {pageNumber} */}
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
          
          {/* <button onClick={()=>{
            addField()
          }}>Añadir</button> */}
        </div>
      </div>
    )

}

export default Prueba
