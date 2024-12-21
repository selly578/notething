import m from "mithril"
import { Home } from "./page/App"
import { Compose } from "./page/Compose"
import { Post } from "./page/Post"
import { Profile } from "./page/Profile"
import { Load } from "./page/Load"
import { Nav } from "./components/Nav"
import { setIdentity,getIdentity } from "./storage"

const API_URL = import.meta.env.VITE_API_URL

if(!getIdentity().id || !getIdentity().nickname){
    m.request({
        method: "GET",
        url: `${API_URL}profile/create`,
    }).then(function(data){
        setIdentity(data.id,data.nickname)
    });
}
console.log( typeof(getIdentity().id) )

const mountNode = document.querySelector("#app");

m.route(mountNode, "/",{
    "/": function(){
        return {
            view: function(){
                return m("",
                    m(Nav),
                    m(Home)
                )
            }
        }
    },
    "/post/:id": function(){
        return {
            view: function(vnode){
                return m("",
                    m(Nav, {key: "nav",post_page: true}),
                    m(Post,{key: vnode.attrs.id,id:vnode.attrs.id})
                )
                
            }
        }
    },
    "/write": function(){
        return {
            view: function(){
                return m(Compose)                
               
            }
        }
    },
    "/reply/:id": function(){
        return {
            view: function(vnode){
                return m(Compose,{key:vnode.attrs.id, id: vnode.attrs.id,is_reply:true })
                
            }
        }
    },
    "/quote/:id": function(){
        return {
            view: function(vnode){
                return m(Compose,{key:vnode.attrs.id,id: vnode.attrs.id,quote: true})
                
            }
        }
    },
    "/profile": function(){
        return {
            view: function(){
                return m("",
                    m(Nav),
                    m(Profile)
                )
           
            }
        }
    },
    "/search": function(){
        return {
            view: function(){ 
                return m("",
                    m(Nav),
                    m(Home,{search: true})
                )                
            }
        }
    },
    "/load": function(){
        return {
            view: function(){ 
                return m(Load)
            }
        }
    },
    
});
