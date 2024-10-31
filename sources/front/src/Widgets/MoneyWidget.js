import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Draggable from "react-draggable";
import { Card, Typography, Fab, Button, TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ArrowIcon from "@material-ui/icons/TrendingFlat";
import iconMoney from "./../assets/icons/32/money.png";
import fx from "money";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "20%",
    minHeight: "17vh",
    borderRight: "1vh solid #ffcc33",
    color: "#00000",
    textAlign: "center",
    overflow: "visible",
  },
  //Divs
  headerDiv: {
    marginTop: "0.5vh",
    marginLeft: "-15vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contentDiv: {
    marginTop: "3vh",
    marginBottom: "1vh",
  },
  destroyButton: {
    position: "absolute",
    height: "4vh",
    width: "4vh",
    right: "94%",
    top: "-8%",
  },
  smallerIcon: {
    height: "2vh",
    width: "2vh",
  },
  icon: {
    height: "4.5vh",
    width: "4.5vh",
    marginRight: "3vh",
  },
  arrowIcon: {
    height: "3.5vh",
    width: "3.5vh",
    marginTop: "1vh",
  },
  moneyInput1: {
    width: "10vh",
    marginRight: "2vh",
  },
  moneyInput2: {
    width: "10vh",
    marginLeft: "2vh",
  },
}));

export default function MoneyConverter(props) {
  const classes = useStyles();
  const {
    currency,
    canBeDeleted,
    refreshTime,
    widgetsArray,
    index,
    username,
    deleteWidget,
  } = props;
  const [isDeleted, setIsDeleted] = useState(false);
  const [value, setValue] = useState("0");

  const destroyWidget = async () => {
    deleteWidget(index);
  };

  fx.base = "EUR";
  fx.rates = {
    EUR: 1,
    GBP: 0.889838,
    USD: 1.18441,
    INR: 87.8913,
    AUD: 1.62632,
    CAD: 1.55054,
    SGD: 1.59221,
    XBT: 0.000064435,
    ARS: 95.0787,
    CHF: 1.08049,
    HKD: 9.17545,
    AED: 4.34693,
    BRL: 6.44333,
    JPY: 123.721,
    KRW: 1319.98,
    MXN: 23.8607,
    NOK: 10.712,
    NZD: 1.71118,
    QAR: 4.30976,
    RUB: 90.2693,
    THB: 35.9427,
    TWD: 33.7899,
    FRF: 6.55957,
  };
  console.log(`money ${index}`);
  return (
    <Draggable grid={[25, 25]} bounds="parent">
      <Card className={classes.card}>
        {!canBeDeleted ? null : (
          <Fab
            color="secondary"
            className={classes.destroyButton}
            onClick={() => destroyWidget()}
            disabled={isDeleted}
          >
            <CloseIcon className={classes.smallerIcon} />
          </Fab>
        )}
        <div className={classes.headerDiv}>
          <img src={iconMoney} className={classes.icon} />
          <Typography variant="h6">Money Converter</Typography>
        </div>
        <div className={classes.contentDiv}>
          <TextField
            variant="outlined"
            className={classes.moneyInput1}
            label="EUR"
            onChange={(e) => setValue(e.target.value)}
          />
          <ArrowIcon className={classes.arrowIcon}></ArrowIcon>
          <TextField
            variant="outlined"
            disabled
            className={classes.moneyInput2}
            label={currency}
            value={
              value.length === 0
                ? "0"
                : fx.convert(value, { from: "EUR", to: currency })
            }
          />
        </div>
      </Card>
    </Draggable>
  );
}
