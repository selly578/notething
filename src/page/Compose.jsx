import m from "mithril"
import { getIdentity } from "../storage"
import { Card } from "../components/Card"

const API_URL = import.meta.env.VITE_API_URL
export const Compose = function(vnode){
    var content = ""
    var image = null
    var is_reply = vnode.attrs.is_reply || false
    var quote = vnode.attrs.quote || false
    var post_id = vnode.attrs.id
    var reply_post = null
    var loading = false
    
    console.log(is_reply)
    return {
        cancel: function(){
            m.route.set("/")
        },
        submit: function(e){
            e.preventDefault()
            loading = true

            var formData = new FormData()
            formData.append("content",content)
            formData.append("image",image)
            formData.append("parent",is_reply?post_id:null)
            formData.append("quoted",quote?post_id:null)
            console.log(formData)
            m.request({
                method: "POST",
                url: `${API_URL}/posts/compose`,
                body:formData,
                extract: (xhr) => xhr,
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
                    url: `${API_URL}posts/${post_id }`,
                    headers: {
                      "user-id": getIdentity().id,
                    }               
                  }).then(function(data){
                    reply_post = data
                    
                }).catch(function(error){
                    is_reply = false
                    quote = false
                })
            }
        },
        view: function(){
            return (
                <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                    <div class="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
                        {reply_post && (
                            <div class="text-gray-600 mb-4">
                                <span class="font-semibold">
                                    {quote?"Quote post":"Replying to"} 
                                </span>
                                <Card post={reply_post} hide_footer={true} />
                            </div>
                        )}
                        <h1 class="text-2xl font-bold mb-4 text-gray-800">
                            {is_reply ? "Your reply" : "Create a New Post"}
                        </h1>
                        <form method="post" class="space-y-4" onsubmit={this.submit}>
                            <textarea 
                                name="content" 
                                required 
                                class="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                placeholder="What's on your mind?"
                                onchange={(e) => { content = e.currentTarget.value }}
                            ></textarea>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Attach Image</label>
                                <input 
                                    type="file" 
                                    name="image" 
                                    accept="image/*" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none file:cursor-pointer file:bg-purple-800 file:text-white file:rounded-lg file:border-none file:mr-4 file:py-2 file:px-4 file:hover:bg-purple-700"
                                    onchange={(e) => { image = e.currentTarget.files[0] }}
                                />
                            </div>
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
                    {loading && (
                        <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
                            <div class="spinner w-16 h-16 border-4 border-t-purple-600 border-gray-300 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            )
        }
    }
}