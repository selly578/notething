import m from "mithril"


export const Modal = function(){
    return {
        _show: false,
        hide: function(){
            this._show = false 
            console.log(this._show)
            m.redraw()
        },
        show: function(){
            this._show = true 
            m.redraw()
            console.log(this._show)
        },
        view: function(){
            return this._show && (     
            <div
                class="fixed flex inset-0 bg-black bg-opacity-50 items-center justify-center"
                onclick={(e) => {
                    if (e.target === e.currentTarget) this.hide(); // Close on outside click
                }}
            >      
                <div class="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl w-3/4 lg:w-2/5">
                    <h2 class="text-2xl font-bold mb-4">New post</h2>
                    <form action="/create" method="post" class="mx-auto">
                        <textarea name="content" id="" required="" class="w-full border-none border-gray-600 rounded-lg p-2 text-gray-800  font-sans mx-auto min-h-52" placeholder="What's on your mind?" style="resize: none;"></textarea>
                        <button class="mt-4 px-4 py-2 border border-solid border-blue-600 bg-blue-600 text-white rounded-lg hover:bg-blue-500">Post</button>
                    </form>
                </div>
            </div>
          )
  
        }
    }
}