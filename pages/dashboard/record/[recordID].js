import { useState, useEffect } from "react";
import Item from "../../../components/Item";
import { useRouter } from "next/router";
import { AiOutlineReload } from "react-icons/ai";
import { LOCATIONS, DELIVERY_FEE, PROMO_CODE } from "../../../helper/Enums";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../../../components/Navbar";
const axios = require("axios");

export default function RecordPage() {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [hall, setHall] = useState("");
  const [cart, setCart] = useState([]);
  const [deliveryOption, setDeliveryOption] = useState("");
  const [date, setDate] = useState(new Date());
  const [totalCost, setTotalCost] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const id = useRouter().query.recordID;
  const history = useRouter();

  useEffect(() => {
    axios
      .get("https://swiftys-server.glitch.me/api/orders/order/" + id)
      .then((res) => {
        setOrder(res.data);
        setName(res.data.address.name);
        setContact(res.data.address.phone);
        setEmail(res.data.address.email);
        setHall(res.data.address.hall);
        setCart(res.data.cart);
        setPromoCode(res.data.usedPromoCode);
        setTotalCost(res.data.totalCost);
        setDeliveryOption(res.data.deliveryOption);
        setPromoCode(res.data.usedPromoCode);
        axios
          .get("https://swiftys-server.glitch.me/api/shop/jmart")
          .then((res) => {
            setProducts(res.data[0].products);
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const todel = (i) => {
    const remainingCart = cart.filter((el, idx) => {
      return i !== idx;
    });
    setCart(remainingCart);
  };

  const updateOrder = (i, newCart) => {
    let tempCart = [...cart];
    tempCart[i] = newCart;
    setCart(tempCart);
  };

  const calculateTotalCost = () => {
    let newCost = 0;
    cart.map(
      (item) =>
        (newCost +=
          products.find((p) => p.id === item.id).price * item.quantity)
    );
    newCost += DELIVERY_FEE;
    newCost += promoCode === PROMO_CODE ? -5 : 0;
    setTotalCost(newCost);
  };

  const addNewProduct = () => {
    const initId = 1;
    let tempCart = [...cart];
    const newCart = {
      id: initId,
      size: "",
      quantity: 1,
      price: products.find((p) => p.id === initId).price,
      name: products[initId - 1].name,
    };

    tempCart.push(newCart);
    setCart(tempCart);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAddress = {
      name: name,
      phone: contact,
      postal: order.address.postal,
      additionalinfo: order.address.additionalinfo,
      promoCode: order.address.promoCode,
      email: email,
      hall: hall,
    };
    const newOrder = { ...order };
    newOrder.cart = cart;
    newOrder.address = newAddress;
    newOrder.totalCost = totalCost;
    newOrder.deliveryOption = deliveryOption;
    setIsLoading(true);
    axios
      .post(
        "https://swiftys-server.glitch.me/api/orders/updateOrder/" +
          newOrder._id,
        newOrder
      )
      .then((res) => {
        setIsLoading(false);
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const populateDeliveryOption = (e) => {
    setDeliveryOption(`${e.toString().substring(0, 10)}, 11pm, dropoff point`);
  };

  return (
    <>
      <Navbar />
      <div className="edit">
        <div className="loader" hidden={!isLoading}></div>
        {order && products && (
          <div className="container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <br />
                <label>Name: </label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <br />

              <div className="form-group">
                <label>Contact: </label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              <br />

              <div className="form-group">
                <label>Email: </label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <br />

              <div className="form-group">
                <label>Hall: </label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  value={hall}
                  onChange={(e) => setHall(e.target.value)}
                >
                  {LOCATIONS.map((location, key) => (
                    <option key={key}>{location}</option>
                  ))}
                </select>
              </div>

              <br />

              <label>Delivery Option: </label>
              <div className="row">
                <div className="col-md-2">
                  <DatePicker
                    className="form-control classname"
                    selected={date}
                    onChange={(e) => {
                      setDate(e);
                      populateDeliveryOption(e);
                    }}
                  />
                </div>

                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control classname"
                    value={deliveryOption}
                    readOnly
                  />
                </div>
              </div>

              <br />

              <div className="form-group">
                <div className="col-md-2">
                  <label>Promo Code: </label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={promoCode}
                    readOnly
                  />
                </div>
              </div>

              <br />

              <div className="form-group">
                <div className="row">
                  <div className="col-md-1">
                    <input
                      type="text"
                      className="form-control classname"
                      value={`$${totalCost.toFixed(2)}`}
                      readOnly
                    />
                  </div>
                  <br />
                  <div className="col-md-2">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={calculateTotalCost}
                    >
                      <AiOutlineReload />
                    </button>
                  </div>
                </div>
                <br />
                {cart.map((item, index) => {
                  return (
                    <Item
                      item={item}
                      key={index}
                      idx={index}
                      todel={todel}
                      products={products}
                      updateOrder={updateOrder}
                    />
                  );
                })}
              </div>
              <br />
              <div className="form-group">
                <button
                  type="button"
                  onClick={addNewProduct}
                  value="Add Product"
                  className="btn btn-primary"
                >
                  {" "}
                  Add Product
                </button>
                {!isLoading && (
                  <input
                    type="submit"
                    onClick={handleSubmit}
                    value="Update"
                    className="btn btn-primary"
                  />
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
