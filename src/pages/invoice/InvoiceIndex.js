import React, { Component } from "react";
import { Input } from "reactstrap";
import {
  Col,
  Row,
  Card,
  Table,
  Button,
  ButtonGroup,
  Breadcrumb,
  Form,
} from "@themesberg/react-bootstrap";
import { getBookings, deleteBooking } from "../../services/invoiceService";
import SpinDiv from "../components/SpinDiv";
import "antd/dist/antd.css";
import { Pagination } from "antd";
import moment from "moment";
import ReactDatetime from "react-datetime";
import { debounce, throttle } from "lodash";


export class InvoiceIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      page: 1,
      rows: 10,
      loading: false,
      company: JSON.parse(localStorage.getItem("company") || "{}"),
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      bookings: [],
      order: "",
      cashier_id: "",
      cashiers: [],
      total_sales: "",
      total: 0,
      fromdate: moment().startOf("month"),
      todate: moment().endOf("day"),
    };

    this.searchDebounced = debounce(this.performSearch, 500);
    this.searchThrottled = throttle(this.performSearch, 200);
  }

  componentDidMount() {
    this.getBookings();
  }

  getBookings = async () => {
    const {
      page,
      rows,
      search,
      cashier_id,
      fromdate,
      todate,
    } = this.state;

    this.setState({ loading: true });

    try {
      const res = await getBookings({
        page,
        rows,
        search,
        cashier_id,
        fromdate,
        todate,
      });

      this.setState({
        bookings: res.bookings.data,
        page: res.bookings.current_page,
        total: res.bookings.total,
        total_sales: res.total_sales,
        cashiers: res.cashiers,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      this.setState({ loading: false });
    }
  };

  performSearch = (searchTerm) => {
    this.setState({ search: searchTerm, page: 1 }, () => {
      this.getBookings();
    });
  };

  onFilter = async (e, filter) => {
    await this.setState({ [filter]: e, page: 1 });
    await this.getBookings();
  };

  onChange = (e, state) => {
    this.setState({ [state]: e });
  };

  onPage = async (page, rows) => {
    await this.setState({ page, rows });
    await this.getBookings();
  };

  handleSearch = (event) => {
    const searchValue = event.target.value;
    this.setState({ search: searchValue });

    if (searchValue.length < 5) {
      this.searchThrottled(searchValue);
    } else {
      this.searchDebounced(searchValue);
    }
  };

  handleCashierChange = (event) => {
    const cashierId = event.target.value;
    this.onFilter(cashierId, "cashier_id");
  };

  formatCurrency = (x) => {
    if (x !== null && x !== 0 && x !== undefined) {
      const parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `₦${parts.join(".")}`;
    }
    return "₦0";
  };

  handleDelete = async (bookingId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;

    try {
      await deleteBooking(bookingId); // This should be defined in your invoiceService
      this.getBookings(); // Refresh list after deletion
    } catch (error) {
      console.error("Failed to delete booking:", error);
      alert("Error deleting booking.");
    }
  };

  render() {
    const {
      todate,
      fromdate,
      total_sales,
      bookings,
      total,
      page,
      rows,
      search,
      loading,
      cashiers,
      cashier_id,
      user,
    } = this.state;

    return (
      <>
        {loading && <SpinDiv text={"Loading..."} />}

        <Row>
          <Col lg="12">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
              <div className="d-block mb-4 mb-md-0">
                <Breadcrumb
                  listProps={{
                    className: "breadcrumb-text-dark text-primary",
                  }}
                >
                  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                  <Breadcrumb.Item href="#Bookings">Bookings</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md="2">
            <h5 className="mb-0">
              Bookings
              <span style={{ color: "#aaa", fontSize: 14, fontWeight: "normal" }}>
                {" "}({total})
              </span>
            </h5>
          </Col>
          <Col md={3}>
            <ReactDatetime
              value={fromdate}
              dateFormat={"MMM D, YYYY"}
              closeOnSelect
              onChange={(e) => this.onFilter(e, "fromdate")}
              inputProps={{
                required: true,
                className: "form-control date-filter",
              }}
              isValidDate={(current) => {
                return (current.isBefore(todate) || current.isSame(todate)) && current.isBefore(moment());
              }}
              timeFormat={false}
            />
          </Col>

          <Col md={3}>
            <ReactDatetime
              value={todate}
              dateFormat={"MMM D, YYYY"}
              closeOnSelect
              onChange={(e) => this.onFilter(e, "todate")}
              inputProps={{
                required: true,
                className: "form-control date-filter",
              }}
              isValidDate={(current) => {
                return (current.isAfter(fromdate) || current.isSame(fromdate)) && current.isBefore(moment());
              }}
              timeFormat={false}
            />
          </Col>

          <Col md="4">
            <div style={{ display: "flex" }}>
              <Input
                placeholder="Search..."
                autoFocus
                id="show"
                value={search}
                style={{ maxHeight: 45, marginRight: 5, marginBottom: 10 }}
                onChange={this.handleSearch}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <h5 style={{ fontWeight: "bold" }}>
              Total Sales: {this.formatCurrency(total_sales)}
            </h5>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Filter by Cashier</Form.Label>
              <Form.Select
                value={cashier_id}
                onChange={this.handleCashierChange}
                className="form-control"
              >
                <option value="">All Cashiers</option>
                {cashiers.map((cashier) => (
                  <option key={cashier.id} value={cashier.id}>
                    {cashier.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Card border="light" className="shadow-sm mb-4">
          <Card.Body className="pb-0">
            <Table
              responsive
              className="table-centered table-nowrap rounded mb-0"
            >
              <thead className="thead-light">
                <tr>
                  <th className="border-0">Invoice No</th>
                  <th className="border-0">Channel</th>
                  <th className="border-0">Cashier</th>
                  <th className="border-0">Total Sales</th>
                  <th className="border-0">Issue Date</th>
                  <th className="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, key) => (
                  <tr key={booking.id || key} style={{ fontWeight: "bold" }}>
                    <td>{booking.session_id}</td>
                    <td>{booking.payment_mode}</td>
                    <td>{booking.cashier}</td>
                    <td>{this.formatCurrency(booking.total_price)}</td>
                    <td>
                      {moment(booking.created_at).format("MMM DD YYYY h:mm A")}
                    </td>
                    <td>
                      <ButtonGroup>
                        <Button
                          variant="outline-primary"
                          onClick={() =>
                            this.props.history.push("/invoice/" + booking.id)
                          }
                          size="sm"
                        >
                          View
                        </Button>
                        {user.admin === 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => this.handleDelete(booking.session_id)}
                            className="ms-2"
                          >
                            Delete
                          </Button>
                        )}
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Row>
              <Col md={12} style={{ fontWeight: "bold", paddingTop: 3 }}>
                {bookings.length > 0 && (
                  <Pagination
                    showSizeChanger
                    defaultCurrent={1}
                    total={total}
                    showTotal={(total) => `Total ${total} Bookings`}
                    onChange={this.onPage}
                    pageSize={rows}
                    current={page}
                  />
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default InvoiceIndex;