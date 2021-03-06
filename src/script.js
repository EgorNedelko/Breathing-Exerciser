import cycles from "../cycles.js"
let currentStyleInhale = cycles[2].inhale
let currentStyleExhale = cycles[2].exhale
let currentStyleBg = cycles[2].bg

const passInput = document.querySelector(".pass-input")
const styles = document.querySelectorAll(".style")
const slider = document.getElementById("slider")
const timerBtn = document.getElementById("timerBtn")
const setDurationBtn = document.getElementById("setDurationBtn")
const durationTimer = document.querySelector(".duration-value")
const prepElem = document.querySelector(".prep")
const inhaleElem = document.querySelector(".inhale")
const exhaleElem = document.querySelector(".exhale")
const prepTimer = document.querySelector(".prep-value")
const inhaleTimer = document.querySelector(".inhale-value")
const exhaleTimer = document.querySelector(".exhale-value")
const stroke = document.querySelector(".stroke")
const overlay = document.getElementById("overlay")
const modalWindow = document.querySelector(".modal-window")
const modalCloseBtn = document.querySelector(".modal-close-btn")
const tapSound = document.querySelector("audio[data-audio-tap]")
let durationMenuOpen = false
let durationValue = 0
let isPaused = true
let interval = 0
let audio

const setDuration = (e) => {
   durationValue = e.target.value
   durationTimer.innerHTML = displayDuration(durationValue)
}

const stopCountdown = () => {
   isPaused = true
   timerBtn.className = "start"
   clearInterval(interval)
   stroke.removeAttribute("style")
   prepTimer.innerHTML = 3
   inhaleTimer.innerHTML = currentStyleInhale
   exhaleTimer.innerHTML = currentStyleExhale
   stroke.style.backgroundImage = `url(../assets/img/${currentStyleBg}.png)`
}

const countdown = (element, time) => {
   clearInterval(interval)
   const elem = element
   let timer = time
   let cycleLength = currentStyleInhale + currentStyleExhale
   
   if (isPaused == true) {
      clearInterval(interval)
      return
   }
   
   if (durationValue || (elem.classList.contains("exhale-value") && durationValue == 0)) {
      console.log(durationValue)
      
      if (elem.classList.contains("inhale-value")) {
         stroke.style.backgroundImage = `url(../assets/img/${currentStyleBg}.png)`
         stroke.style.animation = `cycle ${cycleLength}s linear infinite`
      }
      
      //remove initial delay
      // if (!elem.classList.contains("prep-value")) {
      //    timer--
      //    elem.innerHTML = timer
      //    durationValue--
      //    if (durationValue < 0) {
      //       durationValue = 0
      //    }
      //    durationTimer.innerHTML = durationValue
      //    slider.value = durationValue
      // }

      interval = setInterval(() => {
         if (elem.classList.contains("prep-value")) {
            timer--
            elem.innerHTML = timer
         } else {
            timer--
            elem.innerHTML = timer
            durationValue--
            if (durationValue < 0) {
               durationValue = 0
            }
            durationTimer.innerHTML = displayDuration(durationValue)
            slider.value = durationValue
         }
         
         if (timer <= 0) {
            clearInterval(interval)

            if (elem.classList.contains("prep-value")) {
               toggleVisibility(inhaleElem, inhaleTimer)
               
               if (currentStyleInhale == 1) {
                  audio = document.querySelector('audio[data-audio-inhale1sec]')
               } else if (currentStyleInhale == 2) {
                  audio = document.querySelector('audio[data-audio-inhale2sec]')
               } else if (currentStyleInhale == 7) {
                  audio = document.querySelector('audio[data-audio-inhale7sec]')
               }

               audio.currentTime = 0
               audio.play()
               inhale(inhaleTimer, currentStyleInhale)
            }
            
            if (elem.classList.contains("inhale-value")) {
               toggleVisibility(exhaleElem, exhaleTimer)

               if (currentStyleExhale == 1) {
                  audio = document.querySelector('audio[data-audio-exhale1sec]')
               } else if (currentStyleExhale == 2) {
                  audio = document.querySelector('audio[data-audio-exhale2sec]')
               } else if (currentStyleExhale == 7) {
                  audio = document.querySelector('audio[data-audio-exhale7sec]')
               }

               audio.currentTime = 0
               audio.play()
               exhale(exhaleTimer, currentStyleExhale)
            }

            if (elem.classList.contains("exhale-value")) {
               if (durationValue != 0) {
                  stroke.removeAttribute("style")
                  inhaleTimer.innerHTML = currentStyleInhale
                  exhaleTimer.innerHTML = currentStyleExhale
                  toggleVisibility(inhaleElem, inhaleTimer)

                  if (currentStyleInhale == 1) {
                     audio = document.querySelector('audio[data-audio-inhale1sec]')
                  } else if (currentStyleInhale == 2) {
                     audio = document.querySelector('audio[data-audio-inhale2sec]')
                  } else if (currentStyleInhale == 7) {
                     audio = document.querySelector('audio[data-audio-inhale7sec]')
                  }

                  audio.currentTime = 0
                  audio.play()
                  inhale(inhaleTimer, currentStyleInhale)
               } else {
                  stroke.removeAttribute("style")
                  isPaused = true
                  timerBtn.className = "start"
                  return
               }
            }
         }
      }, 1000)
   }
}

