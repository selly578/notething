import m from "mithril"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { getIdentity } from "../storage"

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
const API_URL = import.meta.env.VITE_API_URL

export const Card = function(vnode){
    var post = vnode.attrs.post
    var like = post.user_like_this 
    var likeCount = post.like_count
    var relativeTimezone = dayjs(post.date_created).tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
    var date = dayjs().to(relativeTimezone)
    
    console.log(m.route.get() == `/post/${post.parent_id}`)

    return {
        likePost: function(){
            m.request({
                method: "POST",
                url: `${API_URL}/posts/like/${post.id}`,
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
        view: function(){
            return (
                <>
                    <article className="border border-solid border-gray-300 p-4">
                        {post.parent_id && m.route.get() !== `/post/${post.parent_id}` && ( // Check if post.parent_id exists
                            <div class="text-gray-500 mb-2">
                                Replied to post <m.route.Link href={`/post/${post.parent_id}`} class="text-violet-600 no-underline"> 
                                    {post.parent_id} 
                                </m.route.Link>
                            </div>
                        )}
                        <header class="card-header pb-0 text-sm">
                            <span class="font-semibold text-gray-700">{post.author.nickname}</span>
                            <span class="text-gray-500">({post.author.id.slice(0, 5)})</span>
                            <span> · {date} </span>
                        </header>
                        <main className="mb-2">
                            <m.route.Link href={`/post/${post.id}`} className="text-gray-600 no-underline block">
                                {post.content}
                            </m.route.Link>
                        </main>
                        <footer class="space-x-16 pt-3">
                            <button className={like ? 'text-violet-700' : 'text-gray-500'} onclick={this.likePost}>
                                <i class="fa-solid fa-thumbs-up cursor-pointer" style="font-size: 15pt;"></i>
                                <span>{likeCount}</span>
                            </button>
                            <m.route.Link href={`/reply/${post.id}`} class="no-underline cursor-pointer">
                                <i class="fa-regular fa-comment text-gray-500 mr-2" style="font-size: 15pt;"></i>
                                <span class="text-gray-500">{post.reply_count}</span>
                            </m.route.Link>
                        </footer>
                    </article>

                </>
            )
        }
    }
}