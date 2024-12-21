import m from "mithril"
import { Card } from "../components/Card"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { getIdentity } from "../storage"


dayjs.extend(utc)
dayjs.extend(timezone)
const API_URL = import.meta.env.VITE_API_URL

export const Post = function(vnode){
    var post_id = vnode.attrs.key
    var post = vnode.attrs.post
    var like = false 
    var likeCount = 0
    var quoteCount = 0
    var replies = []
    
    return {
        fetch: function(){
            m.request({
                method: "GET",
                url: `${API_URL}posts/${post_id}`,
                headers: {
                    "user-id": getIdentity().id,
                }               
            }).then(function(data){
                post = data                
                like = post.user_like_this 
                likeCount = post.like_count     
                quoteCount = post.quote_count       
                document.title = `${post.author.nickname}(${post.author.id.slice(0,3)}): "${post.content}"`
                
                m.request({
                    method: "GET",
                    url: `${API_URL}posts/${post_id}/reply`,
                    headers: {
                        "user-id": getIdentity().id,
                    }               
                }).then(function(data){
                    replies = data
                })
                
            })
        },
        likePost: function(){
            m.request({
                method: "POST",
                url: `${API_URL}posts/like/${post.id}`,
                headers: {
                    "user-id": getIdentity().id,
                }        
            })
            if(like){
                like = false
                likeCount -= 1
            }else{
                like = true
                likeCount += 1
            }
        },
        oncreate: function(){
            this.fetch()
            console.log("post")
        },
        onupdate: function(){
            console.log("update")
        },
        view: function(){
            return post?(
            <div class="px-4 mx-1 md:mx-28 lg:mx-80">                
                <div class="border border-solid border-gray-300 shadow min-h-screen">
                    <article className="border border-solid border-gray-300 p-4">
                        <header class="card-header pb-0 ">
                                <span class="font-semibold text-gray-700 text-lg">{post.author.nickname}</span>                               
                                <span class="text-gray-500">({post.author.id.slice(0,5)})</span>
                        </header>                        
                        <main className="my-5 text-xl">     
                             {post.content}
                            <p class="text-sm text-gray-500 mt-5">{dayjs.utc(post.date_created).tz(dayjs.tz.guess()).format("ddd, DD MMM YYYY HH:mm:ss")}</p>
                        </main>
                        <footer class="space-x-4 border-t-2 border-solid border-gray-300 py-3">                              
                        <footer class="space-x-16 pt-3 flex items-center">
                                <button className={like ? 'text-violet-700' : 'text-gray-500'} onclick={this.likePost}>
                                    <i class="fa-solid fa-thumbs-up cursor-pointer mr-2" style="font-size: 15pt;"></i>
                                    <span>{likeCount}</span>
                                </button>
                                <m.route.Link href="#" class="no-underline cursor-pointer text-gray-500 hover:text-blue-400 ">
                                    <i class="fa-solid fa-retweet mr-2" style="font-size: 15pt;"></i>
                                    {quoteCount}
                                </m.route.Link>
                                <m.route.Link href={`/reply/${post.id}`} class="no-underline cursor-pointer text-gray-500 hover:text-yellow-500">
                                    <i class="fa-regular fa-comment  mr-2" style="font-size: 15pt;"></i>
                                    {post.reply_count}
                                </m.route.Link>
                            </footer>
                        </footer>
                    </article>
                    <m.route.Link href={`/reply/${post.id}`} className="border-b border-solid border-red-300">
                        <div className="py-3 px-3 my-1  justify-center w-full hover:bg-gray-200 rounded-xl">
                            <span class="bg-purple-500 p-3 text-gray-200 text-xl font-semibold rounded-full">@</span> <span>Write your reply...</span>
                        </div>
                    </m.route.Link>
                    <div className="border-t border-solid border-gray-300">
                        { replies.length > 0 ?
                            replies.map(function(reply){
                                return <Card key={reply.id} post={reply} />
                            }): (
                            <h1 class="text-center text-3xl my-16">
                                No reply
                            </h1>
                            )
                        }
                    </div>
                </div>
              </div>
                // <></>
            ):  <div class="flex items-center justify-center mt-5">
                    <div class="animate-spin rounded-full h-8 w-8 border-t-4 border-purple-600 border-opacity-75 border-solid"></div>
                </div>
        }
    }
}