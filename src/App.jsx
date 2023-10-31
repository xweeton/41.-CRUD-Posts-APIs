import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from "react";
import { useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import '/src/App.css'

const API_URL = 'https://311-posts-demo-server.zeph-goh.repl.co/posts';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [postId, setPostId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchPosts = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchPosts();
  }, []);


  const createPost = (e) => {
    e.preventDefault();
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author }) //.stringify = json to string, .json = string to json
    })
      .then(res => res.json())
      .then(fetchPosts) //fetch all posts after creating new post
      .catch(err => console.error(err));

    //reset input
    setTitle('');
    setContent('');
    setAuthor('');
  }

  const editPost = () => {
    fetch(`${API_URL}/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author })
    })
      .then(res => res.json())
      .then(fetchPosts)
      .catch(err => console.error(err));

    setTitle('');
    setContent('');
    setAuthor('');
    setPostId(null);
  }

  const deletePost = (postId) => {
    fetch(`${API_URL}/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(fetchPosts)
      .catch(err => console.error(err));

    setTitle('');
    setContent('');
    setAuthor('');
  }

  const openEditModal = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
    setPostId(post.id);
    setShowModal(true);
  }

  const closeEditModal = () => {
    setTitle('');
    setContent('');
    setAuthor('');
    setPostId(null);
    setShowModal(false);
  }

  const handleUpdate = () => {
    if (postId) {
      editPost();
      closeEditModal();
    }
  }

  const ModalComponent = ({ show, handleClose, title, content, author, setTitle, setContent, setAuthor, handleUpdate }) => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" value={content} onChange={e => setContent(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control type="text" value={author} onChange={e => setAuthor(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>
    );
  };


  return (
    <div className='text-center p-5'>
      <img src='./src/post.png' height='200px'/>
      <form onSubmit={createPost}>
        <input className='my-2' style={{width:'200px'}} type='text' placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
        <br />
        <input className='mb-2' style={{width:'200px'}} type='text' placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <br />
        <textarea style={{width:'200px'}} placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
        <br />
        <button type='submit'>Create Post</button>
      </form>
      <div>
        {posts.length > 0 ? (
          <div className='text-start p-4'>
            {posts.map(post => (
              <div key={post.id}>
                <h2 className='border-top border-2 mt-4 pt-2'>{post.id}. {post.title}</h2>
                <pre>{post.content}</pre>
                <p>Author: {post.author}</p>
                <button className='me-2' onClick={() => deletePost(post.id)}>Delete Post</button>
                <button onClick={() => openEditModal(post)}>Edit Post</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts found.</p>
        )}
      </div>
      <ModalComponent
        show={showModal}
        handleClose={closeEditModal}
        title={title}
        content={content}
        author={author}
        setTitle={setTitle}
        setContent={setContent}
        setAuthor={setAuthor}
        handleUpdate={handleUpdate}
      />
    </div >
  )

}