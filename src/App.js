import "./App.css";
import { useState, useEffect } from "react";

const initialItemState = {
  name: "",
  quantity: 0,
  price: 0,
};
const dbKey = "my-grocery-list";
function App() {
  const [item, setItem] = useState(initialItemState);
  const [itemList, setItemList] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setCount(itemList.length);
    const total = itemList.reduce((prev, curr) => {
      return prev + curr.quantity * curr.price;
    }, 0);
    setTotalPrice(total);
  }, [itemList]);

  useEffect(() => {
    const data = localStorage.getItem(dbKey);
    if (!data) return; // guard statement
    const parsedData = JSON.parse(data);
    setItemList(parsedData);
  }, []);

  const handleChange = (event) => {
    let value = event.target.value;
    const name = event.target.name;

    //if (['quantity', 'price'].includes(name)) {
    if (name === "quantity" || name === "price") {
      value = parseInt(value || 0);
    }

    setItem({
      ...item,
      [name]: value,
    });
  };

  const saveItem = (event) => {
    event.preventDefault();

    const _item = {
      ...item,
      id: Math.random().toString(),
    };

    setItemList([...itemList, _item]);
    setItem(initialItemState);
  };

  const saveList = () => {
    localStorage.setItem(dbKey, JSON.stringify(itemList));
  };

  const clearList = () => {
    setItemList([]);
    localStorage.setItem(dbKey, "[]");
  };

  return (
    <div>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <div className="navbar-item">Count: {count}</div>
          <div className="navbar-item">Total Price: {totalPrice}</div>
        </div>
      </nav>
      <form onSubmit={saveItem}>
        <input
          name="name"
          value={item.name}
          onChange={handleChange}
          className="input"
          type="text"
          placeholder="Input the item name"
        ></input>
        <input
          name="quantity"
          value={item.quantity}
          onChange={handleChange}
          className="input"
          type="number"
          placeholder="Input item quantity"
        ></input>
        <input
          name="price"
          value={item.price}
          onChange={handleChange}
          className="input"
          type="number"
          placeholder="Input item price"
        ></input>
        <button type="submit" className="button is-primary">
          Save
        </button>
      </form>

      {itemList.map((val) => {
        return (
          <div className="card grocery-item" key={val.id}>
            <header className="card-header">
              <p className="card-header-title">{val.name}</p>
              <button
                onClick={() => {
                  const newList = itemList.filter((v) => {
                    return v.id !== val.id;
                  });
                  setItemList(newList);
                }}
                className="card-header-icon"
                aria-label="more options"
              >
                X
              </button>
            </header>
            <div className="card-content">
              <div className="content">
                <p>Quantity: {val.quantity}</p>
                <p>Price: ${val.price}</p>
              </div>
            </div>
          </div>
        );
      })}

      <button onClick={saveList} className="button is-success">
        Save List
      </button>
      <button onClick={clearList} className="button is-warning">
        Clear List
      </button>
    </div>
  );
}

export default App;
