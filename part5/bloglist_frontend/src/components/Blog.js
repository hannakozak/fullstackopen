import React, { useState } from 'react'

const Blog = ({ blog, handleLikeBlog, handleDelete, user }) => {
    const [showFullBlog, setShowFullBlog] = useState(false)

    const showBlog = { display: showFullBlog ? '' : 'none' }

    const bloglist = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const toggleVisibility = () => {
        setShowFullBlog(!showFullBlog)
    }

    return (
        <div style={bloglist}>
            <div className="blog">
                <div>
                    {blog.title}
                    <button onClick={toggleVisibility}>{showFullBlog? 'hide' : 'show'}</button>
                </div>
                <div>{blog.author}</div>
            </div>
            <div className="blog" style={showBlog}>
                <div> {blog.url}</div>
                <div>
                    {blog.likes}
                    <button onClick={(event) => handleLikeBlog(blog.id)}>like</button>
                </div>
                { user === null ? <div></div> :
                    <button onClick={(event) => handleDelete(blog)}>remove</button>
                }
            </div>
        </div>

    )
}

export default Blog
