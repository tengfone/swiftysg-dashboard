import { useRouter } from "next/dist/client/router";
import { FaCheck, FaPencilAlt, FaTrashAlt } from "react-icons/fa";

const Order = ({ order, deleteRecord, verifyRecord }) => {
  const history = useRouter();

  const handleRowClick = () => {
    history.push(`/dashboard/invoice/${order.orderId}`);
  };

  const convertDatetime = (dt) => {
    const d = new Date(dt);
    return d.toLocaleString();
  };

  const editRecord = (e) => {
    e.stopPropagation();
    history.push(`/dashboard/record/${order.orderId}`);
  };

  return (
    <tr onClick={handleRowClick}>
      <td className="col-md-1">{order.orderId}</td>
      <td className="col-md-1">{order.address.name}</td>
      <td className="col-md-1">{order.address.phone}</td>
      <td className="col-md-1">{order.usedPromoCode}</td>
      <td className="col-md-1">${order.totalCost.toFixed(2)}</td>
      <td className="col-md-1">{`${order.deliveryOption.split(",")[0]}, ${
        order.address.hall
      }`}</td>
      <td className="col-md-1">
        {convertDatetime(order.date.toLocaleString())}
      </td>
      <td className="col-md-1">
        {order.verified && (
          <span className="badge rounded-pill bg-success">verified</span>
        )}
        {order.modified ? (
          <span className="badge rounded-pill bg-warning">modified</span>
        ) : null}
      </td>
      <td className="col-md-1">
        <button
          type="button"
          className="btn btn-success"
          onClick={(e) => verifyRecord(e, order._id)}
        >
          {" "}
          <FaCheck />
        </button>
        <button type="button" className="btn btn-warning" onClick={editRecord}>
          {" "}
          <FaPencilAlt />
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={(e) => {
            deleteRecord(e, order._id);
          }}
        >
          {" "}
          <FaTrashAlt />
        </button>
      </td>
    </tr>
  );
};

export default Order;
