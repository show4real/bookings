import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister, faChartLine, faCloudUploadAlt, faObjectGroup, faPlus, faRocket, faTasks, faTruck, faUsers, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown, ButtonGroup } from '@themesberg/react-bootstrap';

import { CounterWidget, CircleChartWidget, BarChartWidget, TeamMembersWidget, ProgressTrackWidget, RankingWidget, SalesValueWidget, SalesValueWidgetPhone, AcquisitionWidget } from "../../components/Widgets";
import { getDashboardDetails } from '../../services/userService';
import SpinDiv from "../components/SpinDiv";
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import moment from "moment";
export class DashboardOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
     users:[],
     user_count:0,
     game_count:0,
     fromdate: moment().startOf('month'),
     todate: moment().endOf('day'),
     total_sales:0,
     total_purchases:0,
     user:JSON.parse(localStorage.getItem('user'))

    
    };
    

  }
  componentDidMount(){
    this.getDashboardDetails();
  }
  logOut = () =>{ 
    localStorage.removeItem("user");
   localStorage.removeItem('token');
   localStorage.clear();
   let path = '/auth/sign-in'; 
   this.props.history.push(path);

 }

 getDashboardDetails = () => {


  this.setState({ loading: true });
 const {fromdate, todate}= this.state;
  getDashboardDetails({fromdate, todate}).then(
   
    (res) => {
      console.log(res)
      this.setState({
        loading: false,
        user_count: res.user_count,
        game_count: res.game_count,
        total_sales:res.total_sales,
      });
    },
    (error) => {
      this.setState({ loading: false, });
    }
  );
};
formatCurrency(x){
  if(x!==null && x!==0 && x!== undefined){
    const parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `\u20a6${parts.join(".")}`;
  }
  return '0';
}

  render() {
    const {loading, user_count, user,fromdate, todate, game_count, total_sales}= this.state;
    return (
      <>
        {loading && <SpinDiv text={"Loading..."} />}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
       


       <ButtonGroup>
         <Button variant="outline-danger"  onClick={() => this.logOut()} size="sm">Sign Out</Button>
         {/* <Button variant="outline-primary" size="sm">Export</Button> */}
       </ButtonGroup>
     </div>
       
  
        <Row className="justify-content-md-center">
         
          <Col xs={12} sm={6} xl={4} className="mb-4">
            <CounterWidget
              category="Users"
              title={user_count}
              icon={faUsers}
              iconColor="shape-secondary"
            />
          </Col>
          
  
          <Col xs={12} sm={6} xl={4} className="mb-4">
            <CounterWidget
              category="Games / Refreshments"
              title={game_count}
              percentage={28.4}
              icon={faProductHunt}
              iconColor="shape-tertiary"
            />
          </Col>
          {user.admin == 1 && <>
            
          <Col xs={12} sm={6} xl={4} className="mb-4">
            <CounterWidget
              category="Sales"
              title={this.formatCurrency(total_sales)}
            
              icon={faCashRegister}
              iconColor="shape-tertiary"
            />
          </Col>

          </>}
         
        </Row>
  
        
      </>
    );
  
  }
}

export default DashboardOverview
