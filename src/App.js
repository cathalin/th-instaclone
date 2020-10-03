/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import logo from './logo.png';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 /* + rand(); */
  const left = 50 /* + rand(); */

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes =  useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);

      } else {
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }

  }, [user, username]);

  useEffect(() => {
      db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id, 
          post: doc.data()
        })));
      })
    }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
        <center>
        <img
          className="app__headerImage"
          src={logo} alt=""
          />
        </center>
        <Input
        placeholder="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />
        <Input
        placeholder="email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <Input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" onClick={signUp}>Sign Up</Button>
        </form>
      </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
        <center>
        <img
          className="app__headerImage"
          src={logo} alt=""
          />
        </center>
        <Input
        placeholder="email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <Input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" onClick={signIn}>Sign In</Button>
        </form>
      </div>
      </Modal>


        <div className="app__header">

          <img
          className="app__headerImage"
          src={logo} alt=""
          />

        { user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ): (
          <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>

        )}

        </div>

        <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
          <div className="app__postsRight">
            <InstagramEmbed
              url='https://instagr.am/p/Zw9o4/'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
          </div>
        </div>


        { user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ): (
          <h3>Sorry, you need to login in to upload</h3>
         )}

    </div>
  );
}

export default App;
