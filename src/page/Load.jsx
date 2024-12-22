import m from "mithril"
import { setIdentity } from "../storage"

const API_URL = import.meta.env.VITE_API_URL
export const Load = function(){
    document.title = "Load your profile"
    var code = ""
    var not_found = false
    return {
        submit: function(e){
            console.log(code)
            e.preventDefault()
            if(code.length > 0){
                m.request({
                    method: "POST",
                    url: `${API_URL}profile/load`,
                    body:{
                        code: code,
                    },               
                }).then(function(data){
                       setIdentity(data.id,data.nickname)
                    //    not_found = false
                       m.route.set("/")   
                }).catch(function(e){
                    if(e.code == 404){
                        not_found = true
                    }
                })
            }
                

        },
        view: function(){
            return (
                <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                    <div class="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
                        <h1 class="text-xl font-bold text-gray-800 mb-4">Enter Your Identity Code</h1>
                        <form class="space-y-4" onsubmit={this.submit}>
                            <input 
                                type="text" 
                                name="identity-code" 
                                placeholder="Identity Code" 
                                oninput={(e) => {code = e.currentTarget.value}}
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:outline-none"
                            />
                            {
                                not_found ?(
                                    <small>User code not found</small>
                                ): <></>
                            }
                            <button 
                                type="submit" 
                                class="w-full bg-violet-800 text-white py-2 px-4 rounded-lg hover:bg-violet-700"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>

            )
        }
    }
}