import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useSession, getSession } from "next-auth/client";
import { useState, useEffect } from "react";
import OrderList from "../../components/OrderList";
import axios from "axios";

function IndexPage() {
  // Redirect away if NOT auth
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [session, loading] = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState(null);
  const [requestData, setRequestData] = useState(new Date());

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        window.location.href = "/";
      } else {
        setIsAuthLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    axios
      .get("https://swiftys-server.glitch.me/api/orders/getOrders")
      .then((res) => {
        setOrders(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [requestData]);

  if (isAuthLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="home">
        <div className="loader" hidden={!isLoading}></div>
        {orders && (
          <OrderList orders={orders} setRequestData={setRequestData} />
        )}
      </div>
    </div>
  );
}

export default IndexPage;
