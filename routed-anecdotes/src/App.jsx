/* eslint-disable react/prop-types */
import { useState } from 'react'

import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams,
  useNavigate
} from 'react-router-dom'
import { useField } from './hooks'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to='/' style={padding}>anecdotes</Link>
      <Link to='/create' style={padding}>create new</Link>
      <Link to='/about' style={padding}>about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote =>
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>)}
    </ul>
  </div>
)

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id
  const anecdote = anecdotes.find(n => n.id === Number(id))
  console.log(anecdote)
  return (
    <div>
      <h2>{anecdote.content}</h2>

      <div>
        <p>has {anecdote.votes} vote{anecdote.votes !== 1 ? 's' : ''}</p>

        <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
      </div>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const navigate = useNavigate()
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  //3 different cases of useField

  //need a way for the reset to work without being part of the spread syntax

  const handleSubmit = (e) => {
    //console.log('e', e.target.value)
    e.preventDefault()
    props.addNew({
      content: content.noReset.value,
      author: author.noReset.value,
      info: info.noReset.value,
      votes: 0
    })
    props.setNotification(`a new anecdote ${content.noReset.value} created!`)
    setTimeout(() => props.setNotification(''), 5000)
    navigate('/')
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.noReset} />
        </div>
        <div>
          author
          <input {...author.noReset} />
        </div>
        <div>
          url for more info
          <input {...info.noReset} />
        </div>
        <button type='submit'>create</button>
      </form>
      <button onClick={() => {content.reset(), author.reset(), info.reset()}}>reset</button>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 1,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')
  console.log(anecdotes)
  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    console.log(anecdotes)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />  
        <p>{notification}</p>    
      </div>

      <Routes>
        <Route path='/' element={<AnecdoteList anecdotes={anecdotes}/>} />
        <Route path='/create' element={<CreateNew addNew={addNew} setNotification={setNotification}/>} />
        <Route path='/about' element={<About />} />
        <Route path='/anecdotes/:id' element={<Anecdote anecdotes={anecdotes}/>} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
