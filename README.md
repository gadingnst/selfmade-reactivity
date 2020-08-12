## Simple Self-Made JS Reactivity with JSX (No REACT)

### Live [Demo](https://selfmade-reactivity.sutanlab.id)

#### What is my purpose?
In the Front-end worlds, "Reactivity" is something that everybody uses, but very few people understand. It’s no one's fault, really, as several people have different definitions of reactivity in programming.

> "Reactivity, among JavaScript frameworks, is the phenomenon in which changes in the application state are automatically reflected in the DOM."

---

Because that, I learn about "Reactivity" from scratch. Precisely, I loved Reactivity concept in Vue, because its reactivity is lightweight and simpler than other frameworks, But I also loved JSX in React, because it's the only templating that's very close and can be integrated in the `Javascript/Typescript` ecosystem.

So, i tried to make them work together by myself.

#### Explanation
First, i make reactivity class named `Reactive.js` in `src/lib` folder. Besides that, i uses [dom-chef]() for standalone JSX, (NO REACT INCLUDED).

```js
/*
  using JSX standalone with dom-chef,
*/
import { h } from 'dom-chef'

/*
  set JSX in globalThis for global uses.
  so we don't need to import it over and over again
*/
globalThis.h = h

...
```

In the `Reactive.js` file, we found `constructor` method. It used to create initial state and determine what elements to mount for the component that we are creating.
```js
...

class Reactive {
  /*
    Object constructor for initial reactive object
    @param {Generic or any} state : several reactive data model, like data in VueJS or state in ReactJS
    @param {HTMLElement|JSX.Element} app : element that you want to mount
  */
  constructor(state = {}, app = document.createElement('div')) {
    this.app = app
    this.state = state
    this.subscriber = () => {}
  }

  ...
}
```

Assume that we had the following data:
```js
const state = {
  price: 1000,
  qty: 1
}
```

And we want to mount the component in `div` element with id `root`:
```js
const app = document.getElementById('root')
```

So, we can call the instance like this:
```js
const reactive = new Reactive(state, app)
```

---

Below the `constructor`, we found the `depend()` and `notify()` method. 
- `depend()`: Function that set the effect functions into the subscriber property.
- `notify()`: Function that runs the effect functions stored in the subscriber property.

```js
  ...

  /*
    Depend method, set the target reactivity subscriber 
    @param {Function => HTMLElement|JSX.Element} effect : callback function that return HTMLElement or JSX.Element
  */
  depend(effect) {
    if (typeof effect === 'function') {
      this.subscriber = effect
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

  ...
```

***What's subscriber? What's effect?***

Well so, the `subscriber` is like: `Determine what function i should run if the state has changed?` In this case, we will set the subscriber with `effect` function that returns `JSX and HTML Element`

For the `notify()` method. Just like name, this method will ***notify*** the `subscriber` to runs its functions when there the state has changed. In this case, we will clear HTML element in the component and append it again while the state changes has triggered.

---

Last, we found the `watch()` method, this method is what we will always use to define a *stateful component*. The callback named `effect` functions will be passed to the `depend()`. It's called `setter` and `getter` which are used to track state changes through the `Object.defineProperty()`. `setter` will call the `depend()` method with effect functions passed to it before the state assigning new value, and the `getter` will call the `notify()` method to notify the `subscriber` to runs the effect functions before returning the state value.


```js
  ...

  /*
    Observe the state changes here. It uses reactivity concept like VueJS, with Object.defineProperty()
    @param {Function => HTMLElement|JSX.Element} effect : callback function that return HTMLElement or JSX.Element
  */
  watch(effect) {
    const { app, state: data } = this
    this.depend(effect)
    this.notify()
    Object.entries(data).forEach(([key, value]) => {
      Object.defineProperty(data, key, {
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
```

Assume that we want to assign state `price` and `qty`, then calculate the `total` through the buttons click like this.

```js
reactive.watch((state) => {
  const total = state.price * state.qty
  return (
    <>
      <p>{state.price} x {state.qty} = {total}</p>
      <button onClick={() => state.qty++} class="my-btn">Add Qty by 1</button>
      <button onClick={() => state.price += 1000} class="my-btn">Add Price by 1000</button>
    </>
  )
}) 
```

---

We're done, maybe you can learn more by trying it for yourself! Sorry for my bad english explanation.

```bash
$ yarn start # start development server

$ yarn build # production build
```

***

© 2020 — Sutan Gading Fadhillah Nasution
