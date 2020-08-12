// stateless components and pass props
export default (text, onClick) => (
  <button onClick={onClick} class="my-btn">{text}</button>
)