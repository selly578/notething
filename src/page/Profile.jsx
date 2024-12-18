import m from "mithril"
import { Card } from "../components/Card"
import { getIdentity,setIdentity } from "../storage"

const API_URL = import.meta.env.VITE_API_URL
export const Profile = function(){
    var nickname = getIdentity()?.nickname 
    var posts = []
    var loading = false
    document.title = "My profile"
    return {
        updateProfile: function(e){
            e.preventDefault()
            console.log(nickname)
            m.request({
                method: "POST",
                url: `${API_URL}profile/edit`,
                body:{
                    nickname: nickname
                },
                headers: {
                    "user-id": getIdentity().id,
                }               
            }).then(function(data){
                setIdentity(data.id,data.nickname)
                m.route.set("/profile")            
            })
        },
        oninit: function(){
            loading = true
            m.request({
                method: "GET",
                url: `${API_URL}posts/user`,
                headers: {
                  "user-id": getIdentity().id,
                }               
              }).then(function(data){
                posts = data
                loading = false
            })
        },
        view: function(){
            return <div class="mx-1 md:mx-28 lg:mx-80">                
    
                    <div class="border border-solid border-gray-300 shadow min-h-screen rounded-lg">            
                        <div class="mb-6 p-3">
                            <h2 class="text-lg font-semibold text-gray-800">Your Session Code:</h2>
                            <p class="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                                {getIdentity()?.id || "Session ID not available"}
                            </p>
                            <p class="mt-2 text-gray-700 text-sm">
                                Please remember to save this session code to load your account on a new device.
                            </p>
                            <div class="mb-6">
                                <h2 class="text-lg font-semibold text-gray-800">Account Information</h2>
                                <form  method="post" class="mt-4" onsubmit={this.updateProfile}>
                                    <label for="nickname" class="block text-gray-700 font-medium mb-1">Nickname</label>
                                    <input 
                                        type="text" 
                                        name="nickname" 
                                        id="nickname" 
                                        placeholder="Enter your nickname" 
                                        value={nickname } 
                                        oninput= {(e) => {nickname = e.currentTarget.value}}
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-purple-200 outline-none"
                                    />
                                    <button type="submit" class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500">
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        </div>                     
                
                        <div>
                            <h2 class="text-lg font-semibold text-gray-800 mb-4 px-3">Your Posts</h2>
                            {
                                posts.length <= 0 && <p class="text-gray-600 italic text-center">You haven't posted anything yet. <m.route.Link href="/write" class="hover:text-purple-600">Write new</m.route.Link></p>
                            }
                            {
                                loading?(
                                <div class="flex items-center justify-center mt-16">
                                    <div class="animate-spin rounded-full h-8 w-8 border-t-4 border-purple-600 border-opacity-75 border-solid"></div>
                                </div>): (
                                    posts.filter(function(post){
                                        return post
                                    }).map(function(post){
                                    return <Card key={post.id} post={post} />
                                    })
                                )
                            }
                        </div>
                    </div>
                </div>
        
        }
    }
}