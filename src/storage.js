function getIdentity(){ 
    var id = localStorage.getItem("id")
    var nickname = localStorage.getItem("nickname")
    
    return {
        id: id || null,
        nickname: nickname || null
    }
}

function setIdentity(id,nickname){
    localStorage.setItem("id",id)
    localStorage.setItem("nickname",nickname)
}

export  {getIdentity,setIdentity}