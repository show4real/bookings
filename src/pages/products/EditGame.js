import React, { Component } from "react";
import { CardHeader, Media, Input, Modal } from "reactstrap";
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
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import SpinDiv from "../components/SpinDiv";
import { toast } from "react-toastify";
import { editGame } from "../../services/productService";

export class EditGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
        game: props.editGame,
        loading: false,
        search: '',
        validation: {},
        name: ''
    };
  }

  componentDidMount() {
    toast.configure({hideProgressBar: true, closeButton: false});
    //this.filter()
  }

  onSaveGame = async (e) => {
    e.preventDefault();
    await toast.dismiss();
    const {game, validation} = this.state;
    const {name, price} = game;
    await this.setState({
      validation: {
        ...validation,
        name: name!=='',
        price: price!==''

      }
    })
    if(Object.values(this.state.validation).every(Boolean)){
      this.updateGame();
    } else {
      const errors = Object.keys(this.state.validation).filter((id) => {
        return !this.state.validation[id]
      })
      //await toast.configure({hideProgressBar: true, closeButton: false});
      await setTimeout(()=>toast.error(
        <div style={{padding:'10px 20px'}}>
          <p style={{margin: 0, fontWeight: 'bold'}}>Errors:</p>
          {errors.map(v => (
            <p key={v} style={{margin: 0, fontSize: 14}}>* {this.validationRules(v)}</p>
          ))}
        </div>
      ), 250);
    }
  }

  validationRules = field => {
    if(field==='name'){
      return 'Name is required';
    } else if( field === 'game'){
        return 'Price is required';
    }
  }

  updateGame = () => {
    this.setState({loading: true});
    const {name, price, id} = this.state.game;
    editGame({name, price, id})
      .then(res => {
          console.log(res)
          this.setState({loading: false});
          this.props.saved();
          this.props.toggle();
          this.showToast('Game Updated')
      },
        error => {
            console.log(error)
        if(error.name){
          toast.error('A Game with this name already exists')
        }
        this.setState({loading: false});
        });
  }

  showToast = msg => {
    toast(<div style={{padding:20, color:"green"}}>{msg}</div>);
  }

  onChange = (e, state) => {
    const {game} = this.state
    this.setState({game: {...game, [state]: e}})
  }


  
  render() {
    const { editGame, toggle } = this.props;

    const { saving, loading, game } = this.state;
    return (
      <>
        <Modal
          className="modal-dialog modal-dialog-centered"
          isOpen={editGame != null}
          toggle={() => !loading && !saving && toggle}
        >
          {loading && <SpinDiv text={"Saving..."} />}
          <div className="modal-header" style={{ padding: "1rem" }}>
            <div className="btn-toolbar mb-2 mb-md-0">
              <ButtonGroup>
                <Button variant="outline-primary" size="sm">
                  Edit Game
                </Button>
              </ButtonGroup>
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
              <Col md={12} className="mb-3">
                  <Form.Group id="name">
                    <Form.Label> Name</Form.Label>
                    <Form.Control  value={game.name||''} required type="text"  onChange={async (e) => {
                        await this.onChange(e.target.value, "name");
                      }} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
              <Col md={12} className="mb-3">
                  <Form.Group id="price">
                    <Form.Label> Price</Form.Label>
                    <Form.Control  value={game.price||''} required type="text"  onChange={async (e) => {
                        await this.onChange(e.target.value, "price");
                      }} />
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

export default EditGame;
