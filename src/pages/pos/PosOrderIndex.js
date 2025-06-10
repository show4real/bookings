import React, { Component, createRef } from "react";
import { Input, Media } from "reactstrap";
import { toast } from "react-toastify";
import {
  Col,
  Row,
  Card,
  Table,
  Button,
  ButtonGroup,
  Breadcrumb,
  Form,
  InputGroup,
} from "@themesberg/react-bootstrap";
import { throttle, debounce } from "../debounce";
import { addSales } from "../../services/posOrderService";
import ReactToPrint from "react-to-print";
import { Invoice } from "./Invoice";
import { Select, Spin } from "antd";
import { getGames } from "../../services/stockService";
import { getCompany } from "../../services/companyService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { InputNumber } from "antd";

const { Option } = Select;

export class PosOrderIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      search_client: "",
      loading: false,
      saving: false,
      bookings: [],
      games:[],
      total_cost: 0,
      invoice_no: "",
      total: 0,
      total_cart: 0,
      close: false,
      cartItem: [],
      payment_mode: "",
      amount_paid: 0,
      total_purchase: 0,
      user: JSON.parse(localStorage.getItem("user")),
      company: {},
      transactions: {},
      bookings: [],
      loading: false,
    };

    this.searchDebounced = debounce(this.getGames, 500);
    this.searchThrottled = throttle(this.getGames, 500);
    this.componentRef = createRef();
  }

  componentDidMount() {
    this.getGames();
    this.getCompany();

    const savedCartItem = JSON.parse(localStorage.getItem("cartItem")) || [];
    this.setState({ cartItem: savedCartItem });
  }



  getCompany = () => {
   
    this.setState({ loading: true });
    getCompany().then(
      (res) => {
        this.setState({
          loading: false,
          company: res.company,
        });
      },
      (error) => {
        this.setState({ loading: false });
      }
    );
  };

  onChange = (e, state) => {
    this.setState({ [state]: e });
  };

  incrementCount(item, index) {
    
    const items = this.state.cartItem;
    item.quantity = Number(item.quantity) + 1;
    console.log(item.quantity);
    
    items.splice(index, 1, item);

    this.setState({ cartItem: items }, this.updateCartItemInLocalStorage);
  }

  decrementCount(item, index) {
    
    const items = this.state.cartItem;
    if (item.quantity > 1) {
      item.quantity -= 1;
    }
    items.splice(index, 1, item);
    this.setState({ cartItem: items }, this.updateCartItemInLocalStorage);
  }

  showToastError = (msg) => {
    toast(<div style={{ padding: 20, color: "red" }}>*{msg}</div>);
  };

  onSaveSales = async (e) => {
    e.preventDefault();
    await toast.dismiss();
    const { cartItem, payment_mode } =
      this.state;

    let check_quantity =
      cartItem.some((ele) => ele.quantity === 0) ||
      cartItem.some((ele) => ele.quantity === undefined);

    toast.dismiss();
    toast.configure({ hideProgressBar: true, closeButton: false });

    if (check_quantity) {
      this.showToastError("Please Select Quantity");
    } else if (payment_mode == "") {
      this.showToastError("Please Add Payment Mode");
    } else {
      this.saveSales();
    }
  };

  removeFromCart(index) {
    const list = this.state.cartItem;

    list.splice(index, 1);
    this.setState({ cartItem: list }, this.updateCartItemInLocalStorage);
  }

  saveSales = () => {
    this.setState({ loading: true, saving: true });

    const {
      cartItem,
      payment_mode,
    } = this.state;
    addSales({
      bookings: cartItem,
      payment_mode: payment_mode,
    }).then(
      (res) => {
        this.setState({ loading: false, saving: false });
        console.log(res);

        this.setState({
          bookings: res.bookings,
          bookings: res.bookings,
          transactions:res.transaction,
          cartItem: [],
        });
        this.showToast("Bookings has been created");
        localStorage.removeItem("cartItem");
      },
      (error) => {
        console.log(error);
        this.setState({ loading: false, saving:false });
      }
    );
  };

  showToast = (msg) => {
    toast(<div style={{ padding: 20 }}>{msg}</div>);
  };

  selectQuantity = (quantity) => {
    let text = [];
    for (let i = 1; i <= quantity.length; i++) {
      text.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }
    return text;
  };

  totalCartP() {
    const { cartItem } = this.state;
    let sum = 0;
    
    for (let i = 0; i < cartItem.length; i += 1) {
      sum +=
        cartItem[i].quantity !== 0
          ? cartItem[i].quantity * cartItem[i].price
          : 0 * cartItem[i].price;
    }
    return this.formatCurrency(sum);
  }

  clearCart() {
    this.setState({
      cartItem: [],
      bookings: [],
    });
    this.getGames();
    localStorage.removeItem("cartItem");
  }

  showToast = (msg) => {
    toast(<div style={{ padding: 20, color: "success" }}>{msg}</div>);
  };

  onPage = async (page, rows) => {
    await this.setState({ page, rows });
    await this.getGames();
  };
  getGames = () => {
    const { search } = this.state;
    this.setState({ loading: true });
    getGames({ search }).then(
      (res) => {
        console.log(res);
        this.setState({
          loading: false,
          games: res.games,
          total_cost: 0,
          total: res.games.length
        });
      },
      (error) => {
        this.setState({ loading: false });
      }
    );
  };

  toggleFilter = () => {
    this.setState({ showFilter: !this.state.showFilter });
  };
  sleep = (ms) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });

  updateCartItemInLocalStorage = () => {
    localStorage.setItem("cartItem", JSON.stringify(this.state.cartItem));
  };

  toggleAddToCart = (addToCart) => {
    var items = this.state.cartItem === null ? [] : [...this.state.cartItem];

    var item = items.find((item) => item.id === addToCart.id);

    if (item) {
      item.quantity += 1;
    } else {
      items.push(addToCart);
    }
    this.setState({ cartItem: items }, this.updateCartItemInLocalStorage);
  };

  inCart = (cartId) => {
    let inCartIds = this.state.cartItem;

    if (inCartIds !== null) {
      var result = inCartIds.map((product, key) => {
        return product.id;
      });
      let validateId = result.includes(cartId);

      return validateId;
    } else {
      return false;
    }
  };

  totalCart() {
    if (this.state.cartItem !== null) {
      let total_cart = this.state.cartItem.reduce(function (sum, item) {
        return (sum = sum + item.quantity);
      }, 0);
      return total_cart;
    } else {
      return 0;
    }
  }

  formatCurrency(x) {
    if (x !== null && x !== 0) {
      const parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `\u20a6${parts.join(".")}`;
    }
    return 0;
  }

  handleSearch = (event) => {
    this.setState({ search: event.target.value }, () => {
      if (this.state.search < 5) {
        this.searchThrottled(this.state.search);
      } else {
        this.searchDebounced(this.state.search);
      }
    });
  };

  handlePriceChange = (event, index) => {
    const newPrice = parseFloat(event.target.value) || 0;
    const updatedCartItems = [...this.state.cartItem];

    updatedCartItems[index].price = newPrice;

    this.setState(
      { cartItem: updatedCartItems },
      this.updateCartItemInLocalStorage
    );
  };

  invoiceRef = createRef();

  render() {
    const {
      games,
      company,
      payment_mode,
      total,
      cartItem,
      transactions,
      search,
      bookings,
      user,
      saving,
      loading,
    } = this.state;
    return (
      <>
       

       <div>
        
        {/* Hidden but printable */}
        <div style={{ display: 'none' }}>
          <Invoice
            ref={this.invoiceRef}
            company={company}
            transactions={transactions}
            bookings={bookings}
          />
        </div>
      </div>

        

        {/* {loading && <SpinDiv text={"Loading..."} />} */}
        <div style={{ margin: 10 }}>
          <Row>
            <Col lg="12">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-md-0">
                  <Breadcrumb
                    listProps={{
                      className: " breadcrumb-text-dark text-primary",
                    }}
                  >
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href="#">Book</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="7">
              <h6>Games({total})</h6>
            </Col>
          </Row>
          <Row></Row>

          <Card border="light" className="shadow-sm mb-4">
            <Row>
              <Col md={8}>
                <Row>
                  <Col md="5" className="">
                    <div style={{ display: "flex" }}>
                      <Input
                        placeholder="Search..."
                        id="show"
                        style={{
                          maxHeight: 45,
                          marginRight: 5,
                          marginBottom: 10,
                        }}
                        value={search}
                        onChange={this.handleSearch}
                        autoFocus
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col md={4} style={{ color: "primary", paddingTop: "15px" }}>
                <div className="btn-toolbar mb-2 mb-md-0">
                  <ButtonGroup>
                    {cartItem !== null ? (
                      <div>
                        <Button variant="outline-success" size="sm">
                          Cart({cartItem.length})
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            this.clearCart();
                          }}
                        >
                          Clear Cart
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline-success"
                        onClick={() => {
                          this.props.history.push("/pos_sales");
                        }}
                        size="sm"
                      >
                        View Sales
                      </Button>
                    )}
                    {bookings.length > 0 ? (
                      <ReactToPrint
                      trigger={() => {
                        return (
                          <Button
                            variant="outline-success"
                            href="#"
                            size="sm"
                          >
                            Print Invoice
                          </Button>
                        );
                      }}
                      content={() => this.invoiceRef.current}
                      pageStyle={`
                        @media print {
                          body {
                            font-family: monospace;
                            font-size: 12px;
                            width: 58mm;
                          }
                        }
                      `}
                    />
                      
                    ) : (
                      ""
                    )}
                  </ButtonGroup>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Card.Body className="pb-0">
                  <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                    <Table
                      responsive
                      className="table-centered table-nowrap rounded mb-0"
                    >
                      <thead className="thead-light">
                        <tr>
                          <th className="border-0">Description</th>

                          <th className="border-0">Price</th>
                          <th className="border-0">Action</th>
                          {/* <th className="border-0">Stock Order ID</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {games
                          .map((game, key) => {
                            const alreadyAdded = this.inCart(game.id);

                            return (
                              <tr key={key}>
                                <td>
                                  <span style={{ fontWeight: "bold" }}>
                                    {game.name + " "}
                                  </span>
                                  
                                </td>

                                <td>
                                  <span style={{ fontWeight: "bold" }}>
                                    {" "}
                                    {this.formatCurrency(
                                      game.price
                                    )}{" "}
                                  </span>
                                </td>

                                <td>
                                  { alreadyAdded === false ? (
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() =>
                                        this.toggleAddToCart(game)
                                      }
                                    >
                                      <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                  ) : (
                                    <Button color="primary" size="sm" disabled>
                                      <FontAwesomeIcon icon={faCheck} />
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                  
                </Card.Body>
              </Col>
              <Col md={6}>
                <Card.Body className="pb-0">
                  <div className="modal-header" style={{ padding: "1rem" }}>
                    <div className="btn-toolbar mb-2 mb-md-0">
                      <ButtonGroup>
                        {cartItem.length > 0 ? (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            style={{ fontSize: 22, fontWeight: "bold" }}
                          >
                            Total: {this.totalCartP()}
                          </Button>
                        ) : (
                          ""
                        )}
                      </ButtonGroup>
                    </div>
                  </div>

                  {bookings.length == 0 ? (
                    <>
                      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                        <Table responsive className="table-nowrap rounded mb-0">
                          <thead className="thead-light">
                            <tr>
                              <th className="border-0">Game</th>
                              <th className="border-0">Price</th>

                              <th className="border-0">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cartItem.map((sale, key) => {
                              const alreadyAdded = this.inCart(sale.id);
                              return (
                                <tr>
                                  <td>
                                    <Media className="align-items-center">
                                      <span
                                        className="mb-0 text-sm"
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: 15,
                                          paddingLeft: 5,
                                        }}
                                      >
                                        {sale.name +
                                          ` X ${sale.quantity}`}
                                        <br />
                                      </span>
                                      <Button
                                        size="xs"
                                        style={{
                                          marginLeft: "60px",
                                          backgroundColor: "white",
                                          color: "red",
                                          borderColor: "red",
                                          marginLeft: 10,
                                        }}
                                        onClick={() => this.removeFromCart(key)}
                                      >
                                        <i className="fa fa-trash" />
                                      </Button>
                                      &nbsp; &nbsp; &nbsp; &nbsp;
                                      <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() =>
                                          this.decrementCount(sale, key)
                                        }
                                      >
                                        -
                                      </Button>
                                      <span style={{ padding: "10px" }}>
                                        {sale.quantity}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() =>
                                          this.incrementCount(sale, key)
                                        }
                                      >
                                        +
                                      </Button>
                                    </Media>
                                  </td>

                                  <td>
                                    <input
                                      style={{
                                        width: 100,
                                        height: 40,
                                        paddingTop: 5,
                                        borderRadius: 5,
                                        fontSize: 18,
                                      }}
                                      disabled
                                      onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                          event.preventDefault();
                                        }
                                      }}
                                      parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, "")
                                      }
                                      value={sale.price}
                                      onChange={(event) =>
                                        this.handlePriceChange(event, key)
                                      }
                                    />
                                  </td>

                                  <td>
                                    {sale.quantity *
                                      sale.price}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                      <div>
                        <Table style={{ border: "none" }}>
                          <tr>
                            <Row
                              style={{
                                // border: "1px #eee solid",
                                padding: "10px 5px 0px",
                                margin: "20px 15px",
                                borderRadius: 7,
                              }}
                            >
                              
                              
                              <Col md={4}>
                                <Form.Group>
                                  <Form.Label>Mode of payment</Form.Label>

                                  <Form.Select
                                    required
                                    name="payment_mode"
                                    value={payment_mode}
                                    onChange={(e) =>
                                      this.onChange(
                                        e.target.value,
                                        "payment_mode"
                                      )
                                    }
                                    style={{
                                      marginRight: 10,
                                      width: "100%",
                                    }}
                                  >
                                    <option value="">
                                      Select payment mode
                                    </option>
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="transfer">Transfer</option>
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                            </Row>
                          </tr>
                          <tr>
                            {cartItem.length > 0 && (
                              <Row
                                style={{
                                  // border: "1px #eee solid",
                                  padding: "10px 5px 0px",
                                  margin: "10px 15px",
                                  borderRadius: 7,
                                }}
                              >
                                
                                <Col md={10}></Col>
                                <Col md={2}>
                                  <div style={{ paddingTop: 30 }}>
                                    {cartItem.length > 0 ? (
                                      <div>
                                        <Button
                                          variant="outline-primary"
                                          type="submit"
                                          disabled={saving}
                                          onClick={this.onSaveSales}
                                        >
                                          Submit
                                        </Button>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            )}
                          </tr>
                        </Table>
                      </div>
                    </>
                  ) : (
                    <Row>
                      <Col md={2}></Col>
                      <Col md={8}>
                        <h5>
                          Sales has been completed, Print Invoice by clicking on
                          the Button above
                        </h5>
                      </Col>
                      <Col md={2}></Col>
                    </Row>
                  )}
                </Card.Body>
              </Col>
            </Row>
            <Row></Row>
          </Card>
        </div>
      </>
    );
  }
}

export default PosOrderIndex;
