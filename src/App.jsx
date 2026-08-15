import { useState } from 'react'
import bgImage from './assets/LOV.jpg'
import moonImage from './assets/Moon.png'
import Fireflies from './Fireflies'
import './App.css'

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = ['00', '30']
const PERIODS = ['AM', 'PM']
const PLACES = ['Andheri', 'Ghatkopar', 'Thane']

// This is the email FormSubmit will deliver every submission to.
// The first submission triggers a one-time "confirm this inbox" email
// from FormSubmit — after that link is clicked once, every future
// submission arrives normally, no further setup needed.
const RECEIVER_EMAIL = 'elsinnombre7571@gmail.com'

function App() {
  const [step, setStep] = useState(0)

  const [date, setDate] = useState('')
  const [hour, setHour] = useState('')
  const [minute, setMinute] = useState('')
  const [period, setPeriod] = useState('')

  const [selectedPlace, setSelectedPlace] = useState('')
  const [customPlace, setCustomPlace] = useState('')

  const [food, setFood] = useState('')
  const [duration, setDuration] = useState(2)

  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState(false)

  const timeIsSet = hour && minute && period
  const placeIsSet = selectedPlace && (selectedPlace !== 'Other' || customPlace.trim())
  const foodIsSet = food.trim().length > 0

  // The moon/lake image only shows on the final step; every other step
  // keeps using the lily-of-the-valley photo.
  const currentBg = step === 4 ? moonImage : bgImage

  // Whether to show the back button: not on the very first screen, and
  // not once the email has already been sent.
  const showBackButton = step > 0 && !(step === 4 && sent)

  // `async`/`await` means "pause here until this network request
  // finishes, then continue" — easier to read than chaining .then().
  async function sendEmail() {
    const timeStr = `${hour}:${minute} ${period}`
    const placeStr = selectedPlace === 'Other' ? customPlace : selectedPlace

    const payload = {
      Date: date,
      Time: timeStr,
      Place: placeStr,
      Food: food,
      'Hours together': `${duration} hour${duration > 1 ? 's' : ''}`,
    }

    setSending(true)
    setSendError(false)

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${RECEIVER_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setSent(true)
      } else {
        setSendError(true)
      }
    } catch (err) {
      setSendError(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="app">
      <div className="bg" style={{ backgroundImage: `url(${currentBg})` }} />
      <div className="overlay" />
      <Fireflies />
      {showBackButton && (
          <button className="back-btn" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}

      <div className="content">
        

        {step === 0 && (
          <div className="screen">
            <h1 className="headline">Would you like to go on a date me?</h1>
            <p className="subtext">There's something I'd love to ask you in person.</p>
            <div className="button-row">
              <button className="btn btn-primary" onClick={() => setStep(1)}>Yes</button>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Yes :)</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="screen">
            <h1 className="headline">When works for you?</h1>
            <p className="subtext">Pick a date and time that feels right.</p>

            <div className="field-group">
              <label className="field-label" htmlFor="date">Date</label>
              <input
                id="date" type="date" className="field-input"
                value={date} onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Time</label>
              <div className="time-row">
                <select className="field-select" value={hour} onChange={(e) => setHour(e.target.value)}>
                  <option value="" disabled>HH</option>
                  {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
                <span className="time-colon">:</span>
                <select className="field-select" value={minute} onChange={(e) => setMinute(e.target.value)}>
                  <option value="" disabled>MM</option>
                  {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <select className="field-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
                  <option value="" disabled>--</option>
                  {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <button className="btn btn-primary" disabled={!date || !timeIsSet} onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="screen">
            <h1 className="headline">Where should we meet?</h1>
            <p className="subtext">Pick a spot, or tell me somewhere else.</p>

            <div className="place-grid">
              {PLACES.map((place) => (
                <button
                  key={place} type="button"
                  className={`place-chip ${selectedPlace === place ? 'place-chip-active' : ''}`}
                  onClick={() => setSelectedPlace(place)}
                >
                  {place}
                </button>
              ))}
              <button
                type="button"
                className={`place-chip ${selectedPlace === 'Other' ? 'place-chip-active' : ''}`}
                onClick={() => setSelectedPlace('Other')}
              >
                Other
              </button>
            </div>

            {selectedPlace === 'Other' && (
              <div className="field-group">
                <label className="field-label" htmlFor="customPlace">Where?</label>
                <input
                  id="customPlace" type="text" className="field-input"
                  placeholder="Type a place..."
                  value={customPlace} onChange={(e) => setCustomPlace(e.target.value)}
                />
              </div>
            )}

            <button className="btn btn-primary" disabled={!placeIsSet} onClick={() => setStep(3)}>
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="screen">
            <h1 className="headline">Food &amp; Time?</h1>
            <p className="subtext">What are you craving, and how long do I get you for?</p>

            <div className="field-group">
              <label className="field-label" htmlFor="food">What would you like to eat?</label>
              <input
                id="food" type="text" className="field-input"
                placeholder="Type a cuisine or dish..."
                value={food} onChange={(e) => setFood(e.target.value)}
              />
              <button
                type="button"
                className="link-btn"
                onClick={() => setFood('Surprise me')}
              >
                Surprise me instead
              </button>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="duration">
                How many hours do I get you for? <strong>{duration} hr{duration > 1 ? 's' : ''}</strong>
              </label>
              <input
                id="duration"
                type="range"
                min="1"
                max="8"
                step="1"
                className="field-range"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
              <div className="range-labels">
                <span>1 hr</span>
                <span>8 hrs</span>
              </div>
            </div>

            <button className="btn btn-primary" disabled={!foodIsSet} onClick={() => setStep(4)}>
              Continue
            </button>
          </div>
        )}

       {step === 4 && (
  <div className="screen final-screen">
    {!sent ? (
      <>
        <div className="final-actions">
          <button
            className="btn btn-primary"
            onClick={sendEmail}
            disabled={sending}
          >
            {sending ? 'Sending...' : "It's a date then"}
          </button>

          {sendError && (
            <p className="error-text">
              Something went wrong sending that — check your internet connection and try again.
            </p>
          )}
        </div>
      </>
    ) : (
      <>
        <div className="final-actions">
          <p className="subtext">Can't wait to see you.</p>
        </div>
      </>
    )}
  </div>
)}
      </div>
    </div>
  )
}

export default App