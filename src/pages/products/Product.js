import React, { Component } from "react";

import {
  Col,
  Row,
  Nav,
  Card,
  Table,
  Form,
  Button,
  ButtonGroup,
  Breadcrumb,
  InputGroup,
  Dropdown,
} from "@themesberg/react-bootstrap";
import {deleteGame, getGames } from "../../services/productService";
import SpinDiv from "../components/SpinDiv";
import AddProduct from "./AddProduct";
import "antd/dist/antd.css";
import DeleteProduct from "./DeleteProduct";
import EditGame from "./EditGame";

export class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      games: [],
      total: 0,
    };
  }

  componentDidMount() {
    this.searchProducts()
  }

  searchProducts = () => {
    this.setState({ loading: false });
    getGames({}).then(
      (res) => {
        this.setState({
          games: res.games,
          total: res.games.length,
          loading: false,
        });
      },
      (error) => {
        this.setState({ loading: false });
      }
    );
  };

  toggleAddGames = () => {
    console.log("show")
    this.setState({ addGame: !this.state.addGame });
  };

  toggleDeleteGame = (deleteP) => {
    this.setState({ deleteP });
  };

  toggleEditGame = (editGame) => {
    this.setState({ editGame });
  };

  onChange = (e, state) => {
    this.setState({ [state]: e });
  };

  render() {
    const { games, total, addGame, editGame, deleteP, loading } = this.state;
    return (
      <>
        {addGame && (
          <AddProduct
            saved={this.searchProducts}
            addGame={addGame}
            toggle={() => this.setState({ addGame: null })}
          />
        )}

        {editGame && (
          <EditGame
            saved={this.searchProducts}
            editGame={editGame}
            toggle={() => this.setState({ editGame: null })}
          />
        )}

        {deleteP && (
          <DeleteProduct
            saved={this.searchProducts}
            deleteP={deleteP}
            toggle={() => this.setState({ deleteP: null })}
          />
        )}

        {loading && <SpinDiv text={"Loading..."} />}

        <Row style={{}}>
          <Col lg="12">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
              <div className="d-block mb-4 mb-md-0">
                <Breadcrumb
                  listProps={{
                    className: " breadcrumb-text-dark text-primary",
                  }}
                >
                  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                  <Breadcrumb.Item href="#games">Refreshments & Play</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div className="btn-toolbar mb-2 mb-md-0">
                <ButtonGroup>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => this.toggleAddGames()}
                  >
                    Add Refreshments / Play
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg="6">
            <h6>Items({total})</h6>
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
                  <th className="border-0">S/N</th>
                  <th className="border-0">Game/Refreshments</th>
                  <th className="border-0">Price</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game, key) => {
                  return (
                    <tr
                      key={key}
                      style={{
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      <td>{key + 1}</td>
                      <td>{game.name}</td>
                      <td>{game.price}</td>

                      <td>
                        <ButtonGroup>
                          <Button variant="outline-primary" size="sm" onClick={() => this.toggleEditGame(game)}>
                            Edit
                          </Button>
                          {/* <Button
                            variant="outline-danger"
                            onClick={() => {
                             
                              this.toggleDeleteGame(game);
                            }}
                            size="sm"
                          >
                            Delete
                          </Button> */}
                        </ButtonGroup>
                      </td>
                      <td></td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Row>
              <Col md={12} style={{ fontWeight: "bold", paddingTop: 3 }}>
                {games.length < 1 && (
                  <div
                    style={{
                      color: "#ccc",
                      alignSelf: "center",
                      padding: 10,
                      fontSize: 13,
                    }}
                  >
                    <i className="fa fa-ban" style={{ marginRight: 5 }} />
                    No Products
                  </div>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default Product;
