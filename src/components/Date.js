import Reactive from '../lib/Reactive'

const reactive = new Reactive({ date: new Date() })

setInterval(() => {
  const { state } = reactive
  state.date = new Date()
}, 1000)

// stateful component
export default () => reactive.watch(({ date }) => {
  return <p>Date now: {date}</p>
})
