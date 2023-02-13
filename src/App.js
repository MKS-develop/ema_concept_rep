import React, {useState, useEffect} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './pages/Home';
import Employes from './pages/Employes/Employes';
import CreateRole from './pages/Employes/CreateRole';
import AddServicesRoles from './pages/Employes/AddServices';
import CreateUser from './pages/Employes/CreateUser';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Agenda from './pages/Agenda';
import Configuration from './pages/Configuration';
import Specialitys from './pages/Specialitys';
import Localitys from './pages/Localitys/Localitys';
import AddServices from './pages/Localitys/AddServices';
import Resume from './pages/Resume/Resume';
import Orders from './pages/Orders/Orders';
import Order from './pages/Orders/Order';
import Clients from './pages/Clients/Clients';
import Client from './pages/Clients/Client';
import CreateClient from './pages/Clients/CreateClient';
import History from './pages/Atention/History';
import Messages from './pages/Messages';
import Prueba from './pages/Pruebas';
import Prueba2 from './pages/Pruebas2';
import Claims from './pages/Claims';
import Refereds from './pages/Refereds';
import Plan from './pages/Plan';
import Register from './pages/Register';
import DoctorSignUp from './pages/DoctorSignUp';
import Login from './pages/Login';
import firebase from './firebase/config'
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './firebase/auth';
import Profile from './pages/User/Profile';
import PetPoints from './pages/User/PetPoints';
import DataBank from './pages/User/DataBank';

//import Products from './pages/Products/Products';
import UploadProduct from './pages/Products/UploadProduct';
import NewProducts from './pages/Products/NewProducts';
import DetailProduct from './pages/Products/DetailProduct';

import UploadService from './pages/Services/UploadService';
import NewServices from './pages/Services/NewServices';
import DetailService from './pages/Services/DetailService';
import AgendaServiceCreation from './pages/Services/AgendaServiceCreation';

import Communities from './pages/Communities/Communities';
import Events from './pages/Events/Events';
import DetailEvent from './pages/Events/DetailEvent';
import ImportOrders from './pages/Orders/ImportOrders';
import TreatmentExport from './pages/Treatment/Treatment';

function App() {

  const url = window.location.href;
  const user = firebase.isLogged();
  
  const [firebaseInitialized, setFirebaseInitialized] = useState(false)
  
	useEffect(() => {
    firebase.isInitialized().then(val => {
      setFirebaseInitialized(val)
		})
	}, [])

  return firebaseInitialized !== false ? (
    <AuthProvider>
      <Router>
        <div className="container-fluid">
          <div className="row">
          {url.includes("/login") || url.includes("/register") || !user ? <div></div> : <Sidebar/>}
            <main className={url.includes("/login") || url.includes("/register") || !user ? "main-content col-12" : "main-content col-lg-10 col-md-9 col-sm-12 p-0 offset-lg-2 offset-md-3"}>
              {url.includes("/login") || url.includes("/register") || !user ? <div></div> : <Navbar/>}
              <Switch>
                <Route path="/login" exact component={Login}/>
                <Route path="/register" exact component={Register}/>
                <PrivateRoute exact path="/register/doctor_register" component={DoctorSignUp} />
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute exact path="/profile" component={Profile} />
                <PrivateRoute exact path="/bank" component={DataBank} />
                <PrivateRoute exact path="/pruebas" component={Prueba} />
                <PrivateRoute exact path="/pruebas2" component={Prueba2} />
                <PrivateRoute exact path="/petpoints" component={PetPoints} />
                <PrivateRoute exact path="/employes" component={Employes} />
                <PrivateRoute exact path="/create-user" component={CreateUser} />
                <PrivateRoute exact path="/create-role" component={CreateRole} />
                <PrivateRoute exact path="/create-role/addservices" component={AddServicesRoles} />
                <PrivateRoute path="/agenda" exact component={Agenda}/>
                <PrivateRoute path="/configuration" exact component={Configuration}/>
                <PrivateRoute path="/orders" exact component={Orders}/>
                <PrivateRoute path="/orders/order" exact component={Order}/>
                <PrivateRoute path="/orders/import-orders" exact component={ImportOrders}/>
                <PrivateRoute path="/clients" exact component={Clients}/>
                <PrivateRoute path="/clients/create-client" exact component={CreateClient}/>
                <PrivateRoute path="/client/proceedings" exact component={History}/>
                <PrivateRoute path="/clients/client" exact component={Client}/>
                <PrivateRoute path="/export-treatments" exact component={TreatmentExport}/>

                <PrivateRoute path="/configuration/services/new-service" exact component={UploadService}/>
                <PrivateRoute path="/configuration/services" exact component={NewServices}/>
                <PrivateRoute path="/configuration/services/detail" exact component={DetailService}/>
                <PrivateRoute path="/configuration/services/agenda" exact component={AgendaServiceCreation}/>

                <PrivateRoute path="/configuration/localitys" exact component={Localitys}/>
                <PrivateRoute path="/configuration/localitys/addservices" exact component={AddServices}/>
                
                <PrivateRoute path="/configuration/products/detail" exact component={DetailProduct}/>
                <PrivateRoute path="/configuration/products/new-product" exact component={UploadProduct}/>
                <PrivateRoute path="/configuration/products" exact component={NewProducts}/>

                <PrivateRoute path="/configuration/specialitys" exact component={Specialitys}/>
                <PrivateRoute path="/resume" exact component={Resume}/>
                
                <PrivateRoute path="/messages" exact component={Messages}/>
                <PrivateRoute path="/claims" exact component={Claims}/>
                <PrivateRoute path="/refereds" exact component={Refereds}/>
                <PrivateRoute path="/plans" exact component={Plan}/>

                <PrivateRoute path="/communities" exact component={Communities}/>

                <PrivateRoute path="/events" exact component={Events}/>
                <PrivateRoute path="/events/detail" exact component={DetailEvent}/>

                <Route path='*' component={Page404} />
              </Switch>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  ) : <div className="p404">Cargando</div>
}

const Page404 = () => (
  <div className="p404">
      <h1><b>No existe esa página</b></h1>
      <p className="lead">Parece que la página que estás tratando de buscar no existe.</p>
      <a href="/">Volver al Inicio</a>
  </div>
)

export default App;