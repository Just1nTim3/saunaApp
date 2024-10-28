import { useState, useEffect } from 'react';
import './App.css'

type Temp = {
    _id: number
    temp: string
    timestamp: Date
}

function App() {
    const [temps, setTemps] = useState<Temp[]>([])

    useEffect(() => {
        const fetchTemps = async () => {
            try {
                console.log("Calling latest Temps endpoint")
                const response = await fetch("http://localhost:8080/saunaApp/latestTemps")
                console.log(response.status)
                const temps: Temp[] = await response.json()
                console.log("Temps: " + JSON.stringify(temps))
                setTemps(temps)
            } catch (e) {
                console.log(e)
            }
        }
        fetchTemps()
    }, []);

    return (
        <div className="App">
            <h1>Hello from sauna!</h1>
            <h1>Temp: {temps[temps.length - 1]?.temp}</h1>
        </div>
    )
}

export default App
