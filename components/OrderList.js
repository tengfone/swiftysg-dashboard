import Order from "./Order";
import { useState } from "react";
import axios from "axios";

const OrderList = ({ orders, setRequestData }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");

  const deleteRecord = (e, _id) => {
    e.stopPropagation();
    const answer = window.confirm("Would you like to delete record?");
    if (answer) {
      axios
        .delete(
          "https://swiftys-server.glitch.me/api/orders/deleteOrder/" + _id
        )
        .then((res) => {
          setRequestData(new Date());
          setAlert("Record deleted successfully");
          setShowAlert(true);
          setTimeout(function () {
            setShowAlert(false);
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const verifyRecord = (e, _id) => {
    e.stopPropagation();
    const answer = window.confirm("Would you like to verify record?");
    if (answer) {
      // approve
      axios
        .post("https://swiftys-server.glitch.me/api/orders/verifyOrder/" + _id)
        .then((res) => {
          setRequestData(new Date());
          setAlert("Record verified successfully");
          setShowAlert(true);
          setTimeout(function () {
            setShowAlert(false);
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="blog-list">
      {showAlert && (
        <div className="alert alert-primary" role="alert">
          {alert}
        </div>
      )}
      <table className="table table-hover">
        <thead className="thead-light">
          <tr>
            <th>Order ID</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Promo</th>
            <th>Total Cost</th>
            <th>Delivery Option</th>
            <th>Datetime Purchased</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <Order
              order={order}
              key={order._id}
              deleteRecord={deleteRecord}
              verifyRecord={verifyRecord}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
