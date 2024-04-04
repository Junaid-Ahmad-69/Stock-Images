import React, {useState, useEffect} from 'react'
import {FaSearch} from 'react-icons/fa'
import Photo from './Photo'
import axios from "axios";

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
    const [loading, setLoading] = useState(false)
    const [photos, setPhotos] = useState([])
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState('')

    const fetchImages = async () => {
        try {
            setLoading(true)
            let url;
            const urlPage = `&page=${page}`;
            const urlQuery = `&query=${query}`;
            if (query) {
                url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
            } else {
                url = `${mainUrl}${clientID}${urlPage}`;
            }
            const {data} = await axios.get(`${url}`)
            setPhotos((prevState)=>{
                if(query && page === 1){
                    return data.results
                }
                else if(query){
                    return [...prevState, ...data.results]
                }else{
                    return  [...prevState, ...data]
                }
            } )
            setLoading(false)

        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchImages()
    }, [page]);

    useEffect(() => {
        const event = window.addEventListener('scroll', () => {
            if (!loading && (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 2) {
                setPage(prevState => prevState + 1)
            }
        })
        return window.removeEventListener('scroll', event)
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault();
        if(!query) return
        if(page === 1){
            fetchImages()
            return;
        }
        setPage(1)

    }

    return (
        <main>
            <section className="search">
                <form className="search-form">
                    <input type="text" placeholder="search" value={query} onChange={e => setQuery(e.target.value)}
                           className="form-input"/>
                    <button type="submit" className="submit-btn" onClick={handleSubmit}><FaSearch/></button>
                </form>
            </section>
            <section className="photos">
                <div className="photos-center">
                    {photos.map((photo, index) => {
                        return <Photo key={index}  {...photo}/>
                    })}
                </div>
                {loading && <h2 className="loading">Loading...</h2>}
            </section>
        </main>
    )
}

export default App
