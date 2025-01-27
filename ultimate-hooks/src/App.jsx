import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  
  useEffect(() => {
    const getData = async () => {
      const result = await axios.get(baseUrl)
      setResources(result.data)
      console.log(result.data)
    }
    getData()
  }, [])
  

  const create = async (resource) => {
    const responce = await axios.post(baseUrl, resource)
    setResources(resources.concat(responce.data))
    //console.log('create', resource)
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      <ul>
        {notes.map(n => <li key={n.id}>{n.content}</li>)}
      </ul>

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      <ul>
        {persons.map(n => <li key={n.id}>{n.name} {n.number}</li>)}
      </ul>
    </div>
  )
}

export default App