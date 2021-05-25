import React, {useState, useEffect} from 'react'
import Jitsi from 'react-jitsi'
import firebase from '../firebase/config'

function Prueba(){
  
  const [displayName, setDisplayName] = useState('')
  const [roomName, setRoomName] = useState('')
  const [password, setPassword] = useState('')
  const [onCall, setOnCall] = useState(false)
  const [user, setUser] = useState({})
  
  // const el1 = document.querySelector('#closePageExit22')

  const handleAPI = (JitsiMeetAPI) => {
    JitsiMeetAPI.executeCommand('toggleVideo')
  }

  useEffect(() => {
    firebase.getCurrentUser().then((val)=>{
      setUser(val)
    });
  }, [])

    return (
      <div className="main-content-container">
      { onCall
        ? (
          <Jitsi          
            containerStyle={{ width: '100%', height: '90vh' }}
            roomName={roomName}
            config={{ startAudioMuted: true, enableClosePage: false, enableWelcomePage: false }}
            interfaceConfig={{ filmStripOnly: false, SHOW_PROMOTIONAL_CLOSE_PAGE: false, SHOW_BRAND_WATERMARK: false, SHOW_POWERED_BY: false, SHOW_JITSI_WATERMARK: false }}
            displayName={user.nombre}
            password={password}
            loadingComponent={Loader}
            onAPILoad={handleAPI}
          />)
        : (
          <div className="container py-2">
            <h1>Entrar a una reunión</h1>
            <input type='text' placeholder='Nombre de la sala' value={roomName} onChange={e => setRoomName(e.target.value)} />
            <button onClick={() => setOnCall(true)}>Entrar</button>
          </div>
        )
      }
      </div>
    )

    
  }
  
const Loader = () => {
  return (
    <div></div>
  )
}

export default Prueba
