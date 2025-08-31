import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import LiveTracking from '../components/LiveTracking'

const vehicleOptions = [ 'car', 'suv', 'sedan' ]

const ScheduleRide = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { pickup = '', destination = '' } = location.state || {}

    const [ date, setDate ] = useState('')
    const [ time, setTime ] = useState('')
    const [ vehicleType, setVehicleType ] = useState('car')
    const [ fare, setFare ] = useState(null)

    useEffect(() => {
        async function fetchFare() {
            if (!pickup || !destination) return
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                    params: { pickup, destination },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                setFare(response.data)
            } catch (e) {
                // ignore network errors for now
            }
        }
        fetchFare()
    }, [ pickup, destination ])

    const canConfirm = Boolean(date && time && vehicleType && pickup && destination)

    return (
        <div className="h-screen relative overflow-hidden">
            <img
                className="w-16 absolute left-5 top-5"
                src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
                alt=""
            />
            <div className="h-screen w-screen">
                <LiveTracking />
            </div>

            <div className="fixed w-full z-50 bottom-0 bg-white px-4 py-6 pt-10 shadow-lg rounded-t-2xl">
                <h3 className="text-2xl font-semibold mb-5">Schedule your Ride</h3>

                <div className="flex gap-4 justify-between flex-col items-stretch">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Date</label>
                            <input
                                type="date"
                                className="bg-[#eee] px-3 py-2 rounded-lg"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Time</label>
                            <input
                                type="time"
                                className="bg-[#eee] px-3 py-2 rounded-lg"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Choose transport type</p>
                        <div className="grid grid-cols-3 gap-2">
                            {vehicleOptions.map((type) => (
                                <button
                                    key={type}
                                    className={`px-3 py-2 rounded-lg border-2 ${vehicleType === type ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-black'}`}
                                    onClick={() => setVehicleType(type)}
                                >
                                    {type.toUpperCase()} {fare && fare[type] ? `\u20B9${fare[type]}` : ''}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-3">
                        <p className="text-sm text-gray-600">Estimated fare</p>
                        <h2 className="text-xl font-semibold">{fare && vehicleType ? `\u20B9${fare[ vehicleType ]}` : '—'}</h2>
                    </div>

                    <button
                        disabled={!canConfirm}
                        className={`w-full mt-2 ${canConfirm ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'} font-semibold p-3 rounded-lg`}
                        onClick={() => {
                            navigate('/home', {
                                state: {
                                    fromSchedule: true,
                                    pickup,
                                    destination,
                                    vehicleType,
                                    scheduleAt: `${date}T${time}`
                                }
                            })
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ScheduleRide


