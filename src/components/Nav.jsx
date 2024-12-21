import m from "mithril"
import { getIdentity } from "../storage"

export const Nav = function(){
    return {
        view: function(){
            return (
            <nav class="flex items-center justify-between px-4 py-2 border-b border-solid border-gray-300">

                <div>
                    <a href="/" class="flex items-center">
                        <img src="/favicon.ico" alt="Logo" class="w-8 h-8" />                        
                    </a>
                </div>
        
                <div class="flex items-center space-x-4">
                    <m.route.Link href="/profile" class="text-gray-800 hover:text-purple-500">
                        {getIdentity()?.nickname || "Anonymous"}
                    </m.route.Link>
                    <m.route.Link href="/load" class="text-gray-600 hover:text-purple-500">Load Profile</m.route.Link>
                </div>

            </nav>
        )
        
        }
    }
}