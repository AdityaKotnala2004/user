import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'
import VehiclePanel from '../components/VehiclePanel'

const PlanRide = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { pickup = '', destination = '' } = location.state || {}

    const [ who, setWho ] = useState('self')
    const [ bookerPhone, setBookerPhone ] = useState('')
    const [ riderPhone, setRiderPhone ] = useState('')

    const canProceed = useMemo(() => {
        const isValidPhone = (v) => v && v.replace(/\D/g, '').length >= 10
        if (who === 'self') return isValidPhone(bookerPhone)
        return isValidPhone(bookerPhone) && isValidPhone(riderPhone)
    }, [ who, bookerPhone, riderPhone ])

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

            <div className="fixed w-full z-50 bottom-0 bg-white px-4 py-6 pt-6 shadow-lg rounded-t-2xl">
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Booking ride for:</p>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            className={`px-3 py-2 rounded-lg border-2 ${who === 'self' ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-black'}`}
                            onClick={() => setWho('self')}
                        >Yourself</button>
                        <button
                            className={`px-3 py-2 rounded-lg border-2 ${who === 'someone' ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-black'}`}
                            onClick={() => setWho('someone')}
                        >Someone else</button>
                    </div>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-3">
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Your phone number</label>
                        <input
                            className="bg-[#eee] px-3 py-2 rounded-lg"
                            placeholder="Enter phone number"
                            value={bookerPhone}
                            onChange={(e) => setBookerPhone(e.target.value)}
                        />
                    </div>
                    {who === 'someone' && (
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Rider's phone number</label>
                            <input
                                className="bg-[#eee] px-3 py-2 rounded-lg"
                                placeholder="Enter rider's phone number"
                                value={riderPhone}
                                onChange={(e) => setRiderPhone(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <div className="w-full grid grid-cols-2 gap-3">
                    <button
                        className={`px-4 py-3 rounded-lg w-full ${canProceed ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'}`}
                        onClick={() => {
                            if (!canProceed) return
                            navigate('/home', { state: { pickup, destination, fromPlan: true, bookerPhone, riderPhone: who === 'self' ? bookerPhone : riderPhone } })
                        }}
                    >
                        Ride Now
                    </button>
                    <button
                        className={`border-2 px-4 py-3 rounded-lg w-full ${canProceed ? 'bg-white border-gray-200 text-black' : 'bg-gray-100 border-gray-200 text-gray-400'}`}
                        onClick={() => {
                            if (!canProceed) return
                            navigate('/schedule-ride', { state: { pickup, destination, bookerPhone, riderPhone: who === 'self' ? bookerPhone : riderPhone } })
                        }}
                    >
                        Schedule a Ride
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PlanRide


