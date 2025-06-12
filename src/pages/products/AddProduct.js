import React, { Component } from "react";
import SpinDiv from "../components/SpinDiv";
import { toast } from "react-toastify";
import { addGame } from "../../services/productService";
import {
  Col,
  Row,
  Card,
  Form,
  Button,

} from "@themesberg/react-bootstrap";
import {  Modal } from "reactstrap";

export class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      loading: false,
      name: "",
      price: "",
    };
  }
  onChange = (e, state) => {
    this.setState({ [state]: e });
  };

  componentDidMount() {
   
  }

  onSaveGame = async (e) => {
    e.preventDefault();
    await toast.dismiss();
    const { name, price,validation } =
      this.state;
    await this.setState({
      validation: {
        ...validation,
        name: name !== "",
        price: price !== "",
      
      },
    });
    if (Object.values(this.state.validation).every(Boolean)) {
      this.saveGame();
    } else {
      const errors = Object.keys(this.state.validation).filter((id) => {
        return !this.state.validation[id];
      });
      //await toast.configure({hideProgressBar: true, closeButton: false});
      toast.dismiss();
      toast.configure({ hideProgressBar: true, closeButton: false });
      toast(
        <div style={{ padding: "10px 20px" }}>
          <p style={{ margin: 0, fontWeight: "bold", color: "red" }}>Errors:</p>
          {errors.map((v) => (
            <p key={v} style={{ margin: 0, fontSize: 14, color: "red" }}>
              * {this.validationRules(v)}
            </p>
          ))}
        </div>
      );
    }
  };
  

  validationRules = (field) => {
   
    if (field === "name") {
      return "Name field is required";
    } else if (field === "price") {
      return "Price is required";
    } 
  };

  saveGame = () => {
    this.setState({ loading: true });
    const { price, name } = this.state;
    console.log();
    addGame({
      name: name,
      price: price,
      
    })
      .then((res) => {
        console.log(res);
        this.setState({ loading: false });
        this.props.toggle();
        this.props.saved();
        this.showToast("Game saved");
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          errorMessage: err,
          show: true,
        });
        if (this.state.errorMessage) {
          this.showToast(this.state.errorMessage);
        }
        this.setState({ saving: false });
      });
  };

  showToast = (msg) => {
    toast(<div style={{ padding: 20 }}>{msg}</div>);
  };

  render() {
    const { addGame, toggle } = this.props;
    const {
      name,
      price,
      saving,
      loading
    } = this.state;
    return (
      <>
        <Modal
          className="modal-dialog modal-dialog-centered"
          isOpen={addGame}
          toggle={() => !loading && toggle}
        >
          {loading && <SpinDiv text={"Saving..."} />}
          <div className="modal-header" style={{ padding: "1rem" }}>
            <div className="btn-toolbar mb-2 mb-md-0">
              <h5> Create Game / Refreshments </h5>
            </div>

            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={toggle}
            ></button>
          </div>
          <Card border="light" className="shadow-sm mb-4">
            <Card.Body className="pb-0">
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group id="firstName">
                    <Form.Label> Name</Form.Label>
                    <Form.Control
                      value={name}
                      required
                      type="text"
                      onChange={async (e) => {
                        await this.onChange(e.target.value, "name");
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group id="lastName">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      required
                      type="number"
                      onChange={async (e) => {
                        await this.onChange(e.target.value, "price");
                      }}
                      value={price}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              

              <Row style={{ marginTop: "10px" }}>
                <Col md={12}>
                  <div>
                    <Button
                      variant="primary"
                      size="sm"
                      style={{ marginTop: "10px", float: "right" }}
                      disabled={saving}
                      onClick={this.onSaveGame}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="transparent"
                      data-dismiss="modal"
                      type="button"
                      disabled={saving}
                      style={{ marginTop: "10px", float: "right" }}
                      onClick={toggle}
                    >
                      {" "}
                      Close
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal>
      </>
    );
  }
}

export default AddProduct;
