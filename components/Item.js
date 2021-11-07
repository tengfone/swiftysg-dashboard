import { FaMinus } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

const Item = ({ item, idx, todel, products, updateOrder }) => {
  return (
    <div className="single-item">
      <div className="row">
        <div className="col-md-6">
          <select
            className="form-control"
            id="exampleFormControlSelect1"
            value={item.name}
            onChange={(e) => {
              const newItem = products.find((p) => p.name === e.target.value);
              updateOrder(idx, {
                id: newItem.id,
                size: "",
                quantity: item.quantity,
                price: newItem.price,
                name: e.target.value,
              });
            }}
          >
            {products.map((product,key) => (
              <option key={key}>{product.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-1">
          <input
            type="text"
            className="form-control"
            required
            value={item.quantity}
            onChange={(e) => {
              const newItem = products.find((p) => p.name === item.name);
              updateOrder(idx, {
                id: item.id,
                size: "",
                quantity: e.target.value,
                price: newItem.price,
                name: item.name,
              });
            }}
          />
        </div>
        <div className="col-md-1">
          <input
            type="text"
            className="form-control classname"
            value={`$${products
              .find((p) => p.name === item.name)
              .price.toFixed(2)}`}
            readOnly
          />
        </div>
        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-danger"
            onClick={(e) => {
              todel(idx);
            }}
          >
            <FaMinus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;
