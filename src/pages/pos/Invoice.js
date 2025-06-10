import React from "react";
import { Card, Table } from "@themesberg/react-bootstrap";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { toWords } from "../../services/numberWordService";

export class Invoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      company: props.company,
      transactions:props.transactions,
      user: props.user,
      loading: false,
      saving: false,
    };
  }

  getWords(amount) {
    return toWords(amount);
  }


  formatCurrency2(x) {
    if (x) {
      const parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `${parts.join(".")}`;
    }
    return "0";
  }

  formatCurrency(x) {
    return x.toLocaleString(undefined, { minimumFractionDigits: 2 });
  }

  render() {
    const { transactions, company, bookings } =
      this.props;
      console.log(bookings);
  
    return (
      <Card style={{ padding: "10px", width: "100%" }}>
       
          <div>
            <header
              style={{
                textAlign: "center",
                marginBottom: "10px",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              <h1 style={{ fontWeight: "bold" }}>{company?.name || ""}</h1>
              <div style={{ fontWeight: "bold" }}>
                <FontAwesomeIcon icon={faPhone} /> {company.phone_one},{" "}
                {company.phone_two}
              </div>
              <div style={{ fontWeight: "bold" }}>
                <FontAwesomeIcon icon={faGlobe} /> {company.website}
              </div>
            </header>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "20px",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              <div style={{ textAlign: "left", fontWeight: "bold" }}>
                Date: {moment(transactions.created_at).format("MMM DD YYYY, h:mm A")}
                <br />
                Transaction #: {transactions.session_id}
                <br />
                {company.address}
              </div>
             
            </div>

            <Table
              striped
              bordered
              hover
              style={{ marginBottom: "10px", fontSize: "20px" }}
            >
              <thead>
                <tr>
                  <th style={{ fontSize: "20px", fontWeight: "bold" }}>
                    Game
                  </th>
                  <th style={{ fontSize: "20px", fontWeight: "bold" }}>Rounds</th>
                  <th style={{ fontSize: "20px", fontWeight: "bold" }}>
                    Price
                  </th>
                  <th style={{ fontSize: "20px", fontWeight: "bold" }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        fontSize: "20px",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                      }}
                    >
                      {item.name}
                    </td>
                    <td style={{ fontSize: "20px", fontWeight: "bold" }}>
                      {item.rounds}
                    </td>
                    <td style={{ fontSize: "20px", fontWeight: "bold" }}>
                    &#8358;{this.formatCurrency(item.price_per_round)}
                    </td>
                    <td style={{ fontSize: "20px", fontWeight: "bold" }}>
                    &#8358;{this.formatCurrency(item.price_per_round * item.rounds)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div
              style={{
                fontWeight: "bold",
                fontSize: "22px",
                textAlign: "right",
                marginBottom: "10px",
              }}
            >
              Total: {}
              &#8358;{this.formatCurrency2(transactions.total_price)}
              <br />
             
            </div>

            <footer
              style={{
                fontSize: "20px",
                marginTop: "10px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              <div style={{ fontWeight: "bold" }}>
                {company?.invoice_footer_one}
              </div>
              <div style={{ fontWeight: "bold" }}>
                {company?.invoice_footer_two}
              </div>
              <div style={{ fontWeight: "bold", marginTop: "10px" }}>
                Cashier: {transactions.cashier}
              </div>
            </footer>
          </div>
       
      </Card>
    );
  }
}


export default React.forwardRef((props, ref) => <Invoice {...props} ref={ref} />);
