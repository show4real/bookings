import React, { Component, createRef } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  Breadcrumb,
  InputGroup
} from "@themesberg/react-bootstrap";
import { FormGroup, Input } from "reactstrap";
import {
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SpinDiv from "../components/SpinDiv";
import { toast } from "react-toastify";
import ReactDatetime from "react-datetime";
import moment from "moment";
import {
  getBooking,
} from "../../services/invoiceService";
import Invoice from "./Invoice";
import ReactToPrint from "react-to-print";

export class EditInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      bookings: [],
      transaction: {},
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      company: JSON.parse(localStorage.getItem("company") || "{}"),
      total_amount: 0,
      id: this.props.match?.params?.id || null, // Get ID from route params
    };

    this.componentRef = createRef();
    this.invoiceRef = createRef();
  }

  componentDidMount() {
    toast.configure({ hideProgressBar: true, closeButton: false });
    window.addEventListener("resize", this.resize.bind(this));
    this.getBooking();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }

  resize = () => {
    // Handle window resize if needed
  };

  getBooking = async () => {
    const { id } = this.state;
    
    if (!id) {
      toast.error("No booking ID provided");
      return;
    }

    this.setState({ loading: true });
    
    try {
      const res = await getBooking(id);
      this.setState({
        transaction: res.transaction || {},
        bookings: res.bookings || [],
        total_amount: res.transaction?.total_price || 0,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching booking:", error);
      toast.error("Failed to load booking details");
      this.setState({ loading: false });
    }
  };

  formatCurrency = (x) => {
    if (x !== null && x !== 0 && x !== undefined) {
      const parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `₦${parts.join(".")}`;
    }
    return "₦0";
  };

  calculateItemAmount = (rounds, price) => {
    const roundsNum = parseFloat(rounds) || 0;
    const priceNum = parseFloat(price) || 0;
    return roundsNum * priceNum;
  };

  render() {
    const {
      transaction,
      total_amount,
      bookings,
      loading,
      company,
    } = this.state;

    return (
      <>
        {loading && <SpinDiv text={"Loading..."} />}

        {/* Hidden printable invoice */}
        <div style={{ display: 'none' }}>
          <Invoice
            ref={this.invoiceRef}
            company={company}
            transactions={transaction}
            bookings={bookings}
          />
        </div>

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
                  <Breadcrumb.Item href="/Bookings">Bookings</Breadcrumb.Item>
                  <Breadcrumb.Item active>Invoice Details</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div className="btn-toolbar mb-2 mb-md-0">
                {Object.keys(transaction).length !== 0 && (
                  <ReactToPrint
                    trigger={() => (
                      <Button
                        variant="outline-success"
                        size="md"
                      >
                        Print Receipt
                      </Button>
                    )}
                    content={() => this.invoiceRef.current}
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>

        <Card border="light" className="shadow-sm mb-4">
          <Card.Body className="pb-0">
            {/* Transaction Summary */}
            <Row className="mb-4">
              <Col md={12}>
                <Row className="mb-3">
                  <Col md={4} style={{ fontSize: 15, fontWeight: "bold" }}>
                    Total: {this.formatCurrency(transaction.total_price)}
                  </Col>
                  <Col md={4}>
                    <span style={{ fontSize: 15, fontWeight: "bold" }}>
                      Cashier: {transaction.cashier || 'N/A'}
                    </span>
                  </Col>
                  
                </Row>

                {/* Transaction Details */}
                <Row
                  style={{
                    border: "1px #eee solid",
                    padding: "20px 15px",
                    margin: "15px 2px",
                    borderRadius: 7,
                  }}
                >
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Transaction No</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </InputGroup.Text>
                        <Input
                          type="text"
                          name="session_id"
                          disabled
                          value={transaction.session_id || ""}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Transaction Date</Form.Label>
                      <ReactDatetime
                        value={transaction.created_at ? 
                          moment(transaction.created_at).format("MMM DD, YYYY") : ""
                        }
                        disabled
                        dateFormat={"MMM D, YYYY"}
                        closeOnSelect
                        inputProps={{
                          required: true,
                          className: "form-control",
                        }}
                        timeFormat={false}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Payment Mode</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </InputGroup.Text>
                        <Input
                          type="text"
                          disabled
                          value={transaction.payment_mode || "N/A"}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Booking Items */}
            <Row
              style={{
                border: "1px #eee solid",
                padding: "20px 15px",
                margin: "15px 2px",
                borderRadius: 7,
              }}
            >
              <Col md={12}>
                <Form.Label style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
                  Booking Items ({bookings.length})
                </Form.Label>

                {bookings.length > 0 ? (
                  bookings.map((booking, key) => (
                    <div
                      key={booking.id || key}
                      style={{
                        border: "1px #ddd solid",
                        padding: "15px",
                        margin: "10px 0",
                        borderRadius: 5,
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <Row>
                        <Col md={3}>
                          <Form.Group className="mb-2">
                            <Form.Label>Item Name</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <FontAwesomeIcon icon={faPencilAlt} />
                              </InputGroup.Text>
                              <Input
                                type="text"
                                disabled
                                value={booking.name || `Item ${key + 1}`}
                                name="description"
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>

                        <Col md={2}>
                          <Form.Group className="mb-2">
                            <Form.Label>Rounds</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <FontAwesomeIcon icon={faPencilAlt} />
                              </InputGroup.Text>
                              <Input
                                type="text"
                                disabled
                                name="rounds"
                                value={booking.rounds || 0}
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>

                        <Col md={2}>
                          <Form.Group className="mb-2">
                            <Form.Label>Unit Price</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>₦</InputGroup.Text>
                              <Input
                                type="text"
                                disabled
                                value={this.formatCurrency(booking.price_per_round).replace('₦', '')}
                                name="price"
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>

                        <Col md={3}>
                          <Form.Group className="mb-2">
                            <Form.Label>Amount</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>₦</InputGroup.Text>
                              <Input
                                disabled
                                type="text"
                                value={this.formatCurrency(
                                  this.calculateItemAmount(booking.rounds, booking.price_per_round)
                                ).replace('₦', '')}
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>

                        
                      </Row>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">No booking items found</p>
                  </div>
                )}

                {/* Total Section */}
                <Row className="mt-4">
                  <Col md={8}></Col>
                  <Col md={4}>
                    <div
                      style={{
                        border: "2px #007bff solid",
                        padding: "15px",
                        borderRadius: 5,
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      <Row style={{ fontSize: 20, fontWeight: "bold" }}>
                        <Col md={12} className="text-center">
                          Total Amount: {this.formatCurrency(total_amount)}
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default EditInvoice;