import moment from 'moment'
import React, {useState, useEffect, useRef} from 'react'
import firebase from '../firebase/config'

function Messages() {

  const [user, setUser] = useState({})
  const [selectedChat, setSelectedChat] = useState({})
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState(null)
 
  const dummy = useRef();
  const scrollToBottom = () => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
 
  async function getChats(aliadoId){

    let tipos = []

    await firebase.db.collection("Chats").where("aliadoId", "==", aliadoId).get().then((val)=>{
      val.docs.forEach((doc)=>{
        tipos.push(doc.data())
      })
    })
    setDueñosInfo(tipos)
    
  }
  
  async function setDueñosInfo(list){
    
    await Promise.all(list.map(async (d) => {
      let nombre
      let url
      let lastMessage
      let lastMessageHour
      await firebase.db.collection("Dueños").doc(d.uid).get().then(val=>{
        nombre = val.data().nombre
        url = val.data().url
      })
      await firebase.db.collection("Chats").doc(d.chatId).collection("Mensajes").orderBy("createdOn").get().then(val=>{
        lastMessage = val.docs[val.docs.length - 1].data().message
        lastMessageHour = moment(val.docs[val.docs.length - 1].data().createdOn.toDate()).format("LT")
      })
      d["nombre"] = nombre
      d["url"] = url
      d["lastMessage"] = lastMessage
      d["lastMessageHour"] = lastMessageHour
    }))
    setChats(list)
    // console.log(list)
  }

  async function getMessages(chatId){
    let tipos = []
    await firebase.db.collection("Chats").doc(chatId).collection("Mensajes").orderBy("createdOn").get().then(val=>{
      val.docs.forEach((doc)=>{
        tipos.push(doc.data())
      })
    })
    setMessages(tipos)
    // console.log(list)
  }

  useEffect(() => {
    firebase.getCurrentUser().then((val)=>{
      setUser(val)
      getChats(val.aliadoId)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

    return (
        <div className="main-content-container container-fluid px-4">

          <div className="page-header align-items-center justify-content-spacebetween row no-gutters px-4 my-4">
            <div className="col-12 col-sm-5 text-center text-sm-left mb-0">
              <div className="row align-items-center">
                <div className="col">
                  <p className="page-title">Mensajes</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-1 mb-0">
              <div className="row align-items-center justify-content-space-around">
                <i className="material-icons color-white display-5">help_outline</i>
              </div>
            </div>
          </div>
            
          <div className="row no-gutters">
            <div className="col-lg-4 h-70vh">
              <div className="h-70vh overflow-y">
                {chats.lenght > 0 ? chats.map(chat => {
                  return (
                    <div key={chat.chatId} onClick={()=>{getMessages(chat.chatId); setSelectedChat(chat)}}  className={selectedChat === chat ? "chats-container active  px-2" : "chats-container  px-2"}>
                      <div className="">
                        <div className="chats-container-img">
                          <img src={chat.url} alt=""/>
                        </div>
                      </div>
                      <div className="chats-container-text">
                        <p className="chats-container-name">{chat.nombre}</p>
                        <p className="chats-container-msg">{chat.lastMessage}</p>
                      </div>
                      <div className="chats-container-additional">
                        <p className="chats-container-hour">{chat.lastMessageHour}</p>
                      </div>
                    </div>
                  )
                }) : <p className="text-center">No tienes chats en este momento</p>}
              </div>
            </div>
            <div className={selectedChat.chatId ? "col-lg-8 h-70vh bg-white border" : "col-lg-8 h-70vh bg-white border"}>
              <div className="h-70vh">
                {selectedChat.chatId ? <div className="chat-header">
                  <div className="row no-gutters p-2">
                    <div className="chats-container-img">
                      <img src={selectedChat.url} alt=""/>
                    </div>
                    <p className="chats-container-name mb-0">{selectedChat.nombre}</p>
                  </div>
                </div> : <div></div>}
                {/* <div className="full-height-margin"></div> */}
                <div className="chat-flow">
                  { selectedChat.chatId ? 
                  messages.map(message => {
                    return (
                      <div key={message.createdOn}  className={message.aliadoId ? "message-container-me mr-3" : "message-container-other ml-3"} >
                        <p className="mb-0" >{message.message}</p>
                      </div>
                    )
                  })
                  : <div></div> }
                  <span ref={dummy}></span>
                </div>
                {/* <div className="full-height-margin"></div> */}
                {selectedChat.chatId ? <div className="chat-form">
                  <div className="row no-gutters">
                    <input placeholder="Escribe un mensaje" onChange={((e)=>{setMessage(e.target.value)})} type="text" className="chat-input-message"/>
                    <i onClick={()=>{sendMessage()}} className="mb-0 btn btn-primary material-icons ml-2">Enviar</i>
                  </div>
                </div> : <div></div>}
              </div>
            </div>
          </div>

          </div>
    )

    async function sendMessage(){
      try{
        let id = firebase.db.collection("Chats").doc(selectedChat.chatId).collection("Mensajes").doc().id
        await firebase.db.collection("Chats").doc(selectedChat.chatId).collection("Mensajes").doc(id).set({
          messageId: id,
          aliadoId: user.aliadoId,
          uid: null,
          message: message,
          createdOn: moment().toDate(),
        })
        getMessages(selectedChat.chatId)
        dummy.current.scrollIntoView({ behavior: 'smooth' });
      }catch(e){
        console.log(e)
      }
    }
    
}


export default Messages