const pause = () => {
   if (isPaused == true) {
      isPaused = false
   } else {
      isPaused = true
   }
}

const hideTimers = () => {
   prepElem.style.display = "none"
   prepTimer.style.display = "none"
   inhaleElem.style.display = "none"
   inhaleTimer.style.display = "none"
   exhaleElem.style.display = "none"
   exhaleTimer.style.display = "none"
}

const toggleVisibility = (parentElem, childElem) => {
   hideTimers()
   parentElem.style.display = "block"
   childElem.style.display = "block"
}

const prep = (elem, time) => {
   countdown(elem, time)
}

const inhale = (elem, time) => {
   countdown (elem, time)
}

const exhale = (elem, time) => {
   countdown (elem, time)
}

const changeStyle = (e) => {
   styles.forEach(style => style.className = "style")
   document.getElementById(e.target.parentNode.getAttribute("id")).classList.add("active") 
   let id = e.target.parentNode.getAttribute("id").slice(-1) - 1
   currentStyleInhale = cycles[id].inhale
   currentStyleExhale = cycles[id].exhale
   inhaleTimer.innerHTML = currentStyleInhale
   exhaleTimer.innerHTML = currentStyleExhale
   currentStyleBg = cycles[id].bg
   stroke.style.backgroundImage = `url(../assets/img/${currentStyleBg}.png)`
}

const displayDuration = (durationValue) => {
   let formattedTime
   let delimiter = ","
   let min = Math.trunc(durationValue / 60)
   let sec = durationValue % 60

   if (min == 0 && sec == 0) {
      return formattedTime = `0`
   } else if (min < 1 && sec > 30) {
      min += 1
      return formattedTime = `${min}m`
   } else if (min < 1 && sec <= 30) {
      return formattedTime = `0,5 мин`
   }

   if (sec > 30) {
      min += 1
      sec = 0
   } else if (sec == 0) {
      sec = 0
   } else if (sec <= 30) {
      sec = "5"
   } 

   return formattedTime = `${min}${delimiter}${sec} мин`
}

const loadDefaults = () => {
   durationValue = slider.value
   durationTimer.innerHTML = displayDuration(durationValue)
}

const openModal = () => {
   overlay.style.display = 'block'
   modalWindow.classList.add('modal-open')
}

const closeModal = () => {
   overlay.style.display = 'none'
   modalWindow.classList.remove('modal-open')
}

window.addEventListener('DOMContentLoaded', () => {
   stopCountdown()
   loadDefaults()
})

slider.addEventListener('input', (e) => {
   hideTimers()
   stopCountdown()
   if (audio) audio.pause()
   setDuration(e)
})

timerBtn.addEventListener('click', () => {
   tapSound.play()
   if (isPaused == false) {
      hideTimers()
      stopCountdown()
      if (audio) audio.pause()
      timerBtn.className = "start"
   } else {
      isPaused = false
      timerBtn.className = "pause"
      toggleVisibility(prepElem, prepTimer)
      prep(prepTimer, 3)
   }
})

styles.forEach(style => style.addEventListener('click', (e) => {
   tapSound.play()
   hideTimers()
   stopCountdown()
   if (audio) audio.pause()
   changeStyle(e)
}))

setDurationBtn.addEventListener('click', () => {
   // if (!durationMenuOpen) {
      tapSound.play()
      setDurationBtn.classList.add('open')
      stopCountdown()
      if (audio) audio.pause()
      hideTimers()
      openModal()
      durationMenuOpen = true
   // } else {
   //    setDurationBtn.classList.remove('open')
   //    closeModal()
   //    durationMenuOpen = false
   // }
})

modalCloseBtn.addEventListener('click', () => {
   tapSound.play()
   setDurationBtn.classList.remove('open')
   closeModal()
   durationMenuOpen = false
})

passInput.addEventListener('input', (e) => {
   if (passInput.value == '09876') {
      document.querySelector(".pass-window").style.display = "none"
   }
})
