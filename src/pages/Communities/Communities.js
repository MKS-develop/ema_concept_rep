import React, {useState, useEffect, useRef} from 'react'
import firebase from '../../firebase/config'
import {Link} from 'react-router-dom';
import moment from 'moment';
import { set } from 'date-fns';

function Communities() {

    const hiddenFileInput = useRef(null);
    const [file, setFile] = useState(null);
  
    const [error, setError] = useState(false) 
    const [success, setSuccess] = useState(false);
    const [editPostState, setEditPostState] = useState(false);
    const [postInView, setPostInView] = useState(false);
    const [groupInView, setGroupInView] = useState(false);
    const [feedInView, setFeedInView] = useState(true);
    const [createGroupInView, setCreateGroupInView] = useState(false);
    const [editGroupState, setEditGroupState] = useState(false);
    const [loadingGroupCreation, setLoadingGroupCreation] = useState(false);
    const [showGroupsInView, setShowGroupsInView] = useState(false);
    
    const [titleMiddle, setTitleMiddle] = useState("Tus publicaciones")
    const [emessage, setEmessage] = useState("")
    const [successMsg, setSuccessMsg] = useState("");
    const [url, setURL] = useState("");
    const [src, setImg] = useState('');
    const [wordTag, setWordTag] = useState('');

    const [user, setUser] = useState({})
    const [group, setGroup] = useState({
      title: "",
      description: "",
      tags: [],
      features: {
        breed: "",
        species: ""
      }
    })

    const [postDataInView, setPostDataInView] = useState({})

    const [post, setPost] = useState({
      content: "",
      title: "",
      type: "",
      communityGroupId: ""
    })

    const [postListMain, setPostListMain] = useState([])
    const [postList, setPostList] = useState([])
    const [listOfGroups, setListOfGroups] = useState([])

    let listCategories = [
      "Mastografía",
      "Salud",
      "Cuidados",
      "Consejos",
    ]

    const [petSpecies, setPetSpecies] = useState([])
    const [petBreed, setPetBreed] = useState([])

    const handleClick = event => {
      hiddenFileInput.current.click();
    };

    function handleChange(e) {
      setImg(URL.createObjectURL(e.target.files[0]));    
      setFile(e.target.files[0]);
    }

    function checkInputs(object){
      let val = 0
      let array = []
      Object.keys(object).forEach(function(key) {
        if ( file === null || object[key] === '' || object[key] === null) {
          val++
          array.push(key)
        }
      });
      if(val > 0){
        setError(true)
        setEmessage("Todos los campos son requeridos")
        setTimeout(() => {
          setError(false)
        }, 4000);
        // setBtnMessage("Crear contenido")
      }else{
        if(createGroupInView){
          
          createGroupInCommunity()
        }else{
          uploadPostInDB()
        }
      }
      return val > 0 ? true : false
    }

    function viewDataInFeed(type, data){
      console.log(data)

      setFeedInView(false)
      setPostInView(false)
      setGroupInView(false)
      setShowGroupsInView(false)
      switch (type) {
        case "post":
          setTitleMiddle("Publicación")
          setPostDataInView(data)
          setPostInView(true)
          break;
        case "group":
          setPostList(postListMain.filter(prv => prv["communityGroupId"] === data["communityId"]))
          setTitleMiddle("Grupo")
          setGroup(data)
          setGroupInView(true)
          break;
        case "feed":
          setPostList(postListMain)
          setTitleMiddle("Feed")
          setFeedInView(true)
          break;
        default:
          break;
      }
    }

    async function manageTypePetSpecie(type){
      let list = []
      setGroup({...group, features: {...group["features"], species: type}})
      await firebase.db.collection("Especies").doc(type).collection("Razas").get().then((v)=>{
        v.docs.forEach(doc=>{
          list.push(doc.id)
          list.sort()
        })
        setPetBreed(list)
      })
    }
    
    function manageLikeInPost(post){
      let list = [...post["subjectsWhoLiked"]]
      if(list.includes(user.aliadoId)){
        list.filter((prv)=> prv !== user.aliadoId)
      }else{
        list.push(user.aliadoId)
      }

      post["subjectsWhoLiked"] = list
      
      setPost(post)
    }

    const SuccessComponent = ({msg}) => {
      return (
          <div className="success-alert">
              <span className="material-icons mr-2">done</span>
              {msg}
              <div onClick={()=>{setSuccess(false)}} className="material-icons ml-2 cursor-pointer">close</div>
          </div>
      )
    }

    const ErrorComponent = ({msg}) => {
      return (
          <div className="error-alert">
              <span className="material-icons mr-2">error</span>
              {msg}
              <div onClick={()=>{setError(false)}} className="material-icons ml-2 cursor-pointer">close</div>
          </div>
      )
    }
    
    const CreatePost = () => {
      return (
        <div className="communities-mid-container">
          <div className="communities-upload-input mt-4">
            <p className="communities-upload-input-label">Titulo *</p>
            <input defaultValue={post.title} onChange={ e => setPost({...post, title: e.target.value}) } type="text" placeholder='La mastografía' className="form-control"/>
          </div>
          <div className="communities-upload-input">
            <p className="communities-upload-input-label">Categoría</p>
            <select defaultValue={post.type} onChange={ e => setPost({...post, type: e.target.value}) } className="form-control">
              <option value="">Seleccionar</option>
              {listCategories.map( value => <option value={value}>{value}</option> )}
            </select>
          </div>
          
          <div className="communities-upload-input">
            <div className="position-relative">
              <div style={{textAlign: "center", width: "100%"}}>
                <p style={{fontSize: "13px", color: "#a3a6af"}} className="my-3">Dimensiones recomendadas (1000 x 800)</p>
              </div>
              <input type="file" ref={hiddenFileInput} onChange={handleChange}  style={{display: 'none'}} />
              <div onClick={handleClick} className={`creation-input-photo`}>
              {src !== "" ? <img src={src} alt="" /> : <div className={`creation-input-photo-inside`}><p className="material-icons icon mb-0">image</p></div>}
              </div>
            </div>
          </div>
          <div className="communities-upload-input">
            <p className="communities-upload-input-label">Descripción</p>
            <textarea defaultValue={post.content} onChange={ e => setPost({...post, content: e.target.value}) } type="text" placeholder='Descripción de la nueva publicación' className="form-control"></textarea>
          </div>
          <div className="communities-upload-bottom-button-container">
            <div onClick={()=>{ uploadPostInDB() }} className="btn btn-block btn-primary">Crear publicación</div>
          </div>
        </div>
      )
    }
    
    const PostCommentInput = () => {
      return (
        <div className="communities-general-comments-creation-section mb-2">
          <div className="communities-general-comments-user-img">
            <img src="https://firebasestorage.googleapis.com/v0/b/priority-pet.appspot.com/o/Aliados%20avatar%2F2021-03-01%2013%3A00%3A12.737350.jpg?alt=media&token=4a6aa02f-9994-4ef1-b2c8-471301c99c2a" />
          </div>

          <div className="communities-general-comments-input">
            <textarea placeholder="Escribe un comentario..." className="form-control"></textarea>
          </div>
          <span class="material-icons communities-general-comments-button">
            send
          </span>

        </div>
      )
    }
   
    const GroupView = () => {
      return (
        <div className={`communities-group-view`}>

          <div className="communities-general-overlay">
            <img src={group["urlImage"] ?? ""} />
            <div className="communities-general-overlay-info">
              <div className="communities-group-overlay-bottom">
                {/* <p className="communities-join-btn">Unirse</p> */}
                <p className="communities-group-members-container">
                  <p className="communities-group-members-title">Miembros:</p>
                  <p className="communities-group-members-number">{group["members"].length}</p>
                </p>
              </div>
            </div>
          </div>

          <div className="communities-group-info-container border-bottom pb-3">
            <p className="communities-general-title">{group["title"]}</p>
            {group["categorie"] && <p className="communities-general-category">{group["categorie"]}</p>}
            <div className="communities-post-card-crud-actions my-2">
              <div onClick={()=>{ deleteGroupInDB() }} className="btn-circular btn-circular-danger mr-3"><span className="material-icons">delete</span></div>
              <div onClick={()=>{ editGroup(group) }} className="btn-circular btn-circular-primary"><span className="material-icons">edit</span></div>
            </div>
            <p className="communities-general-desc">{group["description"]}</p>
          </div>
          
          <div className="communities-group-posts-container mt-3">
            <p className="communities-general-subtitle">Publicaciones</p>
            {postList.map((p, i) => <CommunitiesPostCard index={i} hasImage={p["img"] ? true : false } post={p} />)}
          </div>

        </div>
      )
    }
    
    const PostView = () => {
      let liked = postDataInView["subjectsWhoLiked"].includes(user.aliadoId)
      return (
        <div className={`communities-group-view`}>
          {postDataInView["media"].length > 0 && <div className="communities-general-overlay">
            <img src={postDataInView["media"][0]["url"]}/>
            <div className="communities-general-overlay-info">
              <div className="communities-group-overlay-bottom">
              </div>
            </div>
          </div>}

          <div className="communities-group-info-container">
            <p className="communities-general-title">{postDataInView["title"]}</p>
            { postDataInView["type"] !== "" && <p className="communities-general-category">{postDataInView["type"]}</p>}
            
            <div className="communities-post-card-crud-actions">
              <div onClick={()=>{ deletePostInDB() }} className="btn-circular btn-circular-danger mr-3"><span className="material-icons">delete</span></div>
              <div onClick={()=>{ editPost(postDataInView) }} className="btn-circular btn-circular-primary"><span className="material-icons">edit</span></div>
              {/* <div onClick={()=>{ deletePostInDB() }} className="btn btn-outline-danger mr-3">Eliminar</div>
              <div className="btn btn-outline-primary">Editar</div> */}
            </div>

            <div className="communities-post-card-footer">
              <div className="communities-post-card-footer-date-container">
                <p className="communities-post-card-footer-date">{moment(postDataInView["createdOn"].toDate()).fromNow()}</p>
              </div>
              <div className="communities-post-card-footer-interaction-container">
                
                <div className="communities-post-interaction-container">
                  <p className="communities-post-card-interaction-text">0</p>
                  <span className="communities-post-card-interaction-icon">
                    <i className="material-icons">comment</i>
                  </span>
                </div>
                <div className="communities-post-interaction-container">
                  <p className="communities-post-card-interaction-text">{postDataInView["subjectsWhoLiked"].length}</p>
                  <span onClick={()=>{ manageLikeInPost(postDataInView) }} className={`communities-post-card-interaction-icon ${liked && "liked"} cursor-pointer`}>
                    {/* <span className={`communities-post-card-interaction-icon ${liked && "liked"} cursor-pointer`}> */}
                    <i className="material-icons">{ liked ? "favorite" : "favorite_border"}</i>
                  </span>
                </div>
              </div>
            </div>

            <p className="communities-general-desc mt-2 pb-3 border-bottom">{postDataInView["content"]}</p>

            <div className="communities-general-comments-section mt-3">
              <p className="communities-general-subtitle">Comentarios</p>

              <PostCommentInput/>

              <div className="communities-general-empty-case">
                <div className="communities-general-empty-case-icon">
                  <i className="material-icons">question_answer</i>
                </div>
                <div className="communities-general-empty-case-p">No hay comentarios por aquí</div>
              </div>
              {/* {post?.comments.length === 0 ? 
              <div className="communities-general-empty-case">
                <div className="communities-general-empty-case-icon">
                  <i className="material-icons">question_answer</i>
                </div>
                <div className="communities-general-empty-case-p">No hay comentarios por aquí</div>
              </div>
              : post?.comments.map((c, i) => <p key={i}></p> )} */}

            </div>

          </div>

        </div>
      )
    }

    const CommunitiesGroupCard = ({g}) => {
      return (
        <div onClick={()=>{ viewDataInFeed("group", g) }} className={`communities-recomended-group-card cursor-pointer`}>
          <img src={g["urlImage"]} />

          <div className="communities-recomended-group-overlay-container">
            <p className="communities-recomended-group-card-title mb-2">{g["title"]}</p>
            <p style={{color: "white"}} className="communities-recomended-group-card-cat">{"Miembros: " + g["members"].length}</p>
          </div>

        </div>
      )
    }

    const CommunitiesRecomendedPostCard = ({hasImage, data}) => {
      return (
        <div onClick={()=>{ viewDataInFeed("post", data) }} className={`communities-recomended-post-card ${hasImage ? "with-img" : "without-img"}`}>
          <div className="communities-recomended-post-card-user-img">
            <img src="https://firebasestorage.googleapis.com/v0/b/priority-pet.appspot.com/o/Aliados%20avatar%2F2021-03-01%2013%3A00%3A12.737350.jpg?alt=media&token=4a6aa02f-9994-4ef1-b2c8-471301c99c2a" />
          </div>

          <div className="communities-recomended-post-card-text-container">
            <p className="communities-recomended-post-card-title">{data?.title}</p>
            <p className="communities-recomended-post-card-desc">{data?.content}</p>
          </div>

          {hasImage && 
            <div className="communities-recomended-post-card-img">
              <img src={data?.media[0]["url"]}/>
            </div>
          }
        </div>
      )
    }
    
    const CommunitiesPostCard = ({hasImage, post, index}) => {
      let liked = post["subjectsWhoLiked"].includes(user.aliadoId)
      return (
        <div className={`communities-post-card ${hasImage ? "with-img" : "without-img"}`}>
          <div onClick={()=>{ viewDataInFeed("post", post) }} className="communities-post-card-info-container">
            <div className="communities-post-card-user-img">
              <img src={user.avatar} />
            </div>

            <div className="communities-post-card-text-container">
              <p className="communities-post-card-title">{post["title"]}</p>
              {post["type"] !== "" && <p className="communities-post-card-cat">{post["type"]}</p>}
              <p className={`communities-post-card-desc  ${post["type"] === "" && "mt-2"}`}>{post["content"]}</p>
            
              {hasImage && <div className={`communities-post-card-img`}>
                <img src={post["media"][0]["url"]}/>
              </div> }

            </div>
          </div>

          
          <div className="communities-post-card-footer">
            <div className="communities-post-card-footer-date-container">
              <p className="communities-post-card-footer-date">{moment(post["createdOn"].toDate()).fromNow()}</p>
            </div>
            <div className="communities-post-card-footer-interaction-container">
              
              <div className="communities-post-interaction-container">
                <p className="communities-post-card-interaction-text">0</p>
                {/* <p className="communities-post-card-interaction-text">{post["comments"].length}</p> */}
                <span className="communities-post-card-interaction-icon">
                  <i className="material-icons">comment</i>
                </span>
              </div>

              <div className="communities-post-interaction-container">
                <p className="communities-post-card-interaction-text">{post["subjectsWhoLiked"].length}</p>
                <span onClick={()=>{ manageLikeInPost(post, index) }} className={`communities-post-card-interaction-icon ${liked && "liked"} cursor-pointer`}>
                {/* <span className={`communities-post-card-interaction-icon ${liked && "liked"} cursor-pointer`}> */}
                  <i className="material-icons">{ liked ? "favorite" : "favorite_border"}</i>
                </span>
              </div>

            </div>
          </div>

          

        </div>
      )
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter' && wordTag !== ""){
          setGroup({...group, tags: [...group["tags"], wordTag] })
          setWordTag("")
        }
    }

    function editPost(p){
      setEditPostState(!editPostState)
      setPost(p)
    }
    
    function editGroup(g){
      setCreateGroupInView(true)
      setEditGroupState(!editGroupState)
      setGroup(g)
    }

    async function getPostsFromUser(id){
      await firebase.db.collection("CommunityPosts").where("subjectId", "==", "A" + id).get().then((v)=>{
        setPostListMain(v.docs.map((doc) => doc.data() ))
        setPostList(v.docs.map((doc) => doc.data() ))
      })
    }

    const getPetsSpecies = async() =>{
      let tipos = [];
      await firebase.db.collection('Especies')
      .get().then(val => {
        val.docs.forEach(item=>{
          tipos.push(item.id)
          tipos.sort()
        })
        setPetSpecies(tipos)
      })
    }

    async function getUserCommunities(id){
      await firebase.db.collection("CommunityGroups").where("creatorId", "==", "A" + id).get().then((v)=>{
        setListOfGroups(v.docs.map((doc) => doc.data() ))
      })
    }

    useEffect(() => {
      firebase.getCurrentUser().then((val)=>{
        setUser(val)
        getPostsFromUser(val.aliadoId)
        getUserCommunities(val.aliadoId)
        getPetsSpecies()
      });
    }, [])

    return (
      <div className="main-content-container container-fluid px-4 bg-white">
          {success && <SuccessComponent msg={successMsg === "" ? "Publicación cargada exitosamente" : successMsg}/>}
          {error && <ErrorComponent msg={emessage === "" ? "Todos los campos son requeridos" : emessage}/>}
          <div className="communities-wrapper">
            <div className="communities-grid">
              {/* <div className="communities-col">
                <div className="communities-col-wrapper">
                  <div className="communities-top-container">
                    <p className="communities-top-container-title">Explorar</p>
                  </div>
                  <div className="communities-mid-container">
                    <div className="communities-search-input">
                      <input type="text" placeholder='Buscar...' className="form-control"/>
                    </div>
                    
                    <div className="communities-recomended-container">
                      <p className="communities-recomended-title">Recomendados</p>
                      <div className="communities-recommended-groups">
                        {listOfGroups.map(g => <CommunitiesGroupCard group={g}/> )}
                      </div>
                      <div className="communities-recomended-container-column mt-3">
                        {postList.map((p, i) => <CommunitiesRecomendedPostCard index={i} hasImage={p["img"] ? true : false } data={p} />)}
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="communities-col">
                <div className="communities-col-wrapper">
                  <div className="communities-top-container">
                    <p className="communities-top-container-title">Tu perfíl</p>
                  </div>
                  <div className="communities-mid-container">
                    
                    <div className="communities-additional-top-container">
                      <div className="communities-additional-top-profile-picture">
                        <img src={user.avatar} />
                      </div>
                      <p className="communities-additional-top-profile-name">{user.nombre}</p>
                      <p className="communities-additional-top-profile-email">{user.email}</p>
                    </div>
                    <div className="communities-minidashboard-row">
                      <div className="communities-minidashboard-card">
                        <p className="communities-minidashboard-card-number">0</p>
                        <p className="communities-minidashboard-card-title">Siguiendo</p>
                      </div>
                      {/* <div className="communities-minidashboard-card">
                        <p className="communities-minidashboard-card-number">0</p>
                        <p className="communities-minidashboard-card-title">Seguidores</p>
                      </div> */}
                      <div onClick={()=>{ setShowGroupsInView(false); setTitleMiddle("Feed"); setGroupInView(false); setPostInView(false); setFeedInView(true) }} className="communities-minidashboard-card cursor-pointer">
                        <p className="communities-minidashboard-card-number">{postListMain.length}</p>
                        <p className="communities-minidashboard-card-title">Publicaciones</p>
                      </div>
                      <div onClick={()=>{ setShowGroupsInView(true); setTitleMiddle("Grupos"); setGroupInView(false); setPostInView(false); setFeedInView(false) }} className="communities-minidashboard-card cursor-pointer">
                        <p className="communities-minidashboard-card-number">{listOfGroups.length}</p>
                        <p className="communities-minidashboard-card-title">Grupos creados</p>
                      </div>
                    </div>



                  </div>
                </div>
              </div>
              <div className="communities-col">
                <div className="communities-col-wrapper">
                  <div className="communities-top-container">
                    <p className="communities-top-container-title">
                      {titleMiddle}</p>
                      { groupInView && <span className="cursor-pointer" onClick={()=>{ 
                        setShowGroupsInView(true); 
                        setTitleMiddle("Grupos"); 
                        setGroupInView(false); 
                        setPostInView(false); 
                        setFeedInView(false)
                      }}>{"Volver atrás"}</span> }
                      { (!feedInView && !groupInView) && <span className="cursor-pointer" onClick={()=>{ 
                        viewDataInFeed("feed", {});
                        setEditPostState(false);
                        setShowGroupsInView(false);
                        setPost({
                          content: "",
                          title: "",
                          type: ""
                        });
                        setPostDataInView({})
                      }}>{"Volver atrás"}</span> }
                  </div>
                  <div className="communities-mid-container pt-4">
                    {/* {groupInView && <GroupView data={group}/>} */}

                    {(showGroupsInView && !feedInView) && listOfGroups.map(g => <CommunitiesGroupCard g={g}/> )}
                    {postInView && <PostView/>}
                    {groupInView && <GroupView/>}
                    {(feedInView && !showGroupsInView) && postList.map((p, i) => <CommunitiesPostCard index={i} hasImage={p["media"]?.length > 0 ? true : false } post={p} />)}
                  </div>
                </div>
              </div>
              {/* <div className="communities-col-md">
                <div className="communities-col-wrapper">
                  <div className="communities-top-container">
                    <p className="communities-top-container-title">Feed</p>
                  </div>
                  <div className="communities-mid-container row no-gutters">
                    {postList.map((p, i) => <CommunitiesPostCard index={i} hasImage={p["media"]?.length > 0 ? true : false } post={p} />)}
                    {postList.length === 0 && <p className="mt-5 text-center communities-general-empty-case-p">No hay posts</p>}
                  </div>
                </div>
              </div> */}
              <div className="communities-col">
                {createGroupInView ? <div className="communities-col-wrapper">
                  <div className="communities-top-container">
                    <p className="communities-top-container-title">
                      {editGroupState ? "Actualizar grupo" : "Crear grupo"}
                    </p>
                    <div onClick={()=>{ setCreateGroupInView(false) }} className="btn btn-outline-primary">
                      Crear post
                    </div>
                  </div>
                  <div className="communities-mid-container pb-5">

                    <div className="communities-upload-input mt-4">
                      <p className="communities-upload-input-label">Titulo *</p>
                      <input defaultValue={group.title} onChange={ e => setGroup({...group, title: e.target.value}) } type="text" placeholder='Paseadores' className="form-control"/>
                    </div>
                    <div className="communities-upload-input">
                      <p className="communities-upload-input-label">Tags</p>
                      <input value={wordTag} onKeyPress={handleKeyPress} onChange={ e => setWordTag(e.target.value) } type="text" placeholder="Diversión" className="form-control"/>
                    </div>
                    <div className="creation-input-group-words">
                      {group.tags.map(p => (
                        <p className="pill mb-0" key={p}>{p} <span className="cursor-pointer btn-delete" onClick={()=>{ setGroup({...group, tags: group["tags"].filter((word) => word !== p) }); }} >X</span></p>
                      ))}
                    </div>

                    <div className="communities-upload-input">
                      <div className="position-relative">
                        <div style={{textAlign: "center", width: "100%"}}>
                          <p style={{fontSize: "13px", color: "#a3a6af"}} className="my-3">Dimensiones recomendadas (1000 x 800)</p>
                        </div>
                        <input type="file" ref={hiddenFileInput} onChange={handleChange}  style={{display: 'none'}} />
                        <div onClick={handleClick} className={`creation-input-photo`}>
                          {editGroupState && group !== {} && 
                            ( src !== "" ? 
                              <img src={src} alt="" /> :
                              group["urlImage"] !== undefined ? 
                              <img src={group["urlImage"]} alt="" /> : 
                              <div className={`creation-input-photo-inside`}><p className="material-icons icon mb-0">image</p></div> 
                            )
                          }
                          {(!editGroupState && src !== "") ? <img src={src} alt="" /> : <div className={`creation-input-photo-inside`}><p className="material-icons icon mb-0">image</p></div>}
                        </div>
                      </div>
                    </div>
                    <div className="communities-upload-input">
                      <p className="communities-upload-input-label">Descripción</p>
                      <textarea defaultValue={group.description} onChange={ e => setGroup({...group, description: e.target.value}) } type="text" placeholder='Descripción del grupo' className="form-control"></textarea>
                    </div>
                    <div onClick={()=>{editGroupState ? editGroupInDB() : createGroupInCommunity() }} className="btn btn-block btn-primary">
                      {editGroupState ? "Actualizar grupo" : "Crear grupo"}
                    </div>

                  </div>
                </div> 
                : <div className="communities-col-wrapper">
                  <div className="communities-top-container">
                    <p className="communities-top-container-title">{editPostState ? "Actualizar post" : "Crear post"}</p>
                    <div onClick={()=>{ setCreateGroupInView(true) }} className="btn btn-outline-primary">
                      Crear grupo
                    </div>
                  </div>
                  <div className="communities-mid-container">

                    <div className="communities-upload-input mt-4">
                      <p className="communities-upload-input-label">Titulo *</p>
                      <input value={post.title} onChange={ e => setPost({...post, title: e.target.value}) } type="text" placeholder='Paseando a mi perro' className="form-control"/>
                    </div>
                    <div className="communities-upload-input">
                      <p className="communities-upload-input-label">Grupo</p>
                      <select value={post.communityGroupId} onChange={ e => setPost({...post, communityGroupId: e.target.value}) } className="form-control">
                        <option value="">Seleccionar</option>
                        {listOfGroups.map((g, i)=> <option key={i} value={g.communityId}>{g.title}</option> )}
                      </select>
                    </div>
                    <div className="communities-upload-input">
                      <p className="communities-upload-input-label">Categoría</p>
                      <select value={post.type} onChange={ e => setPost({...post, type: e.target.value}) } className="form-control">
                        <option value="">Seleccionar</option>
                        {listCategories.map( value => <option value={value}>{value}</option> )}
                      </select>
                    </div>

                    <div className="communities-upload-input">
                      <div className="position-relative">
                        <div style={{textAlign: "center", width: "100%"}}>
                          <p style={{fontSize: "13px", color: "#a3a6af"}} className="my-3">Dimensiones recomendadas (1000 x 800)</p>
                        </div>
                        <input type="file" ref={hiddenFileInput} onChange={handleChange}  style={{display: 'none'}} />
                        <div onClick={handleClick} className={`creation-input-photo`}>
                          {editPostState && postDataInView !== {} && 
                            ( src !== "" ? 
                              <img src={src} alt="" /> :
                              (post["media"] !== undefined && post["media"].length > 0) ? 
                              <img src={post["media"][0]["url"]} alt="" /> : 
                              <div className={`creation-input-photo-inside`}><p className="material-icons icon mb-0">image</p></div> 
                            )
                          }
                          {(!editPostState && src !== "") ? <img src={src} alt="" /> : <div className={`creation-input-photo-inside`}><p className="material-icons icon mb-0">image</p></div>}
                        </div>
                      </div>
                    </div>
                    <div className="communities-upload-input mb-4">
                      <p className="communities-upload-input-label">Descripción</p>
                      <textarea value={post.content} onChange={ e => setPost({...post, content: e.target.value}) } type="text" placeholder='Descripción de la nueva publicación' className="form-control"></textarea>
                    </div>
                    <div onClick={()=>{editPostState ? editPostInDB() : uploadPostInDB() }} className="btn btn-block btn-primary mb-4">{editPostState ? "Editar publicación" : "Crear publicación"}</div>


                  </div>
                </div>}
              </div>
              
            </div>
          </div>
          
      </div>
    )
  
  async function deletePostInDB(){
    
    await firebase.db.collection("CommunityPosts").doc(postDataInView["postId"]).delete().then((v)=>{
      setPostInView(false)
      setFeedInView(true)
      setPost({
        content: "",
        title: "",
        type: ""
      })
      getPostsFromUser(user.aliadoId)
    })
  }
  
  async function deleteGroupInDB(){
    postList.forEach(async(p, i)=>{
      await firebase.db.collection("CommunityPosts").doc(p["postId"]).delete()
    })
    await firebase.db.collection("CommunityGroups").doc(group["communityId"]).delete().then((v)=>{
      setGroupInView(false)
      setFeedInView(true)
      setGroup({
        title: "",
        description: "",
        tags: [],
        features: {
          breed: "",
          species: ""
        }
      })
      getPostsFromUser(user.aliadoId)
      getUserCommunities(user.aliadoId)
    })
  }

  async function editPostInDB(){

    if(file){
      await firebase.storage.ref(`/CommunityPosts Media/${file.name}`).put(file)
      firebase.storage.ref("CommunityPosts Media").child(file.name).getDownloadURL().then((url) => {
        post["media"] = [
          { index: "1",
            type: "photo",
            url
          }
        ]

        firebase.db.collection("CommunityPosts").doc(postDataInView["postId"]).update(post).then((v)=>{
          setFeedInView(true);
          setPostInView(false);
          setEditPostState(false);
          setPostDataInView({})
          setPost({
            content: "",
            title: "",
            type: ""
          })
          getPostsFromUser(user.aliadoId)
        })
      })
    }else{
      await firebase.db.collection("CommunityPosts").doc(postDataInView["postId"]).update(post).then((v)=>{
        setFeedInView(true);
        setPostInView(false);  
        setEditPostState(false);  
        setPostDataInView({})
          setPost({
            content: "",
            title: "",
            type: ""
          })
        getPostsFromUser(user.aliadoId)
      })
    }

  }

  async function uploadPostInDB(){
    let id = firebase.db.collection("CommunityPosts").doc().id

    let postDataObject = {
      ...post,
      belongToAGroup: post.communityGroupId === "" ? false : true,
      postId: id,
      createdOn: moment().toDate(),
      media: [],
      subjectId: "A" + user.aliadoId,
      country: user.pais,
      subjectsWhoLiked: [],
      subjectsWhoSaved: [],
      subjectsWhoLikedCount: 0,
      subjectsWhoSavedCount: 0,
      status: "approved"
    }

    if(file){
      await firebase.storage.ref(`/CommunityPosts Media/${file.name}`).put(file)
      firebase.storage.ref("CommunityPosts Media").child(file.name).getDownloadURL().then((url) => {
        postDataObject.media = [
          { index: 1,
            type: "photo",
            url
          }
        ]
        firebase.db.collection("CommunityPosts").doc(id).set(postDataObject).then((v)=>{
          getPostsFromUser(user.aliadoId)
        })
      })
    }else{
      await firebase.db.collection("CommunityPosts").doc(id).set(postDataObject).then((v)=>{
        getPostsFromUser(user.aliadoId)
      })
    }

    setSuccess(true)
    setFile(null)
    setImg("")
    setPost({
      content: "",
      title: "",
      type: "",
      communityGroupId: ""
    })

  }

  async function createGroupInCommunity(){
    
    setLoadingGroupCreation(true)
    let id = firebase.db.collection("CommunityGroups").doc().id
    let groupInFunction = {
      ...group,
      createdOn: moment().toDate(),
      communityId: id,
      urlImage: "",
      members: [],
      isPrivate: false,
      creatorId: "A" + user.aliadoId,
      status: "approved"
    }
    
    await firebase.storage.ref(`/CommunityGroups Media/${file.name}`).put(file)
    await firebase.storage.ref("CommunityGroups Media").child(file.name).getDownloadURL().then((url) => {
      
      groupInFunction["urlImage"] = url
      
      firebase.db.collection("CommunityGroups").doc(groupInFunction.communityId).set(groupInFunction).then((v)=>{
        setLoadingGroupCreation(false)
        getUserCommunities(user.aliadoId)
      }).catch((e)=>{
        console.log(e)
      })

    })

  }

  async function editGroupInDB(){

    if(file){
      await firebase.storage.ref(`/CommunityGroups Media/${file.name}`).put(file)
      firebase.storage.ref("CommunityGroups Media").child(file.name).getDownloadURL().then((url) => {
        group["urlImage"] =  url

        firebase.db.collection("CommunityGroups").doc(group["communityId"]).update(group)
      })
    }else{
      await firebase.db.collection("CommunityGroups").doc(group["communityId"]).update(group)
    }
    setFeedInView(true);
    setGroupInView(false);  
    setEditGroupState(false);
    setGroup({
      title: "",
      description: "",
      tags: [],
      features: {
        breed: "",
        species: ""
      }
    })
    getUserCommunities(user.aliadoId)
    
  }

}

export default Communities
