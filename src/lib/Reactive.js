import { h } from 'dom-chef'

globalThis.h = h

class Reactive {
  constructor(state = {}, app = document.createElement('div')) {
    this.app = app
    this.state = state
    this.subscriber = () => {}
  }

  depend(effect) {
    if (typeof effect === 'function') {
      this.subscriber = effect
    } else {
      throw new Error('Effect must be function.')
    }
  }

  notify() {
    const { app, state } = this
    app.innerHTML = ''
    app.appendChild(this.subscriber(state))
  }

  watch(effect) {
    const { app, state: data } = this
    this.depend(() => effect(data))
    this.notify()
    Object.entries(data).forEach(([key, value]) => {
      Object.defineProperty(data, key, {
        get: () => {
          this.depend(() => effect(data))
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
