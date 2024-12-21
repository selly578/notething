import m from "mithril"
import { setIdentity } from "../storage"

export const Load = function(){
    return {
        view: function(){
            return (
                <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                    <div class="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
                        <h1 class="text-xl font-bold text-gray-800 mb-4">Enter Your Identity Code</h1>
                        <form class="space-y-4">
                            <input 
                                type="text" 
                                name="identity-code" 
                                placeholder="Identity Code" 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:outline-none"
                            />
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