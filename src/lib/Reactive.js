/*
  using JSX standalone with dom-chef,
*/
import { h } from 'dom-chef'

/*
  set JSX in globalThis for global uses.
  so we don't need to import it over and over again
*/
globalThis.h = h

class Reactive {
  /*
    object constructor for initial reactive object
    @param {Generic or any} state : reactive data model, like data in VueJS or state in ReactJS
    @param {HTMLElement|JSX.Element} app : element that you want to mount
  */
  constructor(state = {}, app = document.createElement('div')) {
    this.app = app
    this.state = state
    this.subscriber = () => {}
  }

  /*
    Depend method, set the target reactivity subscriber 
    @param {Function => HTMLElement|JSX.Element} effect : callback function that return HTMLElement or JSX.Element
  */
  depend(effect) {
    if (typeof effect === 'function') {
      this.subscriber = state => effect(state)
    } else {
      throw new Error('Effect must be function.')
    }
  }

  /*
    Run the target function that stored in subscriber property. 
  */
  notify() {
    const { app, state } = this
    app.innerHTML = ''
    app.appendChild(this.subscriber(state))
  }

  /*
    Observe the state changes here. It uses reactivity concept like VueJS, with Object.defineProperty.
    @param {Function => HTMLElement|JSX.Element} effect : callback function that return HTMLElement or JSX.Element
  */
  watch(effect) {
    const { app, state } = this
    this.depend(effect)
    this.notify()
    Object.entries(state).forEach(([key, value]) => {
      Object.defineProperty(state, key, {
        get: () => {
          this.depend(effect)
          return value
        },
        set: newValue => {
          value = newValue
          this.notify()
        }
      })
    })
    return app
  }

}

export default Reactive
