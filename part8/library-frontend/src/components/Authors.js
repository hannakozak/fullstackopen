import { useState } from "react";
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries/queries'

const Authors = ({show, allAuthors, setError}) => {
  const [authorName, setAuthorName] = useState('')
  const [birthyear, setBirthyear] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, { refetchQueries: [ {query: ALL_AUTHORS }],
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  if (!show) {
    return null
  }
  const authors = allAuthors

  const handleSubmit = async (event) => {
    event.preventDefault()
    editAuthor({  variables: { name: authorName, setBornTo: +birthyear } })

    setAuthorName('')
    setBirthyear('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      Set birthyear<br/>
      <label>Author Name</label>
      <select value={authorName}  onChange={({ target }) => setAuthorName(target.value)}>
      {authors.map(author => (<option key={author.name}>{author.name}</option>))}
      </select>
     <br />
      <label>Birth Year</label>
      <input type='number' value={birthyear}  onChange={({ target }) => setBirthyear(target.value)}/><br/>
      <button type='submit' onClick={handleSubmit}>update author</button>
    </div>
  )
}

export default Authors