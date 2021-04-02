import React, {useState, useEffect} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Agenda from './pages/Agenda';
import Configuration from './pages/Configuration';
import Services from './pages/Services/Services';
import Specialitys from './pages/Specialitys';
import Promotions from './pages/Promotions/Promotions';
import Localitys from './pages/Localitys/Localitys';
import AddServices from './pages/Localitys/AddServices';
import Resume from './pages/Resume/Resume';
import Orders from './pages/Orders/Orders';
import Clients from './pages/Clients/Clients';
import Client from './pages/Orders/Client';
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
import Products from './pages/Products/Products';
import AgendaServiceCreation from './pages/Services/AgendaServiceCreation';
import AgendaPromoCreation from './pages/Promotions/AgendaPromoCreation';

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
                <PrivateRoute path="/orders" exact component={Orders}/>
                <PrivateRoute path="/agenda" exact component={Agenda}/>
                <PrivateRoute path="/configuration" exact component={Configuration}/>
                <PrivateRoute path="/orders" exact component={Orders}/>
                <PrivateRoute path="/clients" exact component={Clients}/>
                <PrivateRoute path="/orders/client" exact component={Client}/>
                <PrivateRoute path="/configuration/services" exact component={Services}/>
                <PrivateRoute path="/configuration/services/agenda" exact component={AgendaServiceCreation}/>
                <PrivateRoute path="/promotions/agenda" exact component={AgendaPromoCreation}/>
                <PrivateRoute path="/configuration/localitys" exact component={Localitys}/>
                <PrivateRoute path="/configuration/localitys/addservices" exact component={AddServices}/>
                <PrivateRoute path="/configuration/products" exact component={Products}/>
                <PrivateRoute path="/configuration/specialitys" exact component={Specialitys}/>
                <PrivateRoute path="/clients" exact component={Clients}/>
                <PrivateRoute path="/resume" exact component={Resume}/>
                <PrivateRoute path="/promotions" exact component={Promotions}/>
                <PrivateRoute path="/messages" exact component={Messages}/>
                <PrivateRoute path="/claims" exact component={Claims}/>
                <PrivateRoute path="/refereds" exact component={Refereds}/>
                <PrivateRoute path="/plans" exact component={Plan}/>
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
