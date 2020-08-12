import Reactive from './lib/Reactive'
import Date from './components/Date'
import Btn from './components/Button'

const app = document.getElementById('root')
const state = { price: 1000, qty: 10 }
const reactive = new Reactive(state, app)

const incQty = () => state.qty++
const incPrice = () => state.price += 1000

// stateless component example
const Button = () => (
  <button onClick={incQty} class="my-btn">Add Qty by 1</button>
)

reactive.watch(({ price, qty }) => {
  const total = price * qty
  return (
    <div>
      <Date />
      <p>{price} x {qty} = {total}</p>
      <Button />
      {/* For now, i have no idea to pass props with JSX, so i pass props like the code below */}
      {Btn('Add Price by 1000', incPrice)}
    </div>
  )
}) 
