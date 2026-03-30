import { useState } from 'react'
import './App.css'

function App() {
    // text to copy
    const [content, setContent] = useState("")

    // token returned from copy
    const [clipboardToken, setClipboardToken] = useState(null)

    // token entered for paste
    const [pasteToken, setPasteToken] = useState("")

    // content retrieved
    const [pastedContent, setPastedContent] = useState("")
    const [error, setError] = useState(null)

    // COPY function
    const handleCopy = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            const formData = new FormData()
            formData.append("content", content)

            const response = await fetch("http://127.0.0.1:5000/copy", {
                method: "POST",
                body: formData
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Something went wrong")
            }

            const data = await response.json()
            setClipboardToken(data.clipboard_token)
            setContent("")

        } catch (err) {
            setError(err.message)
        }
    }

    // PASTE function
    const handlePaste = async (e) => {
        e.preventDefault()
        setError(null)
        setPastedContent("")

        try {
            const response = await fetch(`http://127.0.0.1:5000/paste/${pasteToken}`)

            if (!response.ok) {
                const data = await response.json()
                throw new Error (data.error || "Clipboard not found")
            }

            const data = await response.json()
            setPastedContent(data.content)
        }
        catch (err) {
            setError(err.message)
        }
    }

return (
    <div className="App">
      <h1>Clippo</h1>
      <h2>Online Clipboard</h2>

      {/* COPY section */}
      <form onSubmit={handleCopy}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter text here..."
          rows={5}
          cols={40}
        />
        <br />
        <button type="submit">Upload text</button>
      </form>

      {clipboardToken && (
        <p>Clipboard token: <code>{clipboardToken}</code></p>
      )}

      <hr />

      {/* PASTE section */}
      <form onSubmit={handlePaste}>
        <input
          type="text"
          placeholder="Enter Clipboard Token"
          value={pasteToken}
          onChange={(e) => setPasteToken(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      {pastedContent && (
          <div>
            <p>Pasted Content:</p>
            <textarea
                value={pastedContent}
                readOnly
                rows={5}
                cols={40}
            />
          </div>
      )}

      {error && <p style={{color: "red"}}>{error}</p>}
    </div>
  )
}

export default App
