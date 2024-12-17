import m from "mithril"
import { getIdentity } from "../storage"

const API_URL = import.meta.env.VITE_API_URL
export const Compose = function(vnode){
    var content = ""
    var is_reply = vnode.attrs || null
    var post_id = null
    var reply_post = null
    
    console.log(is_reply)
    return {
        cancel: function(){
            m.route.set("/")
        },
        submit: function(e){
            e.preventDefault()
            if (is_reply != null) {
                post_id = is_reply.id
            }
            m.request({
                method: "POST",
                url: `${API_URL}/posts/compose`,
                body:{
                    content: content,
                    parent: post_id

                },
                headers: {
                  "Access-Control-Allow-Origin": true, 
                  "user-id": getIdentity().id,
                }               
            }).then(function(data){
                if (post_id) {
                    m.route.set(`/post/${post_id}`)
                
                }else{
                    m.route.set("/")
                }
            })
        },
        oninit: function(){
            if(is_reply != null){
                m.request({
                    method: "GET",
                    url: `${API_URL}posts/${is_reply.id}`,
                    headers: {
                      "user-id": getIdentity().id,
                    }               
                  }).then(function(data){
                    reply_post = data
                    
                }).catch(function(error){
                    is_reply = false
                })
            }
        },
        view: function(){
            return (
                <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                    <div class="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
                        {is_reply.id && (
                            <div class="text-gray-600 mb-4">
                                Replying to 
                                <m.route.Link 
                                    href={`/post/${is_reply.id}`} 
                                    class="text-blue-600 hover:underline ml-1"
                                >
                                    {is_reply.id}
                                </m.route.Link>
                            </div>
                        )}
                        <h1 class="text-2xl font-bold mb-4 text-gray-800">
                            {is_reply.id ? "Reply Post" : "Create a New Post"}
                        </h1>
                        <form method="post" class="space-y-4" onsubmit={this.submit}>
                            <textarea 
                                name="content" 
                                required 
                                class="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                placeholder="What's on your mind?"
                                onchange={(e) => { content = e.currentTarget.value }}
                            ></textarea>
                            <div class="flex justify-end space-x-4">
                                <button 
                                    type="button" 
                                    onclick={this.cancel} 
                                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    class="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>


            )
        }
    }
}