import m from "mithril"
import { Card } from "../components/Card"
import { getIdentity } from "../storage"
import "../css/style.css"

const API_URL = import.meta.env.VITE_API_URL

export const Home = function(vnode){
  document.title = "Notething"
  var posts = []
  var search = vnode.attrs.search
  var loading = false
  var query = ""
  var default_class = "px-3 pb-1 text-gray-500 no-underline font-semibold"
  
  console.log(search && posts.length > 0)
  return {    
    searchpost: function(e){
        posts = []
        query = e.currentTarget.value
        if(query.length > 0){      
          loading = true
          m.request({
            method: "GET",
            url: `${API_URL}posts/search?q=${query}`,
            headers: {
              "user-id": getIdentity().id,
            }   
          }).then(function(data){
            console.log(posts)
            posts = data
            loading = false
          })
        }
    },
    oninit: function(){
      if(!search){
        loading = true
        m.request({
          method: "GET",
          url: `${API_URL}posts/`,
          headers: {
            "user-id": getIdentity().id,
          }               
        }).then(function(data){
          posts = data
          loading = false
        })
      }
    },
    view: function() {
      return   (
        <>
          <div class="mx-0 md:mx-28 lg:mx-80">
            <div class="border border-solid border-gray-300 shadow min-h-screen">
              <div class="flex pt-16 pl-3">
                <m.route.Link href="/" class={[default_class, search?"":"border-b border-solid border-purple-800"].join(" ")}>Explore</m.route.Link>
                <m.route.Link href="/search" class={[default_class, !search?"":"border-b border-solid border-purple-800"].join(" ")}>Discover</m.route.Link>
              </div>
              {search?
                <div class="relative w-full max-w-sm mx-auto mt-5 mb-3">
                  <input
                    type="text"
                    placeholder="Search..."
                    oninput={this.searchpost}
                    class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                  />
                  <svg
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    width="20"
                    height="20"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 21l-4.35-4.35m2.85-7.15a8 8 0 11-16 0 8 8 0 0116 0z"
                    />
                  </svg>
                </div>:<></>
              }
              {
              search && !loading && posts.length <= 0 && query.length <= 0?<h1 class="text-center text-2xl text-gray-800 my-28">What you want to search?</h1>:
                <></>
              }
              {search && !loading && posts.length <= 0 && query.length > 0?<h1 class="text-center text-2xl text-gray-800 my-28">{query} not found</h1>:<></>}
              {
                  loading?(
                  <div class="flex items-center justify-center mt-16">
                    <div class="animate-spin rounded-full h-8 w-8 border-t-4 border-purple-600 border-opacity-75 border-solid"></div>
                  </div>): (
                    posts.filter(function(post){
                      if(post.parent_id == null || search){
                        return post
                      }
                    }).map(function(post){
                      return <Card key={post.id} post={post} />
                    })
                  )
              }
            </div>
          </div>
          <m.route.Link title="create a new post" class="btn-floating cursor-pointer" href="/write">
            <i class="fas fa-pen"></i>
          </m.route.Link>
        </>
      )
    },
  };
};
