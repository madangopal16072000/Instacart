import { Step, StepLabel, Typography, Stepper } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import "./CheckoutSteps.css";
const steps = [
  {
    id: 1,
    label: <Typography>Shipping Details</Typography>,
    icon: <LocalShippingIcon />,
  },
  {
    id: 2,
    label: <Typography>Confirmed Order</Typography>,
    icon: <LibraryAddCheckIcon />,
  },
  {
    id: 3,
    label: <Typography>Payment</Typography>,
    icon: <AccountBalanceIcon />,
  },
];

const stepStyles = {
  boxSizing: "border-box",
};

const CheckoutSteps = ({ activeStep }) => {
  return (
    <>
      <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
        {steps.map((item, index) => (
          <Step
            key={item.id}
            active={activeStep === index}
            completed={activeStep >= index ? true : false}
          >
            <StepLabel
              icon={item.icon}
              style={{
                color: activeStep >= index ? "tomato" : "rgba(0, 0, 0, 0.649)",
              }}
            >
              {item.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </>
  );
};

export default CheckoutSteps;
